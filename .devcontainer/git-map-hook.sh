# Git Map terminal hook.
# After every command, writes "folder<TAB>command" to ~/.git-map/commands.log,
# so the Git Map panel knows which repo to show and what you just ran.
# Loaded from ~/.bashrc (set up by .devcontainer/setup.sh).

__gitmap_last_num=""
__gitmap_last_pwd=""
__gitmap_ready=""

__gitmap_log() {
  local line num cmd
  line=$(HISTTIMEFORMAT= builtin history 1)
  num=$(printf '%s' "$line" | awk '{print $1}')
  cmd=$(printf '%s' "$line" | sed -E 's/^ *[0-9]+\*? *//')
  # Skip the very first prompt (history from an earlier session),
  # and prompts where nothing new was typed and the folder didn't change.
  if [ -n "$__gitmap_ready" ] && { [ "$num" != "$__gitmap_last_num" ] || [ "$PWD" != "$__gitmap_last_pwd" ]; }; then
    mkdir -p "$HOME/.git-map"
    [ "$num" = "$__gitmap_last_num" ] && cmd=""
    printf '%s\t%s\n' "$PWD" "$cmd" >> "$HOME/.git-map/commands.log"
  fi
  __gitmap_last_num="$num"
  __gitmap_last_pwd="$PWD"
  __gitmap_ready=1
}

case "$PROMPT_COMMAND" in
  *__gitmap_log*) ;;
  *) PROMPT_COMMAND="__gitmap_log${PROMPT_COMMAND:+;$PROMPT_COMMAND}" ;;
esac

# `course` jumps back to the course folder from anywhere.
GITMAP_COURSE_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
course() { cd "$GITMAP_COURSE_ROOT" || return; }

# Merges (like the one `git pull` makes) use Git's default message
# instead of opening an editor and waiting.
export GIT_MERGE_AUTOEDIT=no

# Course commands that work from any folder.
check() { "$GITMAP_COURSE_ROOT/check" "$@"; }
reset-playground() { "$GITMAP_COURSE_ROOT/reset-playground" "$@"; }
tess() { "$GITMAP_COURSE_ROOT/tess" "$@"; }
request-review() { bash "$GITMAP_COURSE_ROOT/.course-files/review.sh" "$@"; }
