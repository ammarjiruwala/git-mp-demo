"use strict";
// Reads a Git repo and returns everything the map draws:
//   desk      = changed files not staged yet   (working directory)
//   box       = staged files                   (staging area)
//   shelf     = recent commits on this branch  (local repository)
//   warehouse = commits on the remote          (GitHub, or our local stand-in)
//   graph     = recent commits with lanes, for the tree view
// Plain Node, no VS Code, so it can be tested on its own.

const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

// Run a git command. Resolves to its output, or null if it failed.
// GIT_OPTIONAL_LOCKS=0 stops our background `git status` from locking the
// repo while the student is running their own commands.
function git(cwd, args) {
  return new Promise((resolve) => {
    execFile(
      "git", args,
      { cwd, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } },
      (err, stdout) => resolve(err ? null : stdout)
    );
  });
}

// The top folder of the repo that contains `dir`, or null.
async function findRepo(dir) {
  if (!dir || !fs.existsSync(dir)) return null;
  const out = await git(dir, ["rev-parse", "--show-toplevel"]);
  return out ? out.trim() : null;
}

// ---------- git status ----------

const CONFLICT_CODES = new Set(["DD", "AU", "UD", "UA", "DU", "AA", "UU"]);
const KIND = { M: "modified", A: "new", D: "deleted", R: "renamed", C: "copied", T: "modified" };

// Parses `git status --porcelain=v1 -z`. Each entry is "XY path":
// X = what's staged (box), Y = what's changed but not staged (desk).
function parseStatus(text) {
  const desk = [];
  const box = [];
  const parts = (text || "").split("\0");
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i];
    if (entry.length < 4) continue;
    const x = entry[0];
    const y = entry[1];
    const file = entry.slice(3);
    if (x === "R" || x === "C") i++; // the next part is the old file name
    if (x === "?" && y === "?") { desk.push({ path: file, kind: "untracked" }); continue; }
    if (x === "!") continue;
    if (CONFLICT_CODES.has(x + y)) { desk.push({ path: file, kind: "conflict" }); continue; }
    if (x !== " ") box.push({ path: file, kind: KIND[x] || "modified" });
    if (y !== " ") desk.push({ path: file, kind: KIND[y] || "modified" });
  }
  return { desk, box };
}

// ---------- git log ----------

// Fields separated by \x1f, commits by \x1e.
const FORMAT = "--format=%H%x1f%h%x1f%P%x1f%an%x1f%s%x1e";

function parseLog(text) {
  return (text || "")
    .split("\x1e")
    .map((s) => s.replace(/^\n/, ""))
    .filter(Boolean)
    .map((s) => {
      const [hash, short, parents, author, msg] = s.split("\x1f");
      return { hash, short, parents: parents ? parents.split(" ") : [], author, msg };
    });
}

function parseRefs(text) {
  const refs = [];
  for (const line of (text || "").split("\n")) {
    if (!line) continue;
    const [hash, name] = line.split(" ");
    if (name.startsWith("refs/heads/")) refs.push({ hash, name: name.slice(11), kind: "branch" });
    else if (name.startsWith("refs/remotes/")) {
      if (name.endsWith("/HEAD")) continue;
      refs.push({ hash, name: name.slice(13), kind: "remote" });
    } else if (name.startsWith("refs/tags/")) refs.push({ hash, name: name.slice(10), kind: "tag" });
  }
  return refs;
}

// Gives each commit a lane (column) for the tree view, like `git log --graph`.
// `commits` must be newest first, in topological order.
function layoutLanes(commits) {
  const lanes = []; // lanes[i] = the commit we expect next in column i
  return commits.map((c) => {
    let lane = lanes.indexOf(c.hash);
    if (lane === -1) {
      lane = lanes.indexOf(null);
      if (lane === -1) { lane = lanes.length; lanes.push(null); }
    }
    // Other columns waiting for this same commit end here (branches joining).
    for (let i = 0; i < lanes.length; i++) if (i !== lane && lanes[i] === c.hash) lanes[i] = null;
    lanes[lane] = c.parents[0] || null;
    // Extra parents (merges) continue in their own column.
    for (const p of c.parents.slice(1)) {
      if (lanes.includes(p)) continue;
      let free = lanes.indexOf(null);
      if (free === -1) { free = lanes.length; lanes.push(null); }
      lanes[free] = p;
    }
    return { ...c, lane };
  });
}

const lines = (text) => (text || "").split("\n").filter(Boolean);

// ---------- the warehouse (remote) ----------

