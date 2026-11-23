# Part 3: Who broke main?

> **Priya:** It's the night before demo day and the homepage title is broken. Nobody remembers touching it. Four people made commits over the last three days. Can you find out which commit broke it, and fix it?

The case file is the repo in `workspace/detective`. It has a test that checks the homepage title:

```
course
cd workspace/detective
bash test.sh
```

It says **FAIL**. Your job over the next four cases: find the commit that broke it, prove it, and fix it. You'll only *look* at history here (and add one fixing commit at the end), so you can't make things worse.

---

# Case 1: The suspects

## The idea

`git log` can do much more than list everything. You can filter and reshape what it shows:

| Command | What it shows |
|---|---|
| `git log --oneline` | One line per commit |
| `git log --oneline --author=Jordan` | Only Jordan's commits |
| `git log --since="2026-11-03" --until="2026-11-04"` | Only commits in that time range |
| `git log --format="%h  %an  %ad  %s" --date=short` | ID, author, date and message, one line each |
| `git shortlog -s` | How many commits each person made |

## Mission

The four suspects are Priya, Tess, Jordan and Alex. Start by getting to know them:

```
git log --format="%h  %an  %ad  %s" --date=short
git shortlog -s
```

**How many commits did Jordan make?** Write the number after `Case 1:` in **answers.txt**, then run `check`.

## Remember

`git log` has filters for author, date and format. Learn to ask it exactly what you want to know.

**Next:** [Case 2: The evidence](31-case-2-evidence.md) · [All chapters](contents.md)
