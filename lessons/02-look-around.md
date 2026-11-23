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
| `git log -p` | Every commit *and* exactly what it changed (long!) |
| `git restore <file>` | Throw away your changes to a file on the desk (careful: they're gone) |

## Git's viewer: don't panic

When Git has more to show than fits on the screen, it opens a **viewer**. You'll know you're in it because:
- the prompt (`$`) disappears and you can't type commands
- there's a `:` at the bottom of the screen, or `(END)` when you reach the end

You're not stuck. You're reading, and these keys move you around:

| Key | What it does |
|---|---|
| **Space** | Next page |
| **b** | Back one page |
| **↓** / **↑** | One line down / up |
| **/word** then Enter | Search for "word" (press **n** for the next match) |
| **q** | **Quit** the viewer and get your prompt back |

The Git Map also shows a reminder whenever the viewer is open. You'll meet this viewer on every real project, so it's worth getting comfortable with it now.

## Try it

In the playground (`course` then `cd workspace/playground`):

1. `git status` — *guess first:* have you changed anything yet?
2. Change a file:
   ```
   echo "hello" >> notes.txt
   ```
   (`echo "hello" >> notes.txt` adds a line to the end of the file. You can also open the file from the list on the left, type, and save.)
   **Watch the map:** `notes.txt` appears on your **Desk**.
3. `git status` again — `notes.txt` is listed in **red** under "Changes not staged". Red means "on your desk, not packed".
4. `git log --oneline` — short and simple.
5. `git log -p` — this one is long, so the **viewer** opens. Press **Space** a few times, then **b**, then search with `/Priya`, then **q** to quit.
6. Throw your change away: `git restore notes.txt`. **Watch the map:** the card disappears from the desk.

## Mission

Go to your mission repo and read its history:

```
course
cd workspace/mission
git log
```

Read every message carefully, not just the first line of each. One of them has your Chapter 2 code. Write it in **answers.txt**, save, and run `check`.

## Remember

`git status` and `git log` only look, so run them as often as you like. If the screen fills up and you can't type, you're in the viewer: **q** gets you out.

**Next:** [Chapter 3: Pack the box](03-pack-the-box.md) · [All chapters](contents.md)
