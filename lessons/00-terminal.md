# Chapter 0: Welcome to the team

> **Priya (team lead):** Hi, welcome to Snack Map! We're building a campus app that finds late-night snacks. Before you touch any code, find the note I left you at HQ. It's somewhere in the `hq` folder.

## The big picture

This MP teaches **Git**, the tool almost every software team uses to save and share code. Git keeps every version of a project, so nobody loses work, and it lets a whole team work on the same code.

Git can feel like magic words, so we'll use a picture. Every change you make takes a trip through **four places**:

| Place | Think of it as | What it really is |
|---|---|---|
| **Desk** | The files you're working on right now | The **working directory**: the folder on your computer |
| **Box** | A box you're packing to send | The **staging area**: the changes you've picked for your next save |
| **Shelf** | Sealed, labeled boxes on your shelf | Your **local repository**: saved versions (called **commits**) on your computer |
| **Warehouse** | The team's shared warehouse | The **remote repository**: usually on **GitHub**, where the team shares work |

The **Git Map** panel on the right shows these four places **live**. Whenever you run a Git command, watch it: files and boxes move. If you close it, click **Git Map** in the bottom bar. If you lose this lesson, click **Lessons** in the bottom bar.

In this chapter you're not inside a Git project yet, so the map only shows **where you are** in the terminal. The desk, box, shelf and warehouse appear in Chapter 1.

In this MP the "warehouse" lives inside this workspace instead of on GitHub, so you can practice freely. It works the same way.

## The terminal

You'll type commands in the **terminal** at the bottom of the screen. It's a way to talk to your computer by typing instead of clicking.

In a terminal you're always *standing in* one folder, and commands happen in that folder. The path before the `$` shows where you are.

| Command | What it does |
|---|---|
| `pwd` | **P**rint **w**orking **d**irectory: shows the folder you're in |
| `ls` | **L**i**s**t what's in this folder |
| `cd hq` | **C**hange **d**irectory: go into the folder `hq` |
| `cd ..` | Go up one folder (`..` means "the folder above") |
| `cat file.txt` | Show what's in a file |
| `clear` | Clear the screen |

This MP also adds three shortcuts that work from any folder:

| Shortcut | What it does |
|---|---|
| `course` | Jump back to the course folder (the top folder, where you started) |
| `check` | Show which chapters you've finished |
| `reset-playground` | Put the practice repo back the way it started |

**Tips that save time**
- **Copy and paste** commands from these lessons instead of retyping them. One misplaced space or dot is enough to break a command.
- Press **Tab** to finish a folder or file name for you. Type `cd wor` and press Tab.
- Press **↑** (up arrow) to bring back your last command.
- If something seems stuck, press **Ctrl+C** to stop it.

## Try it

Type each line and press Enter. Before each one, **guess** what will happen, then watch the map.

1. `pwd` — where are you right now? The map shows the same place.
2. `ls` — what's in this folder? The map lists it too.
3. `cd workspace` — the map's path follows you. What's inside? Run `ls` to find out.
4. `cd ..` — you're back where you started. Check with `pwd`.

## Mission

Find Priya's note. It's somewhere inside `workspace/hq`. Use `cd`, `ls` and `cat` to explore. The lobby is a good place to start.

When you find the code:
1. Open **answers.txt** from the file list on the left.
2. Write the code after `Chapter 0:` and save (**Cmd+S** on Mac, **Ctrl+S** on Windows).
3. Run `check`. You should see a ✓ next to Chapter 0.

## Remember

You're always standing in a folder. `pwd` tells you where, `ls` shows what's there, `cd` moves you.

**Next:** [Chapter 1: Get the code](01-get-the-code.md) · [All chapters](contents.md)
