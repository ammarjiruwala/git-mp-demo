# Chapter 8: Merge conflicts

> **Priya:** I tried a new homepage tagline on the `new-tagline` branch, but Tess changed the tagline on `main` too. Can you merge my branch and pick the best one?

## The idea

A **merge conflict** happens when two branches changed **the same lines** of a file. Git can't know which version is right, so it stops and asks you. This is normal, not an error. It happens on every team.

Git marks the conflict inside the file like this:

```
<<<<<<< HEAD
<p>Late-night snacks, mapped.</p>
=======
<p>Snacks at 2am? We have you covered.</p>
>>>>>>> new-tagline
```

- Between `<<<<<<< HEAD` and `=======` is **your** version (the branch you're on).
- Between `=======` and `>>>>>>>` is the version **coming in** from the other branch.

To fix it, edit the file so it says what it *should* say (keep one, the other, or combine them) and **delete the three marker lines**. VS Code also shows buttons above the conflict: **Accept Current**, **Accept Incoming**, **Accept Both**.

Then finish the merge with `git add` and `git commit`. Changed your mind? `git merge --abort` puts everything back as it was before the merge.

## The commands

| Command | What it does |
|---|---|
| `git merge <branch>` | Start the merge. If there's a conflict, Git stops and lists the files. |
| `git status` | Shows which files have conflicts ("both modified") |
| `git add <file>` | Mark a file as fixed |
| `git commit -m "message"` | Finish the merge |
| `git merge --abort` | Cancel the merge and go back to how things were |

## Try it

In the playground (`course` then `cd workspace/playground`), make a conflict on purpose:

```
git switch main
git switch -c left
echo "Snack of the day: chips" > snack.txt
git add snack.txt
git commit -m "Chips"
git switch main
echo "Snack of the day: cookies" > snack.txt
git add snack.txt
git commit -m "Cookies"
git merge left
```

**Watch the map:** `snack.txt` turns red with a **conflict** badge. Open `snack.txt`, look at the markers, then try `git merge --abort`. Everything is back to normal. Run `git merge left` again and this time fix it: edit the file, then `git add snack.txt` and `git commit -m "Pick a snack"`.

## Mission

```
course
cd workspace/mission
git switch new-tagline
git switch main
git merge new-tagline
```

(Switching to `new-tagline` first makes a local copy of Priya's branch.)

Git reports a conflict in `index.html`. Open it, pick the tagline you like best, and remove the marker lines. Then:

```
git add index.html
git commit -m "Merge the new tagline"
git push
```

Run `check`.

## Remember

A conflict means two branches changed the same lines. You decide what the file should say, delete the markers, then `add` and `commit`.

**Next:** [Chapter 9: Pull requests](09-pull-request.md) · [All chapters](contents.md)
