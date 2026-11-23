#!/usr/bin/env bash
# Chapter 9: Priya reviews a branch the student pushed, like a pull request on GitHub.
#   request-review <branch>
# If the branch fixes the README typo, Priya approves it and merges it into main
# on the warehouse. Otherwise she explains what to change.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WH="$ROOT/workspace/warehouse.git"
BRANCH="$1"

say() { printf '\n  Priya: %s\n' "$1"; }

if [ -z "$BRANCH" ]; then
  echo "Which branch should Priya review? For example: request-review fix-typo"
  exit 1
fi
if [ "$BRANCH" = "main" ]; then
  say "Pull requests come from a branch, not from main. Make a branch, commit there, and push the branch."
  exit 1
fi
if ! git -C "$WH" rev-parse -q --verify "refs/heads/$BRANCH" >/dev/null; then
  say "I can't find a branch called \"$BRANCH\" in the warehouse. Did you push it? Try: git push -u origin $BRANCH"
  exit 1
fi

TMP=$(mktemp -d)
git clone -q "$WH" "$TMP/review" && cd "$TMP/review" || exit 1
git switch -q "$BRANCH"

if grep -q "nite" README.md || ! grep -q "night" README.md; then
  say "Thanks for the pull request! I looked at README.md on \"$BRANCH\" and it still says \"nite\". Fix it to \"night\", commit, push the branch again, and ask me again."
  cd / && rm -rf "$TMP"; exit 1
fi

git switch -q main
N=$(( $(git log --oneline main | grep -c "Merge pull request") + 1 ))
if ! GIT_AUTHOR_NAME=Priya GIT_AUTHOR_EMAIL=priya@snackmap.example GIT_COMMITTER_NAME=Priya GIT_COMMITTER_EMAIL=priya@snackmap.example \
     git merge -q --no-ff "$BRANCH" -m "Merge pull request #$N from $BRANCH" >/dev/null 2>&1; then
  say "Your branch conflicts with main. Update it first: git switch $BRANCH, then git merge main, fix any conflict, commit, push, and ask again."
  cd / && rm -rf "$TMP"; exit 1
fi
git push -q origin main
cd / && rm -rf "$TMP"

echo ""
echo "  Pull request #$N: $BRANCH → main"
echo "  ✓ Priya approved these changes"
echo "  Priya: Great catch on the typo, thanks! Merged into main."
echo ""
echo "  The merge happened in the warehouse, not on your laptop."
echo "  Bring it down with: git switch main, then git pull"
echo ""
