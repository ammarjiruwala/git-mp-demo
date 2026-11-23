# Git MP: Snack Map

Learn Git by joining a (fictional) student team building **Snack Map**, a campus app for late-night snacks. You work in a real Git setup in your browser, and a live **Git Map** shows exactly where your files and commits go after every command.

*A proposed CS124H MP. Work in progress.*

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/ammarjiruwala/git-mp-demo)

## How to start

1. Click **Open in GitHub Codespaces** above, then **Create codespace**. You need a free GitHub account.
2. Wait 1–2 minutes while it sets up. VS Code opens in your browser with:
   - **Chapter 0** on the left
   - the **Git Map** on the right
   - a **terminal** at the bottom
3. Follow the chapters. Run `check` in the terminal any time to see your progress.

Lost a lesson? Click **Lessons** in the bottom bar. Lost the map? Click **Git Map**.

When you're done, stop the Codespace so it doesn't use your free hours: [github.com/codespaces](https://github.com/codespaces) → **⋯** → **Stop codespace**.

## The chapters

**Part 1: First week on the team** (about 2 hours)

| | Chapter | You learn |
|---|---|---|
| 0 | [Welcome to the team](lessons/00-terminal.md) | The four places (desk, box, shelf, warehouse) and the terminal |
| 1 | [Get the code](lessons/01-get-the-code.md) | `git clone` |
| 2 | [Look around](lessons/02-look-around.md) | `git status`, `git log`, Git's viewer |
| 3 | [Pack the box](lessons/03-pack-the-box.md) | `git add` |
| 4 | [Seal it](lessons/04-seal-it.md) | `git commit` |
| 5 | [Ship it](lessons/05-ship-it.md) | `git push`, `git pull`, the rejected push |
| 6 | [Branches](lessons/06-branches.md) | `git branch`, `git switch` |
| 7 | [Merge](lessons/07-merge.md) | `git merge` |
| 8 | [Merge conflicts](lessons/08-conflict.md) | Fixing conflicts |
| 9 | [Pull requests](lessons/09-pull-request.md) | Branch, push, review, merge |
| 10 | [Check the agent's work](lessons/10-agent.md) | `git fetch`, `git show`, `git diff` |

**Part 2: Rescue mission** (about 45 minutes)

| | Rescue | You learn |
|---|---|---|
| 1 | [The unfinished merge](lessons/20-rescue-1-unfinished-merge.md) | Finishing or aborting a merge |
| 2 | [Stuck on a branch](lessons/21-rescue-2-stuck-switch.md) | `git stash` |
| 3 | [Detached HEAD](lessons/22-rescue-3-detached-head.md) | What HEAD is, saving lost commits |
| 4 | [Undo a shared commit](lessons/23-rescue-4-undo.md) | `git revert` vs `git reset` |
| 5 | [The leaked password](lessons/24-rescue-5-leaked-password.md) | `.gitignore`, why history remembers |

**Part 3: Who broke main?** (about 45 minutes)

| | Case | You learn |
|---|---|---|
| 1 | [The suspects](lessons/30-case-1-suspects.md) | Filtering `git log` |
| 2 | [The evidence](lessons/31-case-2-evidence.md) | `git show`, `git diff` |
| 3 | [Who touched the line?](lessons/32-case-3-blame.md) | `git blame` |
| 4 | [Catch it and fix it](lessons/33-case-4-catch-it.md) | Time travel, `git bisect`, `git revert` |

## Commands this MP adds

| Command | What it does |
|---|---|
| `course` | Go back to the course folder from anywhere |
| `check` | Show which chapters you've finished, and what to do next |
| `reset-playground` | Put the practice repo back the way it started |
| `tess` | Practice: make your teammate Tess push to the practice repo |
| `request-review <branch>` | Chapter 9: ask Priya to review your branch, like a pull request |
| `./start` | Start the whole MP over (erases your work) |

## For course staff and developers

| Folder / file | What it is |
|---|---|
| `lessons/` | The chapters |
| `git-map/` | The Git Map VS Code extension: source, tests, and the packaged `git-map.vsix` |
| `.course-files/` | Builds the story repos; Tess's automatic push; Priya's review bot; the answers template |
| `check` | The progress checker (the future PrairieLearn autograder) |
| `.devcontainer/` | How the Codespace is set up |

To work on the extension: `cd git-map && npm test`, then `npm run package` to rebuild `git-map.vsix`.
