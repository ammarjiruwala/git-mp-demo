# Case 3: Who touched the line?

## The idea

`git blame` goes through a file line by line and shows, for each line, **the last commit that changed it**: its ID, who made it, and when. Despite the name, it's not about blaming people. It's how you find out why a line looks the way it does.

| Command | What it shows |
|---|---|
| `git blame index.html` | Every line with the last commit, author and date that changed it |
| `git blame -L 1,1 index.html` | Just line 1 |

## Mission

```
course
cd workspace/detective
cat index.html
git blame index.html
```

The title is the first line: `<h1>Snack Map<h1>`. Can you spot what's wrong with it? (Compare it with a correct one in `test.sh`.)

**Who last changed that line?** Write their name after `Case 3:` in **answers.txt**, then run `check`.

## Remember

`git blame <file>` shows who last changed each line, and in which commit.

**Next:** [Case 4: Catch it and fix it](33-case-4-catch-it.md) · [All chapters](contents.md)
