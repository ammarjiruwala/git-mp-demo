#!/usr/bin/env bash
# Installs the Git Map extension each time VS Code connects to the Codespace.
cd "$(dirname "$0")/.." || exit 1
VSIX=$(ls git-map/*.vsix 2>/dev/null | sort -V | tail -1)
if [ -z "$VSIX" ]; then echo "Git Map: no .vsix file found"; exit 0; fi
code --install-extension "$VSIX" --force > /tmp/git-map-install.log 2>&1 \
  && echo "Git Map installed ($VSIX)" \
  || echo "Git Map install failed, see /tmp/git-map-install.log"
