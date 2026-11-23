# Chapter 3: Pack the box

> **Priya:** Time for your first change. Add yourself to the team page, `team.md`.

## The idea

When you edit a file, the change is only on your **desk**. Git hasn't saved anything yet.

To save a change in Git, you first **pack it into the box** (the **staging area**) with `git add`. The box holds exactly what will go into your next save. Nothing is in the history yet, and you can still take things back out.

Why have a box at all? Because you often change several things but only want to save some of them together. The box lets you choose.

## The commands

| Command | What goes in the box |
|---|---|
| `git add team.md` | Just that one file |
| `git add notes/` | Everything changed inside that folder |
| `git add .` | Everything changed in this folder and the folders inside it (`.` means "here") |
| `git add -A` | Everything changed anywhere in the repo, including deleted files |
| `git restore --staged team.md` | Takes `team.md` back **out** of the box. Your edit stays on the desk. |

## Try it

In the playground (`course` then `cd workspace/playground`). Guess first, then watch the map.

1. Change two files:
   ```
   echo "- Sam" >> team.md
   echo "more notes" >> notes.txt
   ```
   Both appear on your **Desk**.
2. `git add team.md` — **watch:** only `team.md` slides into the **Box**.
3. `git status` — `team.md` is **green** ("Changes to be committed"), `notes.txt` is still **red**.
4. `git add .` — now `notes.txt` slides into the box too.
5. `git restore --staged notes.txt` — it slides back out onto the desk.
6. Clean up: `git restore --staged team.md` then `git restore team.md notes.txt`.

## Mission

In your mission repo, add yourself to the team page and pack it in the box.

1. Open `workspace/mission/team.md` from the file list on the left. Add a line with your name at the end, like:
   ```
   - Sam (new teammate)
   ```
   Save the file. (Or use `echo "- Sam (new teammate)" >> team.md` in the terminal.)
2. In the terminal:
   ```
   course
   cd workspace/mission
   git add team.md
   git status
   ```
   `team.md` should be **green**, and the map shows it in the **Box**.

**Don't commit yet.** That's the next chapter. Run `course` then `./check`.

## Remember

`git add` doesn't save anything. It chooses what your next save will contain.

**Next:** [Chapter 4: Seal it](04-seal-it.md)
