# Chapter 7: Merge

> **Priya:** I like your idea! Bring it into `main` so everyone gets it.

## The idea

**Merging** brings the work from one branch into another. You stand on the branch that should *receive* the work (usually `main`), and merge the other branch into it.

There are two kinds of merge:
- **Fast-forward.** If `main` hasn't changed since your branch split off, Git just slides the `main` label forward to your newest commit. No new commit is needed.
- **Merge commit.** If both branches have new commits, Git makes a new commit that joins the two lines. It has two parents, one from each branch.

Either way, Git does the combining for you, as long as the two branches didn't change the same lines. (When they do, that's a conflict: next chapter.)

## The commands

| Command | What it does |
|---|---|
| `git merge my-idea` | Bring `my-idea`'s commits into the branch you're on |
| `git branch -d my-idea` | Delete the branch label after merging (the commits stay) |

## Try it

In the playground (`course` then `cd workspace/playground`), with the map on **Tree view**:

1. A fast-forward:
   ```
   git switch main
   git switch -c quick-fix
   echo "fixed" > fix.txt
   git add fix.txt
   git commit -m "Quick fix"
   git switch main
   git merge quick-fix
   ```
   Git says **Fast-forward**. The `main` flag jumped to your commit.
2. A merge commit: `main` and `experiment` both have commits the other doesn't.
   ```
   git merge experiment
   ```
   Git makes a **merge commit**. In the tree, the `experiment` track joins `main`.

## Mission

Merge your idea into `main` and ship it:

```
course
cd workspace/mission
git switch main
git merge my-idea
git push
```

Was it a fast-forward or a merge commit? Look at what Git printed, and at the tree. Then run `check`.

## Remember

Stand on the branch that receives the work, then `git merge` the other one in.

**Next:** [Chapter 8: Merge conflicts](08-conflict.md) · [All chapters](contents.md)
