# Case 4: Catch it and fix it

## The idea

`git blame` pointed at a commit. But what if a line was changed several times, or the bug comes from a combination of changes? The most reliable proof is to **go back in time**: check out old versions and run the test on each one. The first commit where the test fails is the culprit.

| Command | What it does |
|---|---|
| `git switch --detach <id>` | Travel back to commit `<id>`. Your desk shows the project exactly as it was then. (This is a **detached HEAD**, like in Rescue 3. Just looking is fine.) |
| `bash test.sh` | Run the test on whatever version is on your desk |
| `git switch main` | Come back to the present |
| `git revert --no-edit <id>` | Add a commit that undoes `<id>` (from Rescue 4) |

**Searching smarter: `git bisect`.** With many commits, testing each one takes forever. `git bisect` does a binary search: it picks the commit halfway between a good and a bad one, you say whether that one is good or bad, and it halves the range again. Ten commits take about four tests.

```
git bisect start
git bisect bad main
git bisect good <id of "Add a test for the homepage">
bash test.sh            then type: git bisect good   or   git bisect bad
... repeat until Git names the first bad commit ...
git bisect reset        (back to the present)
```

## Mission

```
course
cd workspace/detective
git log --oneline
```

1. **Find the first commit where `bash test.sh` fails.** (The test itself arrived in "Add a test for the homepage", so start there: that commit passes.) Use `git switch --detach <id>` plus `bash test.sh` on a few commits, or try `git bisect`. Come back with `git switch main` (or `git bisect reset`) when you're done.
2. Write that commit's **7-character ID** after `Case 4:` in **answers.txt**.
3. **Fix it** by reverting that commit:
   ```
   git revert --no-edit <id>
   bash test.sh
   ```
   It should say **PASS**.
4. Run `check`.

## Remember

To find when something broke: go back in time and test. `git bisect` does it with the fewest steps. Then fix it with `git revert`.

## Case closed

You've finished the MP. You can save and share work, work on branches, review changes, get unstuck, and track down bugs through history. That's more Git than most people know when they start their first real project.

[All chapters](contents.md)
