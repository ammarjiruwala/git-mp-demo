# Part 2: Rescue mission

> **Priya:** Tess went on vacation and left her repos in a mess. Each one is stuck in a different way, the kind of stuck that makes people delete everything and start over. Don't! Every one of these can be fixed in a couple of commands.

The five messes are in `workspace/rescue/`, one repo each. In every rescue, start with `git status`: it tells you what's going on, and usually what to do next.

---

# Rescue 1: The unfinished merge

## The situation

```
course
cd workspace/rescue/1-unfinished-merge
git status
```

Git says **"You have unmerged paths"**. Tess started merging the `more-snacks` branch into `main`, hit a conflict in `menu.md`, and walked away. The map shows `menu.md` with a red **conflict** badge and a **merging** label at the top.

While a merge is unfinished, Git won't let you do much else. You have two ways out:

| Way out | Commands |
|---|---|
| **Finish it:** fix the file, then commit | edit the file, `git add menu.md`, `git commit -m "message"` |
| **Abandon it:** go back to before the merge | `git merge --abort` |

## Mission

Finish the merge. Open `menu.md`: Tess added **Cookies** on `main` and **Pretzels** on `more-snacks`. Keep **both**, and remove the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`). Then:

```
git add menu.md
git commit -m "Finish merging the menu"
git status
```

`git status` should now say "nothing to commit". Run `check`.

## Remember

A stuck merge isn't broken. Finish it (fix, add, commit) or back out with `git merge --abort`.

**Next:** [Rescue 2: Stuck on a branch](21-rescue-2-stuck-switch.md) · [All chapters](contents.md)
