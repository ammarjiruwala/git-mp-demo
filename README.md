# Git MP demo (work in progress)

A demo of a CS124H MP that teaches Git with a story and a live picture of what each command does.

**Current stage: Chapters 0–5 playable.** Open the Codespace and follow the lesson that opens on the left (Chapter 0).

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/ammarjiruwala/git-mp-demo)

## What's here

| Folder / file | What it is |
|---|---|
| `git-map/` | The Git Map VS Code extension (source, tests, and the packaged `git-map.vsix`) |
| `lessons/` | The lesson pages that open in the Codespace |
| `start` | Builds the story world in `workspace/` (run again to start the MP over) |
| `reset` | Resets only the playground |
| `check` | Shows which chapters are done (the future PrairieLearn autograder) |
| `tess` | Practice: makes Tess push to the playground |
| `course/` | The story's history, Tess's automatic push, shared build scripts |
| `.devcontainer/` | How the Codespace is set up |

To work on the extension: `cd git-map && npm test`, then `npm run package` to rebuild `git-map.vsix`.