// If the remote is a folder on this machine (our stand-in for GitHub), we read it
// directly, so the map shows a teammate's push before the student fetches.
// For a real GitHub remote, we show what the laptop last heard (origin/...).
async function readWarehouse(repo, url, branch) {
  const result = { connected: Boolean(url), live: false, label: url || "", branch: null, commits: [], hashes: new Set(), branchHashes: [] };
  if (!url) return result;

  const isNetwork = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) && !url.startsWith("file://");
  const isSsh = /^[\w.-]+@[\w.-]+:/.test(url);
  if (!isNetwork && !isSsh) {
    const dir = path.resolve(repo, url.replace(/^file:\/\//, ""));
    if (fs.existsSync(dir)) {
      let wb = branch;
      if (!wb || !(await git(dir, ["rev-parse", "-q", "--verify", "refs/heads/" + wb]))) {
        const def = await git(dir, ["symbolic-ref", "--short", "-q", "HEAD"]);
        wb = def ? def.trim() : null;
      }
      const hasBranch = wb && (await git(dir, ["rev-parse", "-q", "--verify", "refs/heads/" + wb]));
      result.live = true;
      result.label = path.basename(dir);
      result.path = dir;
      result.branch = hasBranch ? wb : null;
      result.hashes = new Set(lines(await git(dir, ["rev-list", "--all"])));
      if (hasBranch) {
        result.commits = parseLog(await git(dir, ["log", "-n", "6", FORMAT, "refs/heads/" + wb]));
        result.branchHashes = lines(await git(dir, ["rev-list", "refs/heads/" + wb]));
      }
      return result;
    }
  }

  // Real remote: use what this laptop last fetched.
  let ref = branch ? "refs/remotes/origin/" + branch : null;
  if (!ref || !(await git(repo, ["rev-parse", "-q", "--verify", ref]))) {
    ref = (await git(repo, ["rev-parse", "-q", "--verify", "refs/remotes/origin/HEAD"])) ? "refs/remotes/origin/HEAD" : null;
  }
  result.hashes = new Set(lines(await git(repo, ["rev-list", "--remotes=origin"])));
  if (ref) {
    result.branch = ref.replace("refs/remotes/origin/", "");
    result.commits = parseLog(await git(repo, ["log", "-n", "6", FORMAT, ref]));
    result.branchHashes = lines(await git(repo, ["rev-list", ref]));
  }
  return result;
}

// ---------- everything together ----------

async function readState(repo) {
  const [statusOut, branchOut, headOut, logOut, refsOut, urlOut, gitDirOut, localAllOut] = await Promise.all([
    git(repo, ["status", "--porcelain=v1", "-z", "-uall"]),
    git(repo, ["symbolic-ref", "--short", "-q", "HEAD"]),
    git(repo, ["rev-parse", "-q", "--verify", "HEAD"]),
    git(repo, ["log", "--all", "--topo-order", "-n", "40", FORMAT]),
    git(repo, ["for-each-ref", "--format=%(objectname) %(refname)", "refs/heads", "refs/remotes", "refs/tags"]),
    git(repo, ["config", "--get", "remote.origin.url"]),
    git(repo, ["rev-parse", "--absolute-git-dir"]),
    git(repo, ["rev-list", "--all"]),
  ]);

  const { desk, box } = parseStatus(statusOut);
  const branch = branchOut ? branchOut.trim() : null;
  const head = headOut ? headOut.trim() : null;
  const gitDir = gitDirOut ? gitDirOut.trim() : null;
  const merging = Boolean(gitDir && fs.existsSync(path.join(gitDir, "MERGE_HEAD")));
  const localAll = new Set(lines(localAllOut));

  const wh = await readWarehouse(repo, urlOut ? urlOut.trim() : null, branch);
  const onWarehouse = (hash) => wh.hashes.has(hash);

  const shelf = head
    ? parseLog(await git(repo, ["log", "-n", "6", FORMAT, "HEAD"])).map((c) => ({ ...c, pushed: onWarehouse(c.hash) }))
    : [];
  const headHistory = head ? lines(await git(repo, ["rev-list", "HEAD"])) : [];

  return {
    repo,
    name: path.basename(repo),
    branch,
    head,
    merging,
    desk,
    box,
    shelf,
    ahead: wh.connected ? headHistory.filter((h) => !onWarehouse(h)).length : 0,
    behind: wh.branchHashes.filter((h) => !localAll.has(h)).length,
    warehouse: {
      connected: wh.connected,
      live: wh.live,
      label: wh.label,
      path: wh.path || null,
      branch: wh.branch,
      commits: wh.commits.map((c) => ({ ...c, local: localAll.has(c.hash) })),
    },
    graph: layoutLanes(parseLog(logOut)).map((c) => ({ ...c, onWarehouse: onWarehouse(c.hash) })),
    refs: parseRefs(refsOut),
  };
}

module.exports = { findRepo, readState, parseStatus, parseLog, layoutLanes, git };
