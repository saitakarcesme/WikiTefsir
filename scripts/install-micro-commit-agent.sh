#!/bin/zsh

set -eu

repo_dir="${0:A:h:h}"
pid_file="$repo_dir/.git/micro-commit.pid"
agent_log="$repo_dir/.git/micro-commit-daemon.log"

if [[ -f "$pid_file" ]]; then
  existing_pid="$(<"$pid_file")"
  if kill -0 "$existing_pid" 2>/dev/null; then
    print "WikiTefsir micro-commit agent is already active (PID $existing_pid)."
    exit 0
  fi
fi

nohup "$repo_dir/scripts/micro-commit.sh" daemon >> "$agent_log" 2>&1 &
agent_pid=$!
print -r -- "$agent_pid" > "$pid_file"
sleep 1

if ! kill -0 "$agent_pid" 2>/dev/null; then
  print -u2 "Micro-commit agent failed to start. See $agent_log"
  exit 1
fi

print "WikiTefsir micro-commit agent is active (PID $agent_pid, 120-second interval)."
