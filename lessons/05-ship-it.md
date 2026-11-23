# Chapter 5: Ship it

> **Priya:** Great commit! Now send it to the warehouse so the rest of us can see it. Heads up: Tess is working at the same time as you.

## The idea

**`git push`** ships the sealed boxes on your shelf to the **warehouse** (GitHub). Now your teammates can get them.

**`git pull`** does the opposite: it brings boxes your teammates shipped down to your laptop and combines them with your work.

Git never moves anything between your laptop and the warehouse on its own. You always push and pull yourself.

### The rejected push

Sometimes `git push` says **rejected**. Don't panic, it happens all the time on teams. It means **a teammate shipped something while you were working**, so the warehouse has a box you don't have. Git refuses to push, so their work isn't overwritten.

The fix is always the same:
1. `git pull` to bring their work down and combine it with yours
2. `git push` again

## The commands

| Command | What it does |
|---|---|
| `git push` | Ship your new commits to the warehouse |
| `git pull` | Bring down your teammates' new commits and combine them with yours |
| `git status` | Also tells you if you're **ahead** (you have commits to push) or **behind** |

> When `git pull` combines your work with a teammate's, Git makes a **merge commit**. That's normal. Switch the map to **Tree view** to see the two lines of work join.

## Try it

In the playground. Each step gives you the exact commands.

1. Make a change, seal it and ship it:
   ```
   course
   cd workspace/playground
   echo "- Sam" >> team.md
   git add team.md
   git commit -m "Add Sam"
   git push
   ```
   **Watch:** your box flies up to the **Warehouse**, and the "only on your laptop" tag disappears.
2. Make Tess push to the playground's warehouse:
   ```
   tess
   ```
   **Watch:** Tess's box drops into the **Warehouse**, tagged "not on your laptop yet".
3. Make another change and try to ship it:
   ```
   echo "more notes" >> notes.txt
   git add notes.txt
   git commit -m "Add more notes"
   git push
   ```
   **Rejected!** Read the message.
4. `git pull` — Tess's box comes down to your **Shelf**, plus a merge commit.
5. `git push` — everything ships.

## Mission

1. Push your team-page commit:
   ```
   course
   cd workspace/mission
   git push
   ```
   Read what Git prints: **Tess** replies. Wait a few seconds and **watch the Warehouse**: her box arrives.
2. Add a fun fact after your name in `team.md` (like `- Sam (new teammate, loves pretzels)`), save, then:
   ```
   git add team.md
   git commit -m "Add a fun fact about me"
   git push
   ```
   **Rejected.** Tess shipped while you were working.
3. Fix it:
   ```
   git pull
   git push
   ```
4. Run `check`.

## Remember

Push sends your commits; pull brings your teammates' commits. If a push is rejected: pull, then push.

**Next:** [Chapter 6: Branches](06-branches.md) · [All chapters](contents.md)
