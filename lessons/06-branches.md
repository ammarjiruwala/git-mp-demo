# Chapter 6: Branches

> **Priya:** I keep half-finished ideas on separate branches so they don't break the main app. I hid something on one called `backstage`. Go find it.

## The idea

So far everything happened on one line of history called **main**. A **branch** is a separate line of work. You can try things on a branch without touching `main`, and only bring the work over when it's ready.

Picture the shelf with several rows: `main` is one row, and each branch is another row that splits off from it. In the map's **Tree view**, each branch is its own colored track.

When you **switch** to a branch, the files on your desk change to match that branch. Files can appear or disappear. Nothing is lost: switch back and they return.

## The commands

| Command | What it does |
|---|---|
| `git branch` | List your branches. The `*` marks the one you're on. |
| `git branch -a` | Also list branches in the warehouse (they start with `remotes/origin/`) |
| `git switch backstage` | Move to the `backstage` branch |
| `git switch -c my-idea` | **C**reate a new branch called `my-idea` and move to it |
| `git switch main` | Go back to `main` |

> You'll also see `git checkout` in older tutorials. `git checkout backstage` does the same as `git switch backstage`.

## Try it

In the playground (`course` then `cd workspace/playground`):

1. `git branch -a` — there's a branch called `experiment` in the warehouse.
2. `ls`, then `git switch experiment`, then `ls` again. A new file, `idea.txt`, appeared. **Watch the map:** the branch name at the top changes.
3. `git switch main` and `ls` — `idea.txt` is gone again. It's safe on its branch.
4. Make your own branch and commit on it:
   ```
   git switch -c my-test
   echo "trying something" > test.txt
   git add test.txt
   git commit -m "Try something"
   ```
5. Click **Tree view** on the map: your commit sits on its own track, split off from `main`.

## Mission

In your mission repo:

1. Find Priya's secret:
   ```
   course
   cd workspace/mission
   git branch -a
   git switch backstage
   ls
   cat secret-menu.md
   ```
   Write the code in **answers.txt** after `Chapter 6:`.
2. Go back to `main` and start your own branch:
   ```
   git switch main
   git switch -c my-idea
   echo "Idea: a map of vending machines" > ideas.md
   git add ideas.md
   git commit -m "Add an idea for the app"
   ```
3. Run `check`.

## Remember

A branch is a separate line of work. `git switch` moves you between them, and your desk changes to match.

**Next:** [Chapter 7: Merge](07-merge.md) · [All chapters](contents.md)
