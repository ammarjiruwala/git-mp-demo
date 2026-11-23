"use strict";
// Git Map: a panel that shows what Git is doing while you type.
//
// How it works:
//   1. Figure out which folder the terminal is in (so we know which repo to show).
//   2. Whenever anything changes, read the repo's state (src/gitState.js).
//   3. Send that state to the panel (media/map.js), which draws and animates it.

const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { findRepo, readState } = require("./src/gitState");

// The terminal hook (.devcontainer/git-map-hook.sh) appends "folder<TAB>command" here.
const LOG_FILE = path.join(os.homedir(), ".git-map", "commands.log");

let panel = null;
let terminalDir = null;   // folder the terminal is in, as far as we know
let lastCommand = null;   // { text, sent }
let lastMessage = "";     // the last thing we sent, to skip repeats
let refreshTimer = null;
let refreshing = false;
let refreshAgain = false;
const fsWatchers = new Map(); // folder -> fs.FSWatcher

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand("gitMap.open", () => openPanel(context)));

  const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  button.text = "$(git-commit) Git Map";
  button.tooltip = "Show the Git Map";
  button.command = "gitMap.open";
  button.show();
  context.subscriptions.push(button);

  // Source 1: our terminal hook (most reliable: always has the command text).
  watchCommandLog(context);

  // Source 2: VS Code's own terminal tracking (works without the hook,
  // but sometimes reports an empty command).
  if (vscode.window.onDidEndTerminalShellExecution) {
    context.subscriptions.push(vscode.window.onDidEndTerminalShellExecution((e) => {
      const cwd = (e.shellIntegration && e.shellIntegration.cwd) || e.execution.cwd;
      noteCommand(e.execution.commandLine && e.execution.commandLine.value, cwd && cwd.fsPath);
    }));
  }
  if (vscode.window.onDidChangeTerminalShellIntegration) {
    context.subscriptions.push(vscode.window.onDidChangeTerminalShellIntegration((e) => {
      if (e.shellIntegration.cwd) { terminalDir = e.shellIntegration.cwd.fsPath; schedule(); }
    }));
  }

  // Files edited in the editor.
  const watcher = vscode.workspace.createFileSystemWatcher("**/*");
  watcher.onDidChange(() => schedule());
  watcher.onDidCreate(() => schedule());
  watcher.onDidDelete(() => schedule());
  context.subscriptions.push(watcher);

  // Safety net: look again every 1.5 seconds in case a change slipped past.
  const interval = setInterval(() => schedule(0), 1500);
  context.subscriptions.push({ dispose: () => clearInterval(interval) });
  context.subscriptions.push({ dispose: () => fsWatchers.forEach((w) => w.close()) });

  openFirstLesson();
  openPanel(context);
}

// ---------- knowing what the student typed ----------

function noteCommand(text, dir) {
  if (dir) terminalDir = dir;
  if (text && text.trim()) lastCommand = { text: text.trim(), sent: false };
  schedule(50);
}

function watchCommandLog(context) {
  let size = 0;
  try { size = fs.statSync(LOG_FILE).size; } catch { /* no log yet */ }
  const onChange = () => {
    let stat;
    try { stat = fs.statSync(LOG_FILE); } catch { return; }
    if (stat.size < size) size = 0; // the log was cleared
    if (stat.size === size) return;
    const fd = fs.openSync(LOG_FILE, "r");
    const buf = Buffer.alloc(stat.size - size);
    fs.readSync(fd, buf, 0, buf.length, size);
    fs.closeSync(fd);
    size = stat.size;
    const entries = buf.toString("utf8").split("\n").filter(Boolean);
    const last = entries[entries.length - 1];
    if (!last) return;
    const tab = last.indexOf("\t");
    noteCommand(last.slice(tab + 1), last.slice(0, tab));
  };
  fs.watchFile(LOG_FILE, { interval: 250 }, onChange);
  context.subscriptions.push({ dispose: () => fs.unwatchFile(LOG_FILE, onChange) });
}

// ---------- reading the repo and telling the panel ----------

function schedule(delay = 120) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refresh, delay);
}

function workspaceRoot() {
  const folders = vscode.workspace.workspaceFolders;
  return folders && folders.length ? folders[0].uri.fsPath : null;
}

// Before the student has typed anything, show the playground if there is one.
function startingDir() {
  const root = workspaceRoot();
  if (root && fs.existsSync(path.join(root, "workspace", "playground"))) return path.join(root, "workspace", "playground");
  return root;
}

