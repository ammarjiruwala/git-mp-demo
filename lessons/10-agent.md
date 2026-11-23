# Chapter 10: Check the agent's work

> **Priya:** I asked an AI coding agent to add our opening hours to the homepage. It pushed its work to a branch called `agent/add-hours`. Before we merge anything, check exactly what it did. Agents sometimes change more than they were asked to.

## The idea

In this course you'll use AI agents like Claude Code, and they make commits for you. That's a big help, but **you're responsible for what gets merged**. Before trusting any commit (an agent's or a teammate's), look at exactly what it changed.

Git gives you three ways to look:
- `git log` shows **which commits** there are
- `git show` shows **what one commit changed**, line by line
- `git diff` shows **the difference between two versions**, like `main` and a branch

> **Two dots or three?** `git diff main origin/agent/add-hours` compares the two ends, so it also shows everything `main` gained since the agent started. `git diff main...origin/agent/add-hours` (three dots) shows only what the branch itself changed. When reviewing someone's branch, you almost always want three dots.

## The commands

| Command | What it does |
|---|---|
| `git fetch` | Download what's new in the warehouse without changing your branches |
| `git log --oneline origin/agent/add-hours` | The commits on the agent's branch |
| `git show origin/agent/add-hours` | What the newest commit on that branch changed |
| `git diff main...origin/agent/add-hours` | Everything the agent's branch changed since it split off from `main` (note the **three dots**) |
| `git diff --stat main...origin/agent/add-hours` | Just the list of files it changed |

> `origin/agent/add-hours` means "the `agent/add-hours` branch as the warehouse has it". You don't need to switch to a branch to look at it.

In a diff, lines starting with `-` were removed and lines starting with `+` were added. If the viewer opens, **q** gets you out.

## Mission

```
course
cd workspace/mission
git fetch
git log --oneline origin/agent/add-hours
git show origin/agent/add-hours
```

The agent was asked to add opening hours to `index.html`. **Which other file did it change without being asked?** Write that file name (like `something.css`) in **answers.txt** after `Chapter 10:`. Then run `check`.

Don't merge the agent's branch. If this were real, you'd tell the agent (or fix it yourself) before merging.

## Remember

Before you merge anything, read what it changed with `git show` or `git diff`. That goes double for an AI agent's work.

## You finished Part 1!

You now know the Git you'll use every week on your group project: `clone`, `status`, `log`, `add`, `commit`, `push`, `pull`, branches, merging, conflicts, pull requests and reviewing changes.

Parts 2 and 3 are about the moments when things go wrong.

**Next:** [Rescue 1: The unfinished merge](20-rescue-1-unfinished-merge.md) · [All chapters](contents.md)
