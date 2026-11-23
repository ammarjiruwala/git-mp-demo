# Chapter 9: Pull requests

> **Priya:** On a real team we don't push straight to `main`. Someone reviews your work first. I spotted a typo in the README: it says "nite". Fix it on a branch and send it to me for review.

## The idea

On most teams, `main` is protected: nobody pushes to it directly. Instead:

1. You do your work on a **branch**.
2. You **push the branch** to the warehouse.
3. You open a **pull request** (often called a **PR**): "please review my branch and merge it into `main`".
4. A teammate **reviews** it: reads the changes, maybe asks for fixes.
5. When it's approved, it gets **merged** into `main` in the warehouse.
6. Everyone (including you) runs `git pull` to get the updated `main`.

This is how your group project and the other MPs in this course work.

**On GitHub**, step 3 is a green **Compare & pull request** button that appears after you push a branch. Reviewers comment on specific lines and click **Approve**, then **Merge pull request**. In this MP, Priya plays the reviewer: you ask her with the `request-review` command.

## The commands

| Command | What it does |
|---|---|
| `git push -u origin fix-typo` | Push the branch `fix-typo` to the warehouse. `-u` remembers the link, so next time plain `git push` works. |
| `request-review fix-typo` | Ask Priya to review your branch (this MP's stand-in for opening a pull request on GitHub) |
| `git pull` | After the merge, bring the updated `main` down to your laptop |

## Mission

1. Start from an up-to-date `main`:
   ```
   course
   cd workspace/mission
   git switch main
   git pull
   ```
2. Make a branch and fix the typo. Open `README.md`, change **nite** to **night**, and save. (Or: `sed -i 's/nite/night/' README.md`)
   ```
   git switch -c fix-typo
   git add README.md
   git commit -m "Fix a typo in the README"
   ```
3. Push the branch and ask for review:
   ```
   git push -u origin fix-typo
   request-review fix-typo
   ```
   Read Priya's review. **Watch the map's Warehouse:** a "Merge pull request" box appears in `main`, but it isn't on your laptop yet.
4. Get the merged `main`:
   ```
   git switch main
   git pull
   ```
5. Run `check`.

## Remember

Work on a branch, push it, ask for review, and pull `main` after it's merged. Nobody pushes straight to `main`.

**Next:** [Chapter 10: Check the agent's work](10-agent.md) · [All chapters](contents.md)
