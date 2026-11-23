# Rescue 2: Stuck on a branch

## The situation

```
course
cd workspace/rescue/2-stuck-switch
git status
git switch hotfix
```

Git refuses: **"Your local changes would be overwritten by checkout"**. Tess has unsaved work on her desk (a draft in `index.html`), and the `hotfix` branch changes the same file. Switching would wipe out her draft, so Git stops you.

You could commit the draft, but it's half-finished. Better: put it away for a moment with **`git stash`**.

`git stash` takes everything on your desk and puts it in a **drawer**. Your desk is clean, so you can switch branches. Later, `git stash pop` takes it back out of the drawer.

| Command | What it does |
|---|---|
| `git stash` | Put your uncommitted changes in the drawer. Your desk becomes clean. |
| `git stash list` | See what's in the drawer |
| `git stash pop` | Take the newest changes out of the drawer and put them back on your desk |

## Mission

Look at the `hotfix` branch, then come back and get Tess's draft back:

```
git stash
git switch hotfix
cat index.html
git switch main
git stash pop
cat index.html
```

The nachos draft is back in `index.html`. Run `check`.

## Remember

Can't switch because of uncommitted work? `git stash` to put it away, `git stash pop` to get it back.

**Next:** [Rescue 3: Detached HEAD](22-rescue-3-detached-head.md) · [All chapters](contents.md)
