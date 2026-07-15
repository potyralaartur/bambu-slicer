#!/usr/bin/env bash
# Start the local Vite dev server on session start.
# Opening the side browser panel must be done by the agent via MCP on first turn;
# cursor --open-url targets stable-browser-session, not this agent's side panel.

set -u

DEV_URL="http://localhost:5173/bambu-slicer/"
PORT=5173
LOG_FILE="/tmp/bambu-slicer-dev-preview.log"

log() {
  printf '[%s] %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*" >>"$LOG_FILE"
}

input="$(cat)"

should_run=true
agent_id=""
if command -v python3 >/dev/null 2>&1; then
  parsed="$(
    printf '%s' "$input" | python3 -c 'import json, sys
try:
    data = json.load(sys.stdin)
except json.JSONDecodeError:
    print("true\t")
    raise SystemExit(0)
agent_id = data.get("conversation_id") or data.get("session_id") or ""
print(("false" if data.get("is_background_agent") else "true") + "\t" + str(agent_id))'
  )"
  should_run="${parsed%%$'\t'*}"
  agent_id="${parsed#*$'\t'}"
fi

if [ "$should_run" != "true" ]; then
  log "skip background agent"
  printf '{}\n'
  exit 0
fi

project_dir="${CURSOR_PROJECT_DIR:-$(pwd)}"
if [ ! -f "$project_dir/package.json" ]; then
  log "skip missing package.json in ${project_dir}"
  printf '{}\n'
  exit 0
fi

log "sessionStart agent_id=${agent_id:-unknown} project=${project_dir}"

is_listening() {
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1
}

ensure_dev_server() {
  if is_listening; then
    log "dev server already listening on ${PORT}"
    return 0
  fi

  if [ ! -d "$project_dir/node_modules" ]; then
    log "skip dev server start: node_modules missing"
    return 1
  fi

  (
    cd "$project_dir" || exit 1
    npm run dev >> /tmp/bambu-slicer-vite.log 2>&1 &
  )

  for _ in $(seq 1 40); do
    if is_listening; then
      log "dev server started on ${PORT}"
      return 0
    fi
    sleep 0.25
  done

  log "dev server failed to start on ${PORT}"
  return 1
}

ensure_dev_server || true

log "side browser must be opened by agent MCP (cursor --open-url is unreliable)"

printf '{"additional_context":"Dev preview REQUIRED before any other work: (1) browser_tabs list (2) browser_navigate to %s with position side, using a viewId that is NOT stable-browser-session (prefer the short hex viewId for this agent tile) (3) if panel still hidden, retry with position active (4) ensure npm run dev on port 5173."}\n' "$DEV_URL"
exit 0
