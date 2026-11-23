#!/usr/bin/env bash
# Git's viewer (pager). Git uses it to show long output like `git log` one
# screen at a time. This is the normal viewer (less); it also leaves a marker
# file so the Git Map can show "you're in the viewer, press q to quit".
mkdir -p "$HOME/.git-map"
touch "$HOME/.git-map/viewer-open"
trap 'rm -f "$HOME/.git-map/viewer-open"' EXIT
less "$@"
