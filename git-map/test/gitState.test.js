// Tests for src/gitState.js. Run with: npm test (from the git-map folder).
// Builds small real repos in a temp folder and checks what the map would show.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { readState, parseStatus, layoutLanes } = require("../src/gitState");

const env = { ...process.env, GIT_AUTHOR_NAME: "Test", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "Test", GIT_COMMITTER_EMAIL: "t@example.com" };
const run = (cwd, ...args) => execFileSync("git", args, { cwd, env, stdio: "pipe" }).toString();
const write = (dir, file, text) => fs.writeFileSync(path.join(dir, file), text);

// A warehouse (bare repo) with one commit, and a clone of it.
function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gitmap-"));
  const seed = path.join(root, "seed");
  fs.mkdirSync(seed);
  run(seed, "init", "-q", "-b", "main");
  write(seed, "team.md", "# Team\n");
  run(seed, "add", ".");
  run(seed, "commit", "-q", "-m", "First");
  run(root, "clone", "-q", "--bare", seed, "warehouse.git");
  run(root, "clone", "-q", "warehouse.git", "laptop");
  return { root, laptop: path.join(root, "laptop"), warehouse: path.join(root, "warehouse.git") };
}

test("parseStatus sorts files onto the desk and into the box", () => {
  const out = ["M  staged.txt", " M changed.txt", "MM both.txt", "?? new.txt", "UU conflict.txt", ""].join("\0");
  const { desk, box } = parseStatus(out);
  assert.deepEqual(box.map((f) => f.path), ["staged.txt", "both.txt"]);
  assert.deepEqual(desk.map((f) => [f.path, f.kind]), [["changed.txt", "modified"], ["both.txt", "modified"], ["new.txt", "untracked"], ["conflict.txt", "conflict"]]);
});

test("layoutLanes puts a side branch in its own lane and joins it at the merge", () => {
  // m = merge of a (main) and b (branch); both come from root r.
  const commits = [
    { hash: "m", parents: ["a", "b"] },
    { hash: "b", parents: ["r"] },
    { hash: "a", parents: ["r"] },
    { hash: "r", parents: [] },
  ];
  const lanes = Object.fromEntries(layoutLanes(commits, new Set(["m", "a", "r"])).map((c) => [c.hash, c.lane]));
  assert.equal(lanes.m, 0);
  assert.equal(lanes.a, 0);
  assert.equal(lanes.b, 1);
  assert.equal(lanes.r, 0);
});

test("layoutLanes keeps the branch you're on in lane 0 even when another branch is newer", () => {
  // f (feature, newest) and a (main) both come from r. We're on main.
  const commits = [
    { hash: "f", parents: ["r"] },
    { hash: "a", parents: ["r"] },
    { hash: "r", parents: [] },
  ];
  const lanes = Object.fromEntries(layoutLanes(commits, new Set(["a", "r"])).map((c) => [c.hash, c.lane]));
  assert.equal(lanes.a, 0);
  assert.equal(lanes.r, 0);
  assert.equal(lanes.f, 1);
});

test("edit, add, commit, push move things from desk to box to shelf to warehouse", async () => {
  const { laptop } = setup();

  let s = await readState(laptop);
  assert.equal(s.branch, "main");
  assert.equal(s.desk.length, 0);
  assert.equal(s.warehouse.live, true);
  assert.equal(s.shelf[0].pushed, true);

  write(laptop, "team.md", "# Team\n- Me\n");
  s = await readState(laptop);
  assert.deepEqual(s.desk.map((f) => f.path), ["team.md"]);

  run(laptop, "add", "team.md");
  s = await readState(laptop);
  assert.deepEqual(s.box.map((f) => f.path), ["team.md"]);
  assert.equal(s.desk.length, 0);

  run(laptop, "commit", "-q", "-m", "Add me");
  s = await readState(laptop);
  assert.equal(s.box.length, 0);
  assert.equal(s.shelf[0].msg, "Add me");
  assert.equal(s.shelf[0].pushed, false);
  assert.equal(s.ahead, 1);

  run(laptop, "push", "-q");
  s = await readState(laptop);
  assert.equal(s.shelf[0].pushed, true);
  assert.equal(s.ahead, 0);
  assert.equal(s.warehouse.commits[0].msg, "Add me");
});

test("a teammate's push shows in the warehouse before the student fetches", async () => {
  const { root, laptop } = setup();
  run(root, "clone", "-q", "warehouse.git", "tess");
  const tess = path.join(root, "tess");
  write(tess, "notes.md", "hi\n");
  run(tess, "add", ".");
  run(tess, "commit", "-q", "-m", "Tess was here");
  run(tess, "push", "-q");

  let s = await readState(laptop);
  assert.equal(s.warehouse.commits[0].msg, "Tess was here");
  assert.equal(s.warehouse.commits[0].local, false);
  assert.equal(s.behind, 1);

  run(laptop, "pull", "-q", "--no-rebase");
  s = await readState(laptop);
  assert.equal(s.warehouse.commits[0].local, true);
  assert.equal(s.behind, 0);
});

test("a merge conflict shows the file as a conflict and sets merging", async () => {
  const { laptop } = setup();
  run(laptop, "switch", "-q", "-c", "other");
  write(laptop, "team.md", "other side\n");
  run(laptop, "commit", "-q", "-am", "Other");
  run(laptop, "switch", "-q", "main");
  write(laptop, "team.md", "main side\n");
  run(laptop, "commit", "-q", "-am", "Main");
  try { run(laptop, "merge", "other"); } catch { /* conflict expected */ }
  const s = await readState(laptop);
  assert.equal(s.merging, true);
  assert.deepEqual(s.desk.map((f) => [f.path, f.kind]), [["team.md", "conflict"]]);
});

test("a repo with no commits and no remote doesn't crash", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gitmap-empty-"));
  run(dir, "init", "-q", "-b", "main");
  write(dir, "a.txt", "x");
  const s = await readState(dir);
  assert.equal(s.head, null);
  assert.equal(s.shelf.length, 0);
  assert.equal(s.warehouse.connected, false);
  assert.deepEqual(s.desk.map((f) => f.kind), ["untracked"]);
});
