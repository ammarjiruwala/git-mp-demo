// Git Map panel: draws the repo state the extension sends, and animates what changed.
// Each item on screen has a key like "desk:team.md" or "shelf:<commit hash>".
// When an item appears in a new place, we look for where the same thing was a moment
// ago (for example "desk:team.md" before "box:team.md") and fly it from there.
(function () {
  "use strict";
  const vscode = acquireVsCodeApi();
  const $ = (s) => document.querySelector(s);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let view = (vscode.getState() || {}).view || "ship";
  let prev = null;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const LANES = ["blue", "orange", "green", "purple", "red", "yellow"];
  const laneColor = (l) => `var(--vscode-charts-${LANES[l % LANES.length]})`;

  // ---------- view toggle ----------
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => { view = b.dataset.view; vscode.setState({ view }); applyView(); })
  );
  function applyView() {
    $("#ship").hidden = view !== "ship";
    $("#tree").hidden = view !== "tree";
    document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
  }
  applyView();

  // ---------- messages from the extension ----------
  window.addEventListener("message", (e) => {
    const m = e.data;
    if (m.type === "hint") {
      $("#main").hidden = true;
      $("#caption").hidden = true;
      $("#hint").hidden = false;
      const here = $("#here");
      const html = (m.where || []).map((p) => `<span class="crumb">${esc(p)}</span>`).join('<span class="sep">›</span>');
      if (here.innerHTML !== html) {
        here.innerHTML = html;
        here.classList.remove("flash");
        void here.offsetWidth; // restart the highlight
        here.classList.add("flash");
      }
      $("#hintText").innerHTML = m.text;
      $("#branch").hidden = true;
      $("#merging").hidden = true;
      $("#repoName").textContent = "Git Map";
      showCommand(m.command);
      prev = null;
    }
    if (m.type === "state") update(m.state, m.command);
  });
  vscode.postMessage({ type: "ready" });

  function update(s, command) {
    $("#hint").hidden = true;
    $("#caption").hidden = false;
    $("#main").hidden = false;
    const sameRepo = prev && prev.repo === s.repo;
    const ev = sameRepo ? diff(prev, s) : null;
    const before = view === "ship" ? measure() : new Map();

    renderHeader(s);
    renderShip(s);
    renderTree(s);
    if (ev && view === "ship" && !reduceMotion) animate(before, ev);

    showCommand(command);
    const text = sameRepo ? captionFor(ev, command, s) : `Showing <b>${esc(s.name)}</b>. Edit a file or run a Git command and watch what moves.`;
    if (text) $("#caption").innerHTML = text;
    prev = s;
  }

  function showCommand(command) {
    const el = $("#command");
    if (!command) return;
    el.hidden = false;
    el.textContent = "$ " + command;
    el.classList.remove("flash");
    void el.offsetWidth; // restart the highlight animation
    el.classList.add("flash");
  }

  // ---------- what changed between two states ----------
  function diff(a, b) {
    const ev = { staged: [], unstaged: [], edited: [], created: [], gone: [], pushed: [], arrived: [], pulled: [], committed: null, merged: false, switched: null, conflict: false, resolved: false };
    const aDesk = new Set(a.desk.map((f) => f.path));
    const bDesk = new Set(b.desk.map((f) => f.path));
    const aBox = new Set(a.box.map((f) => f.path));
    const bBox = new Set(b.box.map((f) => f.path));

    for (const f of b.box) if (!aBox.has(f.path)) ev.staged.push(f.path);
    for (const f of b.desk) {
      if (aDesk.has(f.path)) continue;
      if (aBox.has(f.path) && !bBox.has(f.path)) ev.unstaged.push(f.path);
      else if (f.kind === "untracked") ev.created.push(f.path);
      else ev.edited.push(f.path);
    }
    for (const p of aDesk) if (!bDesk.has(p) && !bBox.has(p)) ev.gone.push(p);

    if (a.branch !== b.branch) ev.switched = b.branch || "an old commit (detached HEAD)";

    const known = new Set(a.graph.map((c) => c.hash));
    const aWh = new Map(a.warehouse.commits.map((c) => [c.hash, c]));
    const cameFromWarehouse = (h) => aWh.has(h) && !aWh.get(h).local;

    if (b.head && b.head !== a.head && !known.has(b.head) && !cameFromWarehouse(b.head)) {
      ev.committed = b.head;
      const c = b.graph.find((x) => x.hash === b.head);
      ev.merged = Boolean(c && c.parents.length > 1);
    }
    for (const c of b.shelf) {
      const old = a.shelf.find((x) => x.hash === c.hash);
      if (c.pushed && old && !old.pushed) ev.pushed.push(c.hash);
    }
    for (const c of b.warehouse.commits) if (!aWh.has(c.hash) && !c.local) ev.arrived.push(c.hash);
    for (const c of b.graph) if (!known.has(c.hash) && cameFromWarehouse(c.hash)) ev.pulled.push(c.hash);

    ev.conflict = !a.merging && b.merging;
    ev.resolved = a.merging && !b.merging;
    return ev;
  }

  // ---------- the plain-English caption ----------
  function captionFor(ev, command, s) {
    const files = (arr) => arr.map((p) => `<b>${esc(p)}</b>`).join(", ");
    const commit = (h) => s.graph.find((c) => c.hash === h) || s.warehouse.commits.find((c) => c.hash === h) || { short: h.slice(0, 7), msg: "", author: "someone" };

    if (ev.conflict) {
      const bad = s.desk.filter((f) => f.kind === "conflict").map((f) => f.path);
      return `<span class="warn-text">Merge conflict.</span> Both sides changed the same lines of ${files(bad)}. Open the file, keep what's right, then <code>git add</code> it and <code>git commit</code>.`;
    }
    if (ev.committed) {
      const c = commit(ev.committed);
      if (ev.merged) return `Merge commit <b>${esc(c.short)}</b> joins two lines of history. It's on your <b>shelf</b> (local repository). Switch to the tree view to see the lines meet.`;
      return `You sealed the box. Commit <b>${esc(c.short)}</b> “${esc(c.msg)}” is on your <b>shelf</b> (local repository). Only your laptop has it until you <code>git push</code>.`;
    }
    if (ev.pushed.length) return `You shipped ${plural(ev.pushed.length, "box", "boxes")} to the <b>warehouse</b> (GitHub). Your teammates can get ${ev.pushed.length === 1 ? "it" : "them"} now.`;
    if (ev.pulled.length) return `You brought ${plural(ev.pulled.length, "box", "boxes")} down from the warehouse. Your laptop is caught up.`;
    if (ev.arrived.length) {
      const c = commit(ev.arrived[0]);
      return `A new box arrived at the <b>warehouse</b> from <b>${esc(c.author)}</b>. Your laptop doesn't have it yet. <code>git pull</code> brings it down.`;
    }
    if (ev.resolved) return `The merge is finished.`;
    if (ev.switched) return `You switched to <b>${esc(ev.switched)}</b>. The files on your desk changed to match it.`;
    if (ev.staged.length) return `${files(ev.staged)} went into the <b>box</b> (staging area). ${ev.staged.length === 1 ? "It's" : "They're"} packed for your next commit, but nothing is saved yet.`;
    if (ev.unstaged.length) return `${files(ev.unstaged)} came back out of the box onto your <b>desk</b>. The change is still there, just not packed.`;
    if (ev.created.length) return `New file ${files(ev.created)} is on your <b>desk</b>. Git calls it <i>untracked</i> until you <code>git add</code> it.`;
    if (ev.edited.length) return `You changed ${files(ev.edited)}. The change is only on your <b>desk</b> (working directory). Git hasn't saved anything.`;
    if (ev.gone.length) return `The changes to ${files(ev.gone)} are gone from your desk.`;

    if (command) {
      const c = command.trim();
      if (/^git\s+push\b/.test(c)) return `Nothing was shipped. If Git said <i>rejected</i>, the warehouse has a box you don't have. Run <code>git pull</code> first, then push again.`;
      if (/^git\s+(status|log|diff|show|remote|branch\s*$)/.test(c)) return `<code>${esc(c.split(/\s+/).slice(0, 2).join(" "))}</code> only looks. Nothing moved.`;
      if (/^git\s+add\b/.test(c)) return `Nothing new went into the box. Was the file already packed, or not changed?`;
      if (/^git\s+commit\b/.test(c)) return `No commit was made. Is the box empty? Use <code>git add</code> first.`;
    }
    return null;
  }

  // ---------- drawing the shipping view ----------
  const KIND_LABEL = { untracked: "new", new: "new", modified: "changed", deleted: "deleted", renamed: "renamed", copied: "copied", conflict: "conflict" };

  function card(zone, f) {
    return `<li class="card k-${esc(f.kind)}" data-key="${zone}:${esc(f.path)}"><span class="doc" aria-hidden="true"></span><span class="fname">${esc(f.path)}</span><span class="badge">${KIND_LABEL[f.kind] || f.kind}</span></li>`;
  }

  function parcel(zone, c, tag) {
    return `<li class="parcel${tag ? " tagged" : ""}" data-key="${zone}:${esc(c.hash)}" title="${esc(c.msg)} (${esc(c.short)})">
      <span class="tape" aria-hidden="true"></span>
      <span class="hash">${esc(c.short)}</span>
      <span class="msg">${esc(c.msg)}</span>
      <span class="by">${esc(c.author)}</span>
      ${tag ? `<span class="tag">${tag}</span>` : ""}
    </li>`;
  }

  function renderHeader(s) {
    $("#repoName").textContent = s.name;
    const b = $("#branch");
    b.hidden = false;
    b.textContent = s.branch ? "branch: " + s.branch : "detached HEAD";
    $("#merging").hidden = !s.merging;
  }

  function renderShip(s) {
    $("#desk").innerHTML = s.desk.length ? s.desk.map((f) => card("desk", f)).join("") : `<li class="empty">Clean. Nothing changed since your last commit.</li>`;
    $("#box").innerHTML = s.box.length ? s.box.map((f) => card("box", f)).join("") : `<li class="empty">Empty. <code>git add</code> puts changes here.</li>`;

    $("#shelfSub").textContent = "local repository" + (s.branch ? " · " + s.branch : "") + (s.ahead ? ` · ${plural(s.ahead, "box", "boxes")} not shipped` : "");
    $("#shelf").innerHTML = s.shelf.length
      ? s.shelf.map((c) => parcel("shelf", c, s.warehouse.connected && !c.pushed ? "only on your laptop" : "")).join("")
      : `<li class="empty">No commits yet.</li>`;

    const w = s.warehouse;
    if (!w.connected) {
      $("#whSub").textContent = "not connected";
      $("#wh").innerHTML = `<li class="empty">This repo has no remote, so there's nowhere to push.</li>`;
      return;
    }
    $("#whSub").textContent = (w.live ? "remote repository" : "what your laptop last heard (git fetch updates it)") + (w.branch ? " · " + w.branch : "") + (s.behind ? ` · ${plural(s.behind, "box", "boxes")} you don't have` : "");
    $("#wh").innerHTML = w.commits.length
      ? w.commits.map((c) => parcel("wh", c, c.local ? "" : "not on your laptop yet")).join("")
      : `<li class="empty">Empty.</li>`;
  }

  // ---------- drawing the tree view ----------
  function renderTree(s) {
    const rows = s.graph;
    if (!rows.length) { $("#tree").innerHTML = `<p class="empty">No commits yet.</p>`; return; }
    const H = 30, LW = 18, TOP = H / 2;
    const maxLane = Math.max(...rows.map((c) => c.lane));
    const gx = (l) => 12 + l * LW;
    const gy = (i) => TOP + i * H;
    const width = gx(maxLane) + 14;
    const index = new Map(rows.map((c, i) => [c.hash, i]));

    let paths = "";
    rows.forEach((c, i) => {
      c.parents.forEach((p, k) => {
        const x1 = gx(c.lane), y1 = gy(i);
        const j = index.get(p);
        if (j === undefined) { paths += `<path d="M${x1} ${y1} L${x1} ${y1 + H * 0.7}" style="stroke:${laneColor(c.lane)}" class="edge faded"/>`; return; }
        const pc = rows[j];
        const x2 = gx(pc.lane), y2 = gy(j);
        let d;
        if (x1 === x2) d = `M${x1} ${y1} L${x2} ${y2}`;
        else if (k === 0) d = `M${x1} ${y1} L${x1} ${y2 - H} C${x1} ${y2 - H * 0.3} ${x2} ${y2 - H * 0.7} ${x2} ${y2}`;
        else d = `M${x1} ${y1} C${x1} ${y1 + H * 0.7} ${x2} ${y1 + H * 0.3} ${x2} ${y1 + H} L${x2} ${y2}`;
        paths += `<path d="${d}" style="stroke:${laneColor(k === 0 ? c.lane : pc.lane)}" class="edge"/>`;
      });
    });
    let dots = "";
    rows.forEach((c, i) => {
      const hollow = s.warehouse.connected && !c.onWarehouse;
      dots += `<circle cx="${gx(c.lane)}" cy="${gy(i)}" r="6" style="stroke:${laneColor(c.lane)};fill:${hollow ? "var(--vscode-editor-background)" : laneColor(c.lane)}" ${hollow ? 'stroke-dasharray="3 2"' : ""} class="dot"><title>${esc(c.msg)}</title></circle>`;
    });

    const refsAt = new Map();
    for (const r of s.refs) { if (!refsAt.has(r.hash)) refsAt.set(r.hash, []); refsAt.get(r.hash).push(r); }

    const text = rows.map((c, i) => {
      const refs = (refsAt.get(c.hash) || []).map((r) => {
        const isHead = r.kind === "branch" && r.name === s.branch;
        const cls = isHead ? "ref head" : "ref " + r.kind;
        return `<span class="${cls}">${isHead ? "HEAD → " : ""}${esc(r.name)}</span>`;
      });
      if (!s.branch && c.hash === s.head) refs.unshift(`<span class="ref head">HEAD</span>`);
      return `<div class="trow" style="top:${gy(i) - H / 2}px;height:${H}px;padding-left:${width + 6}px">${refs.join("")}<span class="tmsg">${esc(c.msg)}</span><span class="tmeta">${esc(c.author)} · ${esc(c.short)}</span></div>`;
    }).join("");

    $("#tree").innerHTML = `
      <p class="legend"><span><i class="ldot"></i>on the warehouse</span><span><i class="ldot hollow"></i>only on your laptop</span><span>newest at the top</span></p>
      <div class="tgraph" style="height:${gy(rows.length - 1) + H / 2 + 4}px">
        <svg width="${width}" height="${gy(rows.length - 1) + H / 2 + 4}" aria-hidden="true">${paths}${dots}</svg>
        ${text}
      </div>`;
  }

  // ---------- animation ----------
  function measure() {
    const m = new Map();
    document.querySelectorAll("#ship [data-key]").forEach((el) => m.set(el.dataset.key, el.getBoundingClientRect()));
    for (const z of ["desk", "box", "shelf", "wh"]) { const el = $("#z-" + z); if (el) m.set("zone:" + z, el.getBoundingClientRect()); }
    return m;
  }

  // Where a newly shown item most likely came from.
  const CAME_FROM = { box: "desk", desk: "box", shelf: "wh", wh: "shelf" };

  function animate(before, ev) {
    document.querySelectorAll("#ship [data-key]").forEach((el) => {
      const key = el.dataset.key;
      if (before.has(key)) return;
      const zone = key.slice(0, key.indexOf(":"));
      const id = key.slice(key.indexOf(":") + 1);
      let from = before.get(CAME_FROM[zone] + ":" + id);
      if (!from && zone === "shelf" && ev.committed === id) from = before.get("zone:box");
      if (from && from.width) fly(el, from);
      else el.classList.add("appear");
      if (zone === "shelf" && ev.committed === id) el.classList.add("stamp");
      if (zone === "wh" && ev.arrived.includes(id)) el.classList.add("arrive");
    });
    if (ev.conflict) $("#z-desk").classList.add("shake");
    setTimeout(() => $("#z-desk").classList.remove("shake"), 700);
  }

  function fly(el, from) {
    const to = el.getBoundingClientRect();
    if (!to.width) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.92)`, opacity: 0.7 },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 18}px) scale(1.04)`, opacity: 1, offset: 0.55 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 800, easing: "cubic-bezier(.25,.8,.25,1)" }
    );
  }
})();