async function refresh() {
  if (!panel) return;
  if (refreshing) { refreshAgain = true; return; }
  refreshing = true;
  try {
    const root = workspaceRoot();
    const repo = await findRepo(terminalDir || startingDir());
    let message;
    if (!repo) {
      message = { type: "hint", text: "The terminal isn't inside a Git repo. Use <code>cd</code> to go into one, for example <code>cd workspace/playground</code>." };
    } else if (root && repo === root && fs.existsSync(path.join(root, "workspace"))) {
      // The demo's own repo: not something students should practice on.
      message = { type: "hint", text: "This is the course folder, not a practice repo. Go into one: <code>cd workspace/playground</code>" };
    } else {
      const state = await readState(repo);
      watchFolder(path.join(repo, ".git"));
      if (state.warehouse.path) watchFolder(state.warehouse.path);
      message = { type: "state", state };
    }
    const json = JSON.stringify(message);
    const newCommand = lastCommand && !lastCommand.sent;
    if (json !== lastMessage || newCommand) {
      lastMessage = json;
      const command = newCommand ? lastCommand.text : null;
      if (lastCommand) lastCommand.sent = true;
      panel.webview.postMessage({ ...message, command });
    }
  } finally {
    refreshing = false;
    if (refreshAgain) { refreshAgain = false; schedule(0); }
  }
}

// Watch a folder (like .git) so the map updates right after a command.
function watchFolder(dir) {
  if (fsWatchers.has(dir) || !fs.existsSync(dir)) return;
  try {
    fsWatchers.set(dir, fs.watch(dir, { recursive: true }, () => schedule()));
  } catch {
    fsWatchers.set(dir, { close() {} }); // not supported here; the 1.5s check covers it
  }
}

// ---------- opening things ----------

function openFirstLesson() {
  const root = workspaceRoot();
  if (!root) return;
  const dir = path.join(root, "lessons");
  if (!fs.existsSync(dir)) return;
  const first = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()[0];
  if (!first) return;
  const alreadyOpen = vscode.window.tabGroups.all.some((g) => g.tabs.some((t) => t.label.includes(first)));
  if (!alreadyOpen) vscode.commands.executeCommand("markdown.showPreview", vscode.Uri.file(path.join(dir, first)));
}

function openPanel(context) {
  if (panel) { panel.reveal(vscode.ViewColumn.Two, true); return; }
  panel = vscode.window.createWebviewPanel("gitMap", "Git Map", { viewColumn: vscode.ViewColumn.Two, preserveFocus: true }, {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")],
  });
  panel.webview.html = pageHtml(panel.webview, context.extensionUri);
  panel.onDidDispose(() => { panel = null; lastMessage = ""; });
  panel.webview.onDidReceiveMessage((m) => { if (m.type === "ready") { lastMessage = ""; schedule(0); } });
}

function pageHtml(webview, extensionUri) {
  const css = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "map.css"));
  const js = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "map.js"));
  const nonce = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="${css}">
<title>Git Map</title>
</head>
<body>
  <header class="top">
    <div class="where"><span id="repoName" class="repo">Git Map</span><span id="branch" class="chip" hidden></span><span id="merging" class="chip warn" hidden>merging</span></div>
    <div class="toggle" role="group" aria-label="View">
      <button type="button" data-view="ship" aria-pressed="true">Shipping view</button>
      <button type="button" data-view="tree" aria-pressed="false">Tree view</button>
    </div>
  </header>
  <div id="command" class="command" hidden></div>
  <p id="caption" class="caption">Waiting for Git…</p>
  <div id="hint" class="hint" hidden></div>
  <main id="main">
    <div id="ship" class="ship">
      <div class="group">
        <div class="group-label">Your laptop</div>
        <div class="row">
          <section class="zone desk" id="z-desk" aria-label="Desk: working directory">
            <h3>Desk <span>working directory</span></h3>
            <ul class="cards" id="desk"></ul>
          </section>
          <div class="flow-h" aria-hidden="true"><span>git add</span><span class="arrow">→</span></div>
          <section class="zone box" id="z-box" aria-label="Box: staging area">
            <h3>Box <span>staging area</span></h3>
            <ul class="cards" id="box"></ul>
          </section>
        </div>
        <div class="flow-v" aria-hidden="true"><span>↓ git commit</span></div>
        <section class="zone shelf" id="z-shelf" aria-label="Shelf: local repository">
          <h3>Shelf <span id="shelfSub">local repository</span></h3>
          <ol class="parcels" id="shelf"></ol>
        </section>
      </div>
      <div class="flow-v" aria-hidden="true"><span>↓ git push</span><span>↑ git pull</span></div>
      <div class="group cloud">
        <div class="group-label">GitHub (the cloud)</div>
        <section class="zone wh" id="z-wh" aria-label="Warehouse: remote repository">
          <h3>Warehouse <span id="whSub">remote repository</span></h3>
          <ol class="parcels" id="wh"></ol>
        </section>
      </div>
    </div>
    <div id="tree" class="tree" hidden></div>
  </main>
  <script nonce="${nonce}" src="${js}"></script>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };
