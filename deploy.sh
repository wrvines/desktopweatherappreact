#!/usr/bin/env bash
#
# Deploy script for the weather app on a home server.
#
# Prerequisites (once):
#   - docker + docker compose v2 installed
#   - Ports 80 and 443 forwarded on your router to this machine
#   - DNS A records for the DOMAIN and www.DOMAIN point at your home IP
#   - A .env file exists (cp .env.example .env) with the real API keys
#
# Usage:
#   ./deploy.sh up      build the app, start nginx, obtain/replace SSL certs
#   ./deploy.sh renew   renew SSL certs (run via cron/systemd timer)
#   ./deploy.sh down    stop the containers
#   ./deploy.sh logs    tail the web server logs
set -euo pipefail

DOMAIN="williamvines.com"
EMAIL="william.r.vines@gmail.com"

make_placeholder_certs() {
  echo "==> Generating placeholder certs so nginx can start..."
  docker compose --profile certs run --rm --entrypoint sh certbot -c "
    apk add --no-cache openssl >/dev/null 2>&1
    mkdir -p /etc/letsencrypt/live/$DOMAIN
    openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
      -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
      -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
      -subj '/CN=$DOMAIN' 2>/dev/null
  "
}

obtain_real_certs() {
  echo "==> Requesting Let's Encrypt certificates..."
  docker compose --profile certs run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email \
    --non-interactive --keep-until-expiring
}

reload_nginx() {
  docker compose exec web nginx -s reload || true
}

ensure_env() {
  if [ ! -f .env ]; then
    echo "==> Creating .env from .env.example (edit it with the real API keys)"
    cp .env.example .env
  fi
}

cmd_up() {
  ensure_env

  echo "==> Building app image..."
  docker compose build
  docker compose up -d

  if [ ! -f "$(docker volume inspect desktopweatherappreact_certbot-conf --format '{{.Mountpoint}}')/live/$DOMAIN/fullchain.pem" ] 2>/dev/null; then
    make_placeholder_certs
    docker compose up -d
  fi

  if obtain_real_certs; then
    echo "==> Certificates obtained, reloading nginx..."
    reload_nginx
  else
    echo "==> Could not obtain real certs (DNS/router not ready?)."
    echo "    Site is running with placeholder certs on https://$DOMAIN"
    echo "    Re-run: ./deploy.sh up"
  fi
}

cmd_renew() {
  docker compose --profile certs run --rm certbot renew --webroot -w /var/www/certbot
  reload_nginx
}

cmd_down() {
  docker compose down
}

cmd_logs() {
  docker compose logs -f web
}

case "${1:-}" in
  up) cmd_up ;;
  renew) cmd_renew ;;
  down) cmd_down ;;
  logs) cmd_logs ;;
  *)
    echo "Usage: $0 {up|renew|down|logs}" >&2
    exit 1
    ;;
esac
