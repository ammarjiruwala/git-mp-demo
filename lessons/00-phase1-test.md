# Phase 1 test: the Git Map

The **Git Map** panel on the right shows your practice repo. Type each command below in the **terminal** at the bottom (copy and paste is fine), then look at the map and its caption.

Things to watch for: does each step animate the way the note says? Does the caption make sense? Anything slow, ugly or confusing?

## 1. Go to the practice repo

```
cd workspace/playground
```

The map shows **playground**. Priya's three commits are on the **Shelf** and in the **Warehouse**.

## 2. Change a file (the desk)

```
echo "- Your Name" >> team.md
```

*Expect:* `team.md` appears on the **Desk**, marked "changed".

## 3. Look without changing anything

```
git status
```

*Expect:* the caption says `git status` only looks. Nothing moves.

## 4. Pack it (the box)

```
git add team.md
```

*Expect:* the `team.md` card **slides from the Desk into the Box**.

## 5. Seal it (the shelf)

```
git commit -m "Add my name"
```

*Expect:* a new parcel **flies from the Box to the Shelf**, gets a "SEALED" stamp, and is tagged **only on your laptop**.

## 6. Ship it (the warehouse)

```
git push
```

*Expect:* the parcel **flies up to the Warehouse**, and the "only on your laptop" tag disappears.

## 7. Try the tree view

Click **Tree view** at the top of the map. Same history, drawn the way Git draws it. Click **Shipping view** to go back.

## 8. A teammate pushes

```
../../tess
```

*Expect:* a box from **Tess** **drops into the Warehouse**, tagged "not on your laptop yet".

## 9. The rejected push

```
echo "- likes snacks" >> team.md
git add team.md
git commit -m "Add a fun fact"
git push
```

*Expect:* Git says **rejected**. Nothing moves, and the caption explains why.

```
git pull
```

*Expect:* Tess's box **comes down to your Shelf**, plus a merge commit. In the tree view, two lines join.

```
git push
```

*Expect:* everything ships to the Warehouse.

## 10. Play

Try anything: make a new file (`echo hi > new.txt`), `git add .`, take a file back out of the box (`git restore --staged team.md`), make a branch (`git switch -c idea`).

To start over, go back to the main folder and rebuild everything:

```
cd /workspaces/git-mp-demo && ./start && cd workspace/playground
```
