# Chapter 0: Welcome to the team

> **Priya (team lead):** Hi, welcome to Snack Map! We're building a campus app that finds late-night snacks. Before you touch any code, find the note I left you at HQ. It's somewhere in the `hq` folder.

## The big picture

This MP teaches **Git**, the tool almost every software team uses to save and share code. Git keeps every version of a project, so nobody loses work, and lets a whole team work on the same code.

Git can feel like magic words. So we'll use a picture. Every change you make takes a trip through **four places**:

| Place | Think of it as | What it really is |
|---|---|---|
| **Desk** | The files you're working on right now | The **working directory**: the folder on your computer |
| **Box** | A box you're packing to send | The **staging area**: the changes you've picked for your next save |
| **Shelf** | Sealed, labeled boxes on your shelf | Your **local repository**: saved versions (called **commits**) on your computer |
| **Warehouse** | The team's shared warehouse | The **remote repository**: usually on **GitHub**, where the team shares work |

The **Git Map** panel on the right shows these four places **live**. Every time you run a Git command, watch it: you'll see files and boxes move. If you close it, click **Git Map** in the bottom bar.

In this chapter you're not inside a Git project yet, so the map only shows **where you are**. Watch that path change as you move around with `cd`. The desk, box, shelf and warehouse appear in Chapter 1.

Here we use a stand-in for GitHub that lives in this workspace, so you can practice freely. It works the same way.

## The terminal

You'll type commands in the **terminal** at the bottom of the screen. It's a way to talk to your computer by typing instead of clicking.

In a terminal you're always *standing in* one folder. Commands happen in that folder. The text before the `$` shows where you are.

| Command | What it does |
|---|---|
| `pwd` | **P**rint **w**orking **d**irectory: shows the folder you're in |
| `ls` | **L**i**s**t what's in this folder |
| `cd hq` | **C**hange **d**irectory: go into the folder `hq` |
| `cd ..` | Go up one folder (`..` means "the folder above") |
| `cat file.txt` | Show what's in a file |
| `course` | Jump back to the course folder from anywhere (made for this MP) |
| `clear` | Clear the screen |

**Tips that save time**
- Press **Tab** to finish a folder or file name for you. Type `cd wor` then Tab.
- Press **↑** (up arrow) to bring back your last command.
- If something seems stuck, press **Ctrl+C** to stop it.
- If a command fills the screen and you can't type (this happens with `git log`), press **q** to get out.

## Try it

Type each line, then press Enter. Before each one, **guess** what will happen.

1. `pwd` — where are you right now?
2. `ls` — what's in this folder? You should see `lessons`, `workspace`, `answers.md`, and more.
3. `cd workspace` then `ls`
4. `cd ..` — you're back where you started. Check with `pwd`.

## Mission

Find Priya's note. It's somewhere inside `workspace/hq`. Use `cd`, `ls` and `cat` to explore. The lobby is a good place to start.

When you find the code:
1. Open **answers.md** from the file list on the left.
2. Write the code after `Chapter 0:` and save (**Cmd+S** on Mac, **Ctrl+S** on Windows).
3. Go back to the course folder (`course`) and run:

```
./check
```

You should see a ✓ next to Chapter 0.

## Remember

You're always standing in a folder. `pwd` tells you where, `ls` shows what's there, `cd` moves you.

**Next:** [Chapter 1: Get the code](01-get-the-code.md)
