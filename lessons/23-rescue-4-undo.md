# Rescue 4: Undo a shared commit

## The situation

```
course
cd workspace/rescue/4-bad-commit
git log --oneline
ls
```

Tess's last commit, **"Clean up old files"**, deleted `index.html` by mistake, and she already pushed it. The homepage is gone for everyone.

There are two ways to undo a commit, and only one is safe here:

| Command | What it does | When to use it |
|---|---|---|
| `git revert <id>` | Makes a **new** commit that does the opposite of `<id>`. History stays as it was. | Commits you've already **pushed**: always |
| `git reset --hard <id>` | Moves your branch back and **erases** the commits after `<id>` from your copy | Only commits you have **not** pushed yet |

Erasing pushed commits breaks things for teammates who already have them. That's why this warehouse (like most real ones) refuses pushes that rewrite history. So: revert.

`HEAD` means "the commit I'm on right now", so `git revert HEAD` undoes the newest commit.

## Mission

```
git revert --no-edit HEAD
ls
git push
```

(`--no-edit` keeps Git's suggested message instead of opening an editor.)

`index.html` is back, and the map's **Shelf** shows a new "Revert" commit on top. The mistake is still in the history, along with the fix. Run `check`.

## Remember

Already pushed? Undo with `git revert`, which adds a fixing commit. Never rewrite history that teammates have.

**Next:** [Rescue 5: The leaked password](24-rescue-5-leaked-password.md) · [All chapters](contents.md)
