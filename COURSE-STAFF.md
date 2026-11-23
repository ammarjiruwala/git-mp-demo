# Git MP: overview for course staff

*Proposed CS124H MP · prepared by Ammar (Group 10 PM) · status: playable end to end, ready for review*

**Try it:** [Open in GitHub Codespaces](https://codespaces.new/ammarjiruwala/git-mp-demo) (free GitHub account, about 2 minutes to start) · [Repo](https://github.com/ammarjiruwala/git-mp-demo)

---

## In one paragraph

Students learn Git by joining a fictional student team building **Snack Map**, a campus app for late-night snacks. Over 20 short chapters they clone the team's repo, ship their first commit, get their push rejected when a teammate pushes first, resolve a merge conflict, open a pull request, check an AI agent's commit, rescue five broken repos, and track down the commit that broke the homepage. Everything uses **real Git** in a browser-based VS Code, and a live **Git Map** panel shows where their files and commits go after every command.

## Why

Git is the first wall our students hit. They need it for the group project from week one, and to most of them it's invisible: `add`, `commit` and `push` all seem to "save", nobody can see the difference, and when something goes wrong (a rejected push, a conflict, a detached HEAD) the usual fix is to delete the folder and clone again. This MP makes Git visible, lets students practice the scary moments somewhere safe, and wraps it in a story so it doesn't feel like memorizing commands.

## What students do

**Part 1: First week on the team** (about 2 hours, 11 chapters). The core workflow: the terminal, `clone`, `status` and `log` (including how to get around Git's viewer), `add`, `commit`, `push` and `pull`, branches, merging, merge conflicts, pull requests, and reviewing an AI agent's work with `git show` and `git diff`.

**Part 2: Rescue mission** (about 45 minutes, 5 chapters). Five repos left in a mess: an unfinished merge, uncommitted work blocking a switch (`git stash`), a detached HEAD, a bad commit that was already pushed (`git revert` vs `git reset`), and a committed password (`.gitignore`, and why history remembers).

**Part 3: Who broke main?** (about 45 minutes, 4 chapters). A detective case through three days of commits by four people: filtering `git log`, `git show`, `git blame`, checking out old commits to run a test, `git bisect`, and fixing the bug with `git revert`.

Every chapter follows the same pattern: **story → the idea → commands table → "Try it" in a practice repo → mission → one-line takeaway.**

## What's different about it

- **The Git Map.** A VS Code panel we built that reacts live to the student's real repo. It uses one picture throughout: your **desk** (working directory), a **box** you're packing (staging area), your **shelf** of sealed boxes (local repository), and the team **warehouse** (GitHub).
  - `git add` slides a file from the desk into the box.
  - `git commit` seals the box and puts it on the shelf.
  - `git push` ships it to the warehouse.

  A tree view draws the same history as a subway map of branches. A caption explains each change in plain English. If Git's viewer opens, a banner shows the keys to get around it and quit.
- **Real Git, nothing simulated.** Students type real commands in a real terminal, so what they learn carries straight over to their project. The "warehouse" is a local stand-in for GitHub, so they can't damage anything real.
- **Robot teammates.**
  - **Tess** pushes right after the student's first push, so their next push is rejected. That's the most panic-inducing moment on group projects, practiced on purpose.
  - **Priya** reviews and merges their pull request.
- **Ties to how this course works.** Chapter 10 has students review a commit made by an "AI agent" that quietly changed a file it wasn't asked to. They'll be supervising Claude Code's commits all semester.
- **A safe playground.** Every chapter has a practice repo that `reset-playground` restores.
- **Self-checking.** `check` shows a checklist of all 20 chapters with a hint for the next step. It reads the student's actual repos (not self-reported answers) and is written so it can become the autograder.

## How to review it in 15 minutes

1. **Open it:** [Open in GitHub Codespaces](https://codespaces.new/ammarjiruwala/git-mp-demo) → **Create codespace**. When it's ready you'll see Chapter 0 on the left, the Git Map on the right and a terminal at the bottom.
2. **Skim Chapter 0** for the desk / box / shelf / warehouse picture.
3. **Watch the map react.** Paste these into the terminal one at a time and watch the panel on the right:
   ```
   cd workspace/playground
   echo "- Your Name" >> team.md
   git add team.md
   git commit -m "Add my name"
   git push
   tess
   ```
   (If Git asks who you are, run the two `git config` lines from Chapter 4.) Then click **Tree view** at the top of the map.
4. **Read one full chapter**, such as Chapter 5 (the rejected push) or Chapter 8 (merge conflicts), and one each from [Part 2](lessons/20-rescue-1-unfinished-merge.md) and [Part 3](lessons/30-case-1-suspects.md).
5. **Run `check`** to see the progress checklist students get.
6. When you're done: [github.com/codespaces](https://github.com/codespaces) → **⋯** → **Delete** (or **Stop**).

## How it could run for 200 students

**What students need:** a free GitHub account and a browser. Nothing to install. Codespaces includes free monthly hours on personal accounts (check GitHub's current limits). The whole MP needs about 4 hours. Each student gets their own copy and can't affect anyone else's.

**PrairieLearn, two options:**

| Option | How | Status |
|---|---|---|
| **A. Codespaces + PrairieLearn for grading** | Students work in Codespaces as now, then submit their `check` result or per-chapter codes in a PrairieLearn assessment | Works today. Per-student codes (so answers can't be shared) still need adding. |
| **B. Everything in a PrairieLearn workspace** | The same setup (Git, the Git Map, the story repos) packaged as a PrairieLearn workspace image; `check` becomes the autograder reading the workspace | Not built. Needs the PrairieLearn admins to confirm that workspaces can include a custom VS Code extension. |

**Flexible size:** it can be one MP, or split. For example, Part 1 required early in the semester, and Parts 2 and 3 optional later as "debugging with Git".

## Current status

- **Tested:**
  - A scripted run completes all 20 chapters, and `check` passes them in order.
  - Ammar has played Chapters 0–5 in Codespaces as a student, with fixes after each round.
  - A first outside tester is going through it now.
- **Known gaps:**
  - The "warehouse" stands in for GitHub, so students don't see GitHub's website or pull request page. Chapter 9 describes it, and a short "go live on GitHub" add-on would close the gap.
  - It's designed for Codespaces on a computer browser; running it on your own laptop isn't documented yet.
  - The Git Map's look is a first version; a more polished 3D look is planned.
- **Not built yet:** PrairieLearn integration and per-student codes.

## Decisions we'd like from you

1. **Is this worth turning into an MP?** If yes, required or optional?
2. **Scope:** one MP with all three parts, or split (for example, Part 1 early, Parts 2–3 later)?
3. **Platform:** Codespaces plus PrairieLearn for grading (works now), or a full PrairieLearn workspace (needs the admins)?
4. **Pilot:** a few CAs or new students before release, to time each part and catch confusing steps.

## Where things are

| Path | What it is |
|---|---|
| [`lessons/`](lessons/) | All 20 chapters ([table of contents](lessons/contents.md)) |
| `git-map/` | The Git Map VS Code extension: source, tests, packaged `.vsix` |
| `check` | The progress checker (future autograder) |
| `.course-files/` | Builds the story repos; Tess's automatic push; Priya's review bot |
| `.devcontainer/` | The Codespaces setup |
