# Chapter 1: Get the code

> **Priya:** Nice work finding the note! The team's code lives in our warehouse. Grab your own copy so you can start working.

## The idea

The team's project lives in the **warehouse** (on a real team, that's GitHub). To work on it, you make your own copy on your computer. That's called **cloning**.

`git clone` copies **everything**:
- all the files, onto your **desk**
- the whole history (every commit ever made), onto your **shelf**

Your copy also remembers where it came from. Git calls that place **origin**. Later, when you send your work back, Git knows where to send it.

## The commands

| Command | What it does |
|---|---|
| `git clone <where> <folder>` | Copy a repo from `<where>` into a new folder called `<folder>` |
| `git remote -v` | Show where this repo came from (its **origin**) |

On a real project, `<where>` is a GitHub link, like `git clone https://github.com/team/snack-map.git`. In this MP, the warehouse is a folder called `warehouse.git`, so it's shorter.

## Try it

We already cloned a **playground** repo for you, so you can see what a clone looks like.

1. `course` then `cd workspace/playground`
2. `ls` — the files are on your desk.
3. `git remote -v` — this repo's origin is `practice-warehouse.git`.
4. **Look at the Git Map:** the **Shelf** and the **Warehouse** hold the same boxes. Right after cloning, your laptop and the warehouse match exactly.

The playground is yours to break. If you ever mess it up, run `./reset` from the course folder.

## Mission

Clone the team's warehouse into a folder called `mission`.

```
course
cd workspace
git clone warehouse.git mission
cd mission
ls
```

**Watch the Git Map** when you `cd mission`: it switches to your new repo. Five commits are on your shelf, the same five as in the warehouse.

Then check your progress:

```
course
./check
```

## Remember

`git clone` copies the files *and* the whole history, and remembers where they came from. You only clone once per project.

**Next:** [Chapter 2: Look around](02-look-around.md)
