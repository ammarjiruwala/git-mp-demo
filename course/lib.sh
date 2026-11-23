# Shared helpers for ./start and ./reset. Builds the story world in workspace/.

# Run a git command as one of the story characters.
as_person() {
  local name="$1"; shift
  GIT_AUTHOR_NAME="$name" GIT_AUTHOR_EMAIL="$(echo "$name" | tr 'A-Z' 'a-z')@snackmap.example" \
  GIT_COMMITTER_NAME="$name" GIT_COMMITTER_EMAIL="$(echo "$name" | tr 'A-Z' 'a-z')@snackmap.example" \
  git "$@"
}

# Chapter 0: folders to explore with cd, ls and cat. The code is in Priya's drawer.
build_hq() {
  local HQ="$1"
  mkdir -p "$HQ/lobby" "$HQ/floor-1/kitchen" "$HQ/floor-1/design-studio" "$HQ/floor-2/meeting-room" "$HQ/floor-2/priyas-desk/drawer"
  printf 'Welcome to Snack Map HQ!\n\nPriya left a note for you. It is on floor 2, in the drawer of her desk.\n' > "$HQ/lobby/welcome.txt"
  printf 'Just snacks in here. Wrong room!\n' > "$HQ/floor-1/kitchen/fridge.txt"
  printf "Tess's sketches for the homepage. No notes here.\n" > "$HQ/floor-1/design-studio/sketches.txt"
  printf 'Whiteboard: "Demo day is Friday!"\n' > "$HQ/floor-2/meeting-room/whiteboard.txt"
  printf 'Hi new teammate!\n\nYou found it. Your Chapter 0 code is: BEACON\n\nWrite it in answers.txt, then head back to the course folder with: course\n\n- Priya\n' > "$HQ/floor-2/priyas-desk/drawer/note-for-you.txt"
}

# The team's warehouse (our stand-in for GitHub), with the project's history so far.
# Students clone it in Chapter 1. One commit message hides the Chapter 2 code.
build_story_warehouse() {
  local WH="$1" COURSE="$2" SEED
  SEED=$(mktemp -d)
  git -C "$SEED" init -q -b main

  printf '# Snack Map\n\nA campus app that shows where to find snacks late at night.\n' > "$SEED/README.md"
  as_person Priya -C "$SEED" add README.md
  as_person Priya -C "$SEED" commit -q -m "Start the project"

  printf '# Team\n\n- Priya (team lead)\n- Tess (design)\n' > "$SEED/team.md"
  as_person Priya -C "$SEED" add team.md
  as_person Priya -C "$SEED" commit -q -m "Add the team page"

  printf '<h1>Snack Map</h1>\n<p>Find snacks near you.</p>\n' > "$SEED/index.html"
  as_person Priya -C "$SEED" add index.html
  as_person Priya -C "$SEED" commit -q -m "Add the homepage"

  printf 'h1 { color: #e8743b; }\n' > "$SEED/style.css"
  as_person Tess -C "$SEED" add style.css
  as_person Tess -C "$SEED" commit -q -m "Pick colors for the homepage"

  printf 'Notes for new teammates\n\n1. Add yourself to team.md\n2. Ask Priya if you get stuck\n' > "$SEED/notes.txt"
  as_person Priya -C "$SEED" add notes.txt
  as_person Priya -C "$SEED" commit -q -m "Add notes for new teammates" \
    -m "P.S. to whoever joins next: your Chapter 2 code is LANTERN."

  git clone -q --bare "$SEED" "$WH"
  rm -rf "$SEED"

  # After the student's first push, Tess pushes too (see course/tess-push.sh).
  sed "s|__COURSE__|$COURSE|" "$COURSE/course/post-receive" > "$WH/hooks/post-receive"
  chmod +x "$WH/hooks/post-receive"
}

# The playground and its own warehouse. Safe to break: ./reset rebuilds them.
build_playground() {
  local W="$1" SEED
  rm -rf "$W/playground" "$W/practice-warehouse.git"
  SEED=$(mktemp -d)
  git -C "$SEED" init -q -b main
  printf '# Practice\n\nA repo for trying things. Break it, then run ./reset.\n' > "$SEED/README.md"
  as_person Priya -C "$SEED" add README.md
  as_person Priya -C "$SEED" commit -q -m "Start the practice repo"
  printf '# Team\n\n- Priya (team lead)\n' > "$SEED/team.md"
  as_person Priya -C "$SEED" add team.md
  as_person Priya -C "$SEED" commit -q -m "Add the team page"
  printf 'Some notes.\n' > "$SEED/notes.txt"
  as_person Priya -C "$SEED" add notes.txt
  as_person Priya -C "$SEED" commit -q -m "Add notes"
  git clone -q --bare "$SEED" "$W/practice-warehouse.git"
  rm -rf "$SEED"
  git clone -q "$W/practice-warehouse.git" "$W/playground"
}
