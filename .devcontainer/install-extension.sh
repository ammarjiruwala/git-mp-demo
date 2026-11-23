#!/usr/bin/env bash
# Installs the Git Map extension into the Codespace and records what happened
# in phase0-report.txt, so we know which install method works.
cd "$(dirname "$0")/.." || exit 1
REPORT=phase0-report.txt
VSIX=$(ls git-map/*.vsix 2>/dev/null | head -1)

{
  echo "Phase 0 report ($(date))"
  echo "VSIX file: ${VSIX:-NOT FOUND}"
  if command -v code >/dev/null 2>&1; then
    echo "'code' command: available at $(command -v code)"
    if code --install-extension "$VSIX" --force; then
      echo "RESULT: installed with 'code --install-extension'"
    else
      echo "RESULT: 'code --install-extension' FAILED"
    fi
  else
    echo "'code' command: NOT available in this step"
    echo "RESULT: not installed by this script"
  fi
} >> "$REPORT" 2>&1
