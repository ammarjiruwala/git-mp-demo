# Rescue 5: The leaked password

## The situation

```
course
cd workspace/rescue/5-leaked-password
git log --oneline
cat settings.env
```

Tess committed `settings.env`, which contains the database **password**, and pushed it. On a real project that's on GitHub, possibly public. This is one of the most common mistakes in software.

Two things to do:
1. **Stop tracking the file**, so it's not in future commits, and tell Git to ignore it from now on. That's what a **`.gitignore`** file is for: a list of files Git should never pick up.
2. **Change the password.** Deleting the file from the latest commit doesn't remove it from **history**. Anyone can still find it in older commits.

| Command | What it does |
|---|---|
| `git rm --cached settings.env` | Stop tracking the file, but keep it on your desk |
| `echo "settings.env" >> .gitignore` | Add the file to `.gitignore`, so Git ignores it from now on |

## Mission

```
git rm --cached settings.env
echo "settings.env" >> .gitignore
git add .gitignore
git commit -m "Stop tracking the settings file"
git push
git status
```

`git status` no longer mentions `settings.env`, even though it's still on your desk.

Now, a question. Run `git log -p` and look through the history (**q** to quit the viewer). **Is the password still visible in the history?** Write **yes** or **no** after `Rescue 5:` in **answers.txt**. Then run `check`.

## Remember

Keep secrets out of Git with `.gitignore`. If one slips in, removing it isn't enough: change the secret, because history remembers.

**Next:** [Part 3: Who broke main?](30-case-1-suspects.md) · [All chapters](contents.md)
