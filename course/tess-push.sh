#!/usr/bin/env bash
# Tess (a teammate) pushes a commit to a warehouse.
#   $1 = the warehouse folder    $2 = seconds to wait first (default 0)
WAREHOUSE="$1"
# When started from a Git hook, Git's own settings are in the environment. Clear them.
unset $(git rev-parse --local-env-vars 2>/dev/null) GIT_QUARANTINE_PATH GIT_PUSH_OPTION_COUNT
sleep "${2:-0}"

for attempt in 1 2 3; do
  TMP=$(mktemp -d)
  git clone -q "$WAREHOUSE" "$TMP/tess" || exit 1
  cd "$TMP/tess" || exit 1
  [ -f meeting-notes.md ] || printf '# Meeting notes\n\n' > meeting-notes.md
  printf -- '- Demo is on Friday. Bring snacks! (note %s)\n' "$(date +%H:%M:%S)" >> meeting-notes.md
  git add meeting-notes.md
  GIT_AUTHOR_NAME="Tess" GIT_AUTHOR_EMAIL="tess@snackmap.example" \
  GIT_COMMITTER_NAME="Tess" GIT_COMMITTER_EMAIL="tess@snackmap.example" \
    git commit -q -m "Add meeting notes"
  if git push -q origin HEAD 2>/dev/null; then
    cd / && rm -rf "$TMP"
    exit 0
  fi
  # Someone pushed at the same moment. Try again with the newest history.
  cd / && rm -rf "$TMP"
  sleep 2
done
exit 1
