// Phase 0 test version of Git Map.
// It answers three questions about running inside GitHub Codespaces:
//   1. Did the extension install and start by itself?  (the panel opens)
//   2. Can it see the commands typed in the terminal?  (they appear in the panel)
//   3. Can it tell which folder the terminal is in?    (shown next to each command)
const vscode = require("vscode");

let panel = null;
const log = []; // every terminal command we've seen, newest last

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("gitMap.open", openPanel)
  );

  // Fires after a command finishes in a terminal that has shell integration.
  if (vscode.window.onDidEndTerminalShellExecution) {
    context.subscriptions.push(
      vscode.window.onDidEndTerminalShellExecution((e) => {
        const cwd = e.execution.cwd ? e.execution.cwd.fsPath : "(unknown folder)";
        log.push({ cmd: e.execution.commandLine.value, cwd, exitCode: e.exitCode });
        render();
      })
    );
  }

  openPanel();
}

function openPanel() {
  if (panel) { panel.reveal(); return; }
  panel = vscode.window.createWebviewPanel(
    "gitMap", "Git Map", vscode.ViewColumn.Two, { enableScripts: false }
  );
  panel.onDidDispose(() => { panel = null; });
  render();
}

function escape(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function render() {
  if (!panel) return;
  const canSee = Boolean(vscode.window.onDidEndTerminalShellExecution);
  const rows = log.slice(-15).reverse().map((l) =>
    `<li><code>${escape(l.cmd)}</code><br><small>in ${escape(l.cwd)} · exit code ${l.exitCode ?? "?"}</small></li>`
  ).join("");
  panel.webview.html = `<!doctype html><html><body style="font-family: sans-serif; padding: 16px; line-height: 1.5">
    <h2>Git Map: Phase 0 test</h2>
    <p>✅ <b>Test 1 passed:</b> the extension installed and started by itself.</p>
    <p>${canSee ? "⏳" : "❌"} <b>Test 2:</b> ${canSee
      ? "type any command in the terminal below (try <code>ls</code>, then <code>cd lessons</code>, then <code>pwd</code>). It should appear here within a second."
      : "this version of VS Code can't report terminal commands to extensions."}</p>
    <p><b>Test 3:</b> each command should show the folder it ran in.</p>
    <h3>Commands seen (${log.length})</h3>
    <ul>${rows || "<li><i>None yet. Type something in the terminal.</i></li>"}</ul>
  </body></html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };
