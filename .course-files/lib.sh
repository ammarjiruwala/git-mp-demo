# Shared helpers for ./start and reset-playground. Builds the story world in workspace/.
# Every repo here is built from scratch by these functions, so ./start always
# gives everyone the exact same starting point.

FILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # this .course-files folder

# save REPO WHO "message" ["second paragraph"]
# Commits every change in REPO as a story character. If STORY_DATE is set
# (like 2026-11-03T21:15:00), the commit gets that date.
save() {
  local repo="$1" who="$2" msg="$3" body="$4"
  local email
  email="$(echo "$who" | tr 'A-Z ' 'a-z.')@snackmap.example"
  local envs=(GIT_AUTHOR_NAME="$who" GIT_AUTHOR_EMAIL="$email" GIT_COMMITTER_NAME="$who" GIT_COMMITTER_EMAIL="$email")
  [ -n "$STORY_DATE" ] && envs+=(GIT_AUTHOR_DATE="$STORY_DATE" GIT_COMMITTER_DATE="$STORY_DATE")
  local args=(-q -m "$msg")
  [ -n "$body" ] && args+=(-m "$body")
  git -C "$repo" add -A
  env "${envs[@]}" git -C "$repo" commit "${args[@]}"
}

# Runs any git command as a story character (for merges and the like).
as_person() {
  local who="$1"; shift
  local email
  email="$(echo "$who" | tr 'A-Z ' 'a-z.')@snackmap.example"
  GIT_AUTHOR_NAME="$who" GIT_AUTHOR_EMAIL="$email" GIT_COMMITTER_NAME="$who" GIT_COMMITTER_EMAIL="$email" git "$@"
}

new_repo() { mkdir -p "$1" && git -C "$1" init -q -b main; }

# ---------------------------------------------------------------- Chapter 0
# Folders to explore with cd, ls and cat. The code is in Priya's drawer.
build_hq() {
  local HQ="$1"
  mkdir -p "$HQ/lobby" "$HQ/floor-1/kitchen" "$HQ/floor-1/design-studio" "$HQ/floor-2/meeting-room" "$HQ/floor-2/priyas-desk/drawer"
  printf 'Welcome to Snack Map HQ!\n\nPriya left a note for you. It is on floor 2, in the drawer of her desk.\n' > "$HQ/lobby/welcome.txt"
  printf 'Just snacks in here. Wrong room!\n' > "$HQ/floor-1/kitchen/fridge.txt"
  printf "Tess's sketches for the homepage. No notes here.\n" > "$HQ/floor-1/design-studio/sketches.txt"
  printf 'Whiteboard: "Demo day is Friday!"\n' > "$HQ/floor-2/meeting-room/whiteboard.txt"
  printf 'Hi new teammate!\n\nYou found it. Your Chapter 0 code is: BEACON\n\nWrite it in answers.txt, then head back to the course folder with: course\n\n- Priya\n' > "$HQ/floor-2/priyas-desk/drawer/note-for-you.txt"
}

# ---------------------------------------------------------------- Part 1
# The team's warehouse (our stand-in for GitHub). Students clone it in Chapter 1.
#   main            the project so far (Chapter 2 code hides in a commit message)
#   backstage       Chapter 6: a file that only exists on this branch
#   new-tagline     Chapter 8: changes the same line as main, so merging conflicts
#   agent/add-hours Chapter 10: an AI agent's work, with one change nobody asked for
build_story_warehouse() {
  local WH="$1" S
  S=$(mktemp -d)
  new_repo "$S"

  printf '# Snack Map\n\nA campus app that shows where to find snacks late at nite.\n' > "$S/README.md"
  save "$S" Priya "Start the project"

  printf '# Team\n\n- Priya (team lead)\n- Tess (design)\n' > "$S/team.md"
  save "$S" Priya "Add the team page"

  printf '<h1>Snack Map</h1>\n<p>Find snacks near you.</p>\n' > "$S/index.html"
  save "$S" Priya "Add the homepage"

  git -C "$S" switch -q -c new-tagline
  printf '<h1>Snack Map</h1>\n<p>Snacks at 2am? We have you covered.</p>\n' > "$S/index.html"
  save "$S" Priya "Try a punchier tagline"
  git -C "$S" switch -q main

  printf 'h1 { color: #e8743b; }\n' > "$S/style.css"
  save "$S" Tess "Pick colors for the homepage"

  printf 'Notes for new teammates\n\n1. Add yourself to team.md\n2. Ask Priya if you get stuck\n' > "$S/notes.txt"
  save "$S" Priya "Add notes for new teammates" "P.S. to whoever joins next: your Chapter 2 code is LANTERN."

  git -C "$S" switch -q -c backstage
  printf '# Secret menu\n\nThis file only exists on the backstage branch.\n\nYour Chapter 6 code is: TORCH\n' > "$S/secret-menu.md"
  save "$S" Priya "Add the secret menu"
  git -C "$S" switch -q main

  printf '<h1>Snack Map</h1>\n<p>Late-night snacks, mapped.</p>\n' > "$S/index.html"
  save "$S" Tess "Polish the tagline"

  git -C "$S" switch -q -c agent/add-hours
  printf '<h1>Snack Map</h1>\n<p>Late-night snacks, mapped.</p>\n<p>Open late: 9pm to 3am.</p>\n' > "$S/index.html"
  printf 'h1 { color: #ff00ff; }\n' > "$S/style.css"
  save "$S" "AI Agent" "Add opening hours to the homepage"
  git -C "$S" switch -q main

  git clone -q --bare "$S" "$WH"
  rm -rf "$S"

  # After the student's first push, Tess pushes too (see tess-push.sh).
  sed "s|__FILES__|$FILES_DIR|" "$FILES_DIR/post-receive" > "$WH/hooks/post-receive"
  chmod +x "$WH/hooks/post-receive"
}

