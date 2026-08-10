#!/usr/bin/env bash
#
# Deploy script for the weather app.
# TLS is terminated by Nginx Proxy Manager, so this only builds and runs the
# container on the shared Docker network.
#
# Usage:
#   ./deploy.sh up      build and start the app
#   ./deploy.sh down    stop the container
#   ./deploy.sh logs    tail the web server logs
#   ./deploy.sh rebuild build, recreate, and restart
set -euo pipefail

ensure_env() {
  if [ ! -f .env ]; then
    echo "==> Creating .env from .env.example (edit it with the real API keys)"
    cp .env.example .env
  fi
}

cmd_up() {
  ensure_env

  echo "==> Building app image..."
  docker compose up -d --build
  echo "==> App running on the 'proxy' network as weather-app:80"
  echo "    Point an NPM proxy host at it and let NPM handle SSL."
}

cmd_down() {
  docker compose down
}

cmd_logs() {
  docker compose logs -f web
}

cmd_rebuild() {
  docker compose up -d --build --force-recreate
}

case "${1:-}" in
  up) cmd_up ;;
  down) cmd_down ;;
  logs) cmd_logs ;;
  rebuild) cmd_rebuild ;;
  *)
    echo "Usage: $0 {up|down|logs|rebuild}" >&2
    exit 1
    ;;
esac
