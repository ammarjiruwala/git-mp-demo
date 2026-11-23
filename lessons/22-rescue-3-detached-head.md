# Rescue 3: Detached HEAD

## The situation

```
course
cd workspace/rescue/3-detached-head
git status
```

Git says **"HEAD detached at ..."**. The map shows **detached HEAD** instead of a branch name.

**HEAD** is Git's name for "where you are right now". Normally it points at a branch, like `main`. Tess went back in time to an old commit to look at it (with `git switch --detach` or `git checkout <id>`). That's fine for looking. But then she made a new commit there: **"Try a dark theme"**. That commit isn't on any branch.

If you switch away now, the commit becomes very hard to find. Git doesn't delete it right away, but nothing points to it anymore. The fix is simple: give it a branch.

| Command | What it does |
|---|---|
| `git switch -c dark-theme` | Make a branch right here, so the commit is saved on it |
| `git switch main` | Go back to `main` |
| `git log --oneline --all` | See commits on every branch |

## Mission

```
git log --oneline
git switch -c dark-theme
git switch main
git log --oneline --all
```

Switch the map to **Tree view**: "Try a dark theme" now sits on its own `dark-theme` track. Run `check`.

## Remember

"Detached HEAD" means you're not on a branch. Looking around is fine; if you made commits there, save them with `git switch -c <name>`.

**Next:** [Rescue 4: Undo a shared commit](23-rescue-4-undo.md) · [All chapters](contents.md)