# The playground and its own warehouse. Safe to break: reset-playground rebuilds them.
build_playground() {
  local W="$1" S
  rm -rf "$W/playground" "$W/practice-warehouse.git"
  S=$(mktemp -d)
  new_repo "$S"
  printf '# Practice\n\nA repo for trying things. Break it, then run reset-playground.\n' > "$S/README.md"
  save "$S" Priya "Start the practice repo"
  printf '# Team\n\n- Priya (team lead)\n' > "$S/team.md"
  save "$S" Priya "Add the team page"
  printf 'Some notes.\n' > "$S/notes.txt"
  save "$S" Priya "Add notes"
  git -C "$S" switch -q -c experiment
  printf 'An idea Priya is trying out.\n' > "$S/idea.txt"
  save "$S" Priya "Try out an idea"
  git -C "$S" switch -q main
  git clone -q --bare "$S" "$W/practice-warehouse.git"
  rm -rf "$S"
  git clone -q "$W/practice-warehouse.git" "$W/playground"
}

# ---------------------------------------------------------------- Part 2
# Five small repos, each stuck in a different mess that Tess left behind.
build_rescue() {
  local R="$1" r
  mkdir -p "$R/warehouses"

  # 1. A merge that was started but never finished (conflict still in menu.md).
  r="$R/1-unfinished-merge"; new_repo "$r"
  printf '# Late-night menu\n\n- Chips\n' > "$r/menu.md"; save "$r" Tess "Start the menu"
  git -C "$r" switch -q -c more-snacks
  printf '# Late-night menu\n\n- Chips\n- Pretzels\n' > "$r/menu.md"; save "$r" Tess "Add pretzels"
  git -C "$r" switch -q main
  printf '# Late-night menu\n\n- Chips\n- Cookies\n' > "$r/menu.md"; save "$r" Tess "Add cookies"
  as_person Tess -C "$r" merge -q more-snacks >/dev/null 2>&1 || true

  # 2. Unsaved work that blocks switching branches.
  r="$R/2-stuck-switch"; new_repo "$r"
  printf '<h1>Snack Map</h1>\n<p>Find snacks near you.</p>\n' > "$r/index.html"; save "$r" Tess "Add the homepage"
  git -C "$r" switch -q -c hotfix
  printf '<h1>Snack Map</h1>\n<p>Find snacks near you. Now open on weekends!</p>\n' > "$r/index.html"; save "$r" Priya "Mention weekend hours"
  git -C "$r" switch -q main
  printf '<h1>Snack Map</h1>\n<p>Find snacks near you.</p>\n<!-- Tess draft: big photo of nachos here -->\n' > "$r/index.html"
  rm -rf "$r/.git/logs"   # forget the setup's own branch switching (the checker looks for the student's)

  # 3. Detached HEAD: Tess went back to an old commit and made a new commit there.
  r="$R/3-detached-head"; new_repo "$r"
  printf 'body { background: white; }\n' > "$r/theme.css"; save "$r" Tess "Add a light theme"
  printf 'body { background: white; color: #222; }\n' > "$r/theme.css"; save "$r" Tess "Darker text"
  printf 'body { background: white; color: #222; font-size: 18px; }\n' > "$r/theme.css"; save "$r" Tess "Bigger text"
  git -C "$r" checkout -q HEAD~2
  printf 'body { background: #111; color: #eee; }\n' > "$r/theme.css"; save "$r" Tess "Try a dark theme"

  # 4. A bad commit that was already pushed: it deleted the homepage.
  r="$R/4-bad-commit"; new_repo "$r"
  printf '<h1>Snack Map</h1>\n' > "$r/index.html"; printf 'old stuff\n' > "$r/old-notes.txt"; save "$r" Tess "Add the homepage"
  printf 'h1 { color: #e8743b; }\n' > "$r/style.css"; save "$r" Tess "Add colors"
  rm "$r/index.html" "$r/old-notes.txt"; save "$r" Tess "Clean up old files"
  git clone -q --bare "$r" "$R/warehouses/4-bad-commit.git"
  git -C "$R/warehouses/4-bad-commit.git" config receive.denyNonFastForwards true
  git -C "$r" remote add origin "$R/warehouses/4-bad-commit.git"; git -C "$r" fetch -q origin; git -C "$r" branch -q -u origin/main

  # 5. A password that was committed and pushed.
  r="$R/5-leaked-password"; new_repo "$r"
  printf '<h1>Snack Map</h1>\n' > "$r/index.html"; save "$r" Tess "Add the homepage"
  printf 'DB_USER=snackmap\nDB_PASSWORD=pretzels4ever\n' > "$r/settings.env"; save "$r" Tess "Add database settings"
  git clone -q --bare "$r" "$R/warehouses/5-leaked-password.git"
  git -C "$r" remote add origin "$R/warehouses/5-leaked-password.git"; git -C "$r" fetch -q origin; git -C "$r" branch -q -u origin/main
}

