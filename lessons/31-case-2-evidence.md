# Case 2: The evidence

## The idea

One commit looks suspicious: Alex's late-night **"Quick fix, don't look"**. Before accusing anyone, look at what each commit actually changed.

| Command | What it shows |
|---|---|
| `git show <id>` | The message and every changed line in one commit |
| `git show --stat <id>` | Just which files a commit changed, and how much |
| `git diff <id1> <id2>` | Everything that's different between two commits |

`<id>` is the short ID from `git log --oneline`, like `a3f9c2e`. Copy and paste it.

## Mission

```
course
cd workspace/detective
git log --oneline
```

Find the ID of "Quick fix, don't look", then:

```
git show --stat <id>
git show <id>
```

**Which file did "Quick fix, don't look" change?** Write it after `Case 2:` in **answers.txt**, then run `check`.

Did it touch `index.html`, where the title lives? Then is Alex still a suspect?

## Remember

A scary commit message doesn't mean a guilty commit. `git show` tells you what really changed.

**Next:** [Case 3: Who touched the line?](32-case-3-blame.md) · [All chapters](contents.md)
