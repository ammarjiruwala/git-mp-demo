# Chapter 2: Look around

> **Priya:** Before you change anything, take a look around. I left you a message somewhere in the project's history.

## The idea

Two commands you'll use constantly. Both **only look**. They never change anything, so they're always safe to run.

- **`git status`** looks at your **desk** and **box**: what have you changed, and what have you packed?
- **`git log`** reads the labels on your **shelf**: every commit, newest first, with who made it, when, and why.

Whenever you're unsure what's going on, run `git status`. It also suggests what to do next.

## The commands

| Command | What it does |
|---|---|
| `git status` | What's changed on your desk, and what's in the box |
| `git log` | Every commit: ID, author, date and message. Newest first. |
| `git log --oneline` | The short version: one line per commit |
| `git restore <file>` | Throw away your changes to a file on the desk (careful: they're gone) |

> **Stuck in `git log`?** If the list is long, Git shows it one screen at a time. Press **Space** for more, and **q** to quit.

## Try it

In the playground (`course` then `cd workspace/playground`):

1. `git status` — what does it say? *Guess first:* have you changed anything yet?
2. Change a file:
   ```
   echo "hello" >> notes.txt
   ```
   (`echo "hello" >> notes.txt` adds a line to the end of the file. You can also open the file from the list on the left, type, and save.)
   **Watch the map:** `notes.txt` appears on your **Desk**.
3. `git status` again — `notes.txt` is listed in **red** under "Changes not staged". Red means "on your desk, not packed".
4. `git log` and then `git log --oneline`. Which is easier to read?
5. Throw your change away: `git restore notes.txt`. **Watch the map:** the card disappears from the desk.

## Mission

Go to your mission repo and read its history:

```
course
cd workspace/mission
git log
```

Read every message carefully, not just the first line of each. One of them has your Chapter 2 code. Write it in **answers.txt** and save. Then:

```
course
./check
```

## Remember

`git status` and `git log` only look. Run them as often as you like. Red in `git status` means "changed on your desk, not packed yet".

**Next:** [Chapter 3: Pack the box](03-pack-the-box.md)
