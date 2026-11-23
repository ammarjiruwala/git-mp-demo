# Chapter 4: Seal it

> **Priya:** Looks good! Now save it for real, with a note saying what you changed.

## The idea

`git commit` **seals the box**. Everything in the box becomes a **commit**: a saved snapshot of the project, with:
- a **message** you write, saying what changed
- an **ID** like `a3f9c2e`, so Git (and you) can find it later
- your **name** and the time

The sealed box goes on your **shelf** (your **local repository**). It's saved, and you can always get back to it.

But it's only on **your computer**. Nobody on the team can see it yet. That's the next chapter.

**Good commit messages** say what the change does: "Add myself to the team page", not "stuff" or "update". Your teammates (and future you) will read them in `git log`.

## Before your first commit: tell Git who you are

Every commit records who made it, so Git needs your name and email. You only do this once per computer.

```
git config --global user.name "Your Name"
git config --global user.email "you@illinois.edu"
```

If you skip this, Git stops you with **"Please tell me who you are"**. Now you know what it means.

## The commands

| Command | What it does |
|---|---|
| `git commit -m "message"` | Seal everything in the box into a commit with this message |
| `git log --oneline` | See your new commit at the top |
| `git show` | Look inside the newest commit: exactly what changed |

## Try it

In the playground (`course` then `cd workspace/playground`):

1. Make a change and pack it:
   ```
   echo "- Sam" >> team.md
   git add team.md
   ```
2. `git commit -m "Add Sam to the team"` — **watch the map:** the box flies to the **Shelf**, gets stamped **SEALED**, and is tagged **only on your laptop**.
3. `git log --oneline` — your commit is at the top.
4. `git show` — see exactly what changed. Lines starting with `+` were added, `-` were removed. If the viewer opens, press **q** to leave.
5. `git commit -m "Again"` — what happens when the box is empty? Read Git's message.

## Mission

Seal your change to the team page in your mission repo:

```
course
cd workspace/mission
git commit -m "Add myself to the team page"
git log --oneline
```

The map shows your commit on the **Shelf**, tagged **only on your laptop**. Run `check`.

## Remember

A commit is a saved snapshot with a message. It lives on your computer until you share it.

**Next:** [Chapter 5: Ship it](05-ship-it.md) · [All chapters](contents.md)
