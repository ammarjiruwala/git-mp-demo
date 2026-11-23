#!/usr/bin/env bash
# Runs once when the Codespace is created.
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)

# 1. Let the Git Map follow the terminal.
grep -q "git-map-hook.sh" ~/.bashrc 2>/dev/null || echo "source \"$ROOT/.devcontainer/git-map-hook.sh\"" >> ~/.bashrc

# 2. Git settings that avoid beginner traps:
#    - `git pull` merges instead of stopping with "divergent branches"
#    - commit messages open in VS Code instead of a terminal editor
git config --global pull.rebase false
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
#    - long output (git log, git show) opens Git's normal viewer, which also
#      tells the Git Map to show "press q to quit"
git config --global core.pager "bash $ROOT/.course-files/git-viewer.sh"
# (Your name and email are set by you in Chapter 4.)

# 3. Build the practice repos.
./start --yes
