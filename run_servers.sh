#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
killall node 2>/dev/null || true
cd "$DIR/backend" && node server.js &
cd "$DIR/frontend-web" && npm run dev &
cd "$DIR/frontend-admin" && npm run dev &
wait