# ---------------------------------------------------------------- Part 3
# The detective case: the homepage title broke somewhere in three days of commits.
# Dates are fixed, so everyone gets the same history (and the same commit IDs).
build_detective() {
  local D="$1"
  new_repo "$D"
  c() { STORY_DATE="$1+00:00" save "$D" "$2" "$3"; }

  printf '# Snack Map\n' > "$D/README.md"
  printf '<h1>Snack Map</h1>\n<p>Late-night snacks, mapped.</p>\n' > "$D/index.html"
  c 2026-11-02T10:00:00 Priya "Start the project"
  printf 'h1 { color: #e8743b; }\n' > "$D/style.css";                                         c 2026-11-02T11:30:00 Tess "Add colors"
  printf '<input placeholder="Search snacks">\n' >> "$D/index.html";                          c 2026-11-02T14:10:00 Jordan "Add the search box"
  printf 'console.log("map loading");\n' > "$D/app.js";                                        c 2026-11-02T16:45:00 Alex "Add the map script"
  printf '#!/usr/bin/env bash\n# Checks the homepage title. Run: bash test.sh\nif grep -q "<h1>Snack Map</h1>" index.html; then\n  echo "PASS: the homepage title is fine"\nelse\n  echo "FAIL: the homepage title is broken"\n  exit 1\nfi\n' > "$D/test.sh"
  c 2026-11-02T18:00:00 Priya "Add a test for the homepage"
  printf 'input { width: 300px; }\n' >> "$D/style.css";                                        c 2026-11-03T09:20:00 Jordan "Make the search box wider"
  printf '<footer>Made by the Snack Map tem</footer>\n' >> "$D/index.html";                   c 2026-11-03T11:05:00 Tess "Add a footer"
  printf 'showSpots();\n' >> "$D/app.js";                                                      c 2026-11-03T13:40:00 Alex "Show snack spots on the map"
  sed -i.bak 's|<h1>Snack Map</h1>|<h1>Snack Map<h1>|' "$D/index.html"; rm -f "$D/index.html.bak"
  c 2026-11-03T15:15:00 Jordan "Tidy up the header"
  printf 'button { background: #13294b; }\n' >> "$D/style.css";                                c 2026-11-03T17:30:00 Tess "New button colors"
  printf 'button { border: 0; }\n' >> "$D/style.css";                                          c 2026-11-03T23:58:00 Alex "Quick fix, don't look"
  printf '# Snack Map\n\nFind late-night snacks on campus.\n' > "$D/README.md";                 c 2026-11-04T09:00:00 Priya "Update the README"
  sed -i.bak 's|Snack Map tem|Snack Map team|' "$D/index.html"; rm -f "$D/index.html.bak";  c 2026-11-04T10:30:00 Jordan "Fix a typo in the footer"
  printf 'cacheSpots();\n' >> "$D/app.js";                                                     c 2026-11-04T12:15:00 Alex "Speed up the map"
  printf 'h1 { color: #e8743b; letter-spacing: 1px; }\ninput { width: 300px; }\nbutton { background: #13294b; border: 0; }\n' > "$D/style.css"
  c 2026-11-04T14:00:00 Tess "Clean up the styles"
}
