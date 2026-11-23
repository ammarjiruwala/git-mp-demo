# Git MP demo (work in progress)

A demo of a CS124H MP that teaches Git with a story and a live picture of what each command does.

**Current stage: Phase 1, the Git Map.** Open the Codespace and follow the lesson that opens on the left.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/ammarjiruwala/git-mp-demo)

## What's here

| Folder / file | What it is |
|---|---|
| `git-map/` | The Git Map VS Code extension (source, tests, and the packaged `git-map.vsix`) |
| `lessons/` | The lesson pages that open in the Codespace |
| `start` | Builds the practice repos in `workspace/` (run again to reset) |
| `tess` | Pretends a teammate pushed a commit |
| `.devcontainer/` | How the Codespace is set up |

To work on the extension: `cd git-map && npm test`, then `npm run package` to rebuild `git-map.vsix`.
