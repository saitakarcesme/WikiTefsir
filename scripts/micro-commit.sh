#!/bin/zsh

set -u

repo_dir="${0:A:h:h}"
log_file="$repo_dir/.git/micro-commit.log"
lock_dir="$repo_dir/.git/micro-commit.lock"

run_once() {
  cd "$repo_dir" || return 1

  if ! mkdir "$lock_dir" 2>/dev/null; then
    return 0
  fi
  trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT INT TERM

  git add -A -- . \
    ':(exclude).env' \
    ':(exclude).env.*' \
    ':(exclude)*.pem' \
    ':(exclude)*.key' \
    ':(exclude)*credentials*' \
    ':(exclude).vercel'

  if git diff --cached --quiet; then
    return 0
  fi

  staged_names="$(git diff --cached --name-only)"
  staged_patch="$(git diff --cached --no-ext-diff --unified=0)"

  if print -r -- "$staged_names" | rg -qi '(^|/)(\.env($|\.)|.*\.(pem|key)$|.*credentials.*|\.vercel/)'; then
    git reset -q HEAD -- .
    print -r -- "$(date -Iseconds) blocked: sensitive filename detected" >> "$log_file"
    return 2
  fi

  if print -r -- "$staged_patch" | rg -qi '(BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY|github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+|sk-[A-Za-z0-9_-]{20,}|VERCEL_TOKEN\s*[=:])'; then
    git reset -q HEAD -- .
    print -r -- "$(date -Iseconds) blocked: possible secret detected" >> "$log_file"
    return 2
  fi

  changed_count="$(print -r -- "$staged_names" | sed '/^$/d' | wc -l | tr -d ' ')"
  git commit -m "chore(snapshot): save ${changed_count} file change(s)" >> "$log_file" 2>&1
}

case "${1:-once}" in
  once)
    run_once
    ;;
  daemon)
    while true; do
      run_once
      sleep 120
    done
    ;;
  *)
    print -u2 "usage: $0 [once|daemon]"
    exit 64
    ;;
esac
