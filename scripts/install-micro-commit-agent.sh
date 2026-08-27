#!/bin/zsh

set -eu

repo_dir="${0:A:h:h}"
label="com.wikitafsir.micro-commit"
source_plist="$repo_dir/scripts/$label.plist"
agents_dir="$HOME/Library/LaunchAgents"
target_plist="$agents_dir/$label.plist"
user_domain="gui/$(id -u)"

mkdir -p "$agents_dir"
launchctl bootout "$user_domain/$label" 2>/dev/null || true
cp "$source_plist" "$target_plist"
plutil -lint "$target_plist"
launchctl bootstrap "$user_domain" "$target_plist"
launchctl enable "$user_domain/$label"
launchctl kickstart -k "$user_domain/$label"

print "WikiTefsir micro-commit agent is active (120-second interval)."
