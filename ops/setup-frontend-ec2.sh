#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo DOMAIN=example.com EMAIL=admin@example.com bash $0"
  exit 1
fi

: "${DOMAIN:?Set DOMAIN, for example DOMAIN=titipin.me}"
: "${EMAIL:?Set EMAIL, for example EMAIL=admin@titipin.me}"

EXTRA_DOMAINS="${EXTRA_DOMAINS:-www.${DOMAIN}}"
APP_NAME="${APP_NAME:-titipin-frontend}"
UPSTREAM_PORT="${UPSTREAM_PORT:-3001}"
SERVER_NAMES="${DOMAIN}"

if [[ -n "${EXTRA_DOMAINS}" ]]; then
  IFS=',' read -r -a EXTRA_DOMAIN_LIST <<< "${EXTRA_DOMAINS}"
  for extra_domain in "${EXTRA_DOMAIN_LIST[@]}"; do
    extra_domain="$(echo "${extra_domain}" | xargs)"
    if [[ -n "${extra_domain}" ]]; then
      SERVER_NAMES="${SERVER_NAMES} ${extra_domain}"
    fi
  done
fi

echo "==> Installing packages"
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates \
  curl \
  docker.io \
  nginx \
  certbot \
  python3-certbot-nginx

echo "==> Enabling services"
systemctl enable --now docker
systemctl enable --now nginx

if [[ "${ADD_UBUNTU_TO_DOCKER_GROUP:-0}" == "1" ]] && id ubuntu >/dev/null 2>&1; then
  usermod -aG docker ubuntu
fi

echo "==> Configuring firewall if UFW is active"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow OpenSSH
  ufw allow "Nginx Full"
fi

echo "==> Writing Nginx site for ${SERVER_NAMES}"
cat > "/etc/nginx/sites-available/${APP_NAME}.conf" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAMES};

    location / {
        proxy_pass http://127.0.0.1:${UPSTREAM_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sfn "/etc/nginx/sites-available/${APP_NAME}.conf" "/etc/nginx/sites-enabled/${APP_NAME}.conf"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Requesting Let's Encrypt certificate"
CERTBOT_DOMAINS=(-d "${DOMAIN}")
if [[ -n "${EXTRA_DOMAINS}" ]]; then
  for extra_domain in "${EXTRA_DOMAIN_LIST[@]}"; do
    extra_domain="$(echo "${extra_domain}" | xargs)"
    if [[ -n "${extra_domain}" ]]; then
      CERTBOT_DOMAINS+=(-d "${extra_domain}")
    fi
  done
fi

certbot --nginx \
  --non-interactive \
  --agree-tos \
  --redirect \
  --email "${EMAIL}" \
  "${CERTBOT_DOMAINS[@]}"

echo "==> Verifying renewal timer"
systemctl list-timers | grep -E "certbot|snap.certbot" || true

echo "Done. Nginx is configured for ${SERVER_NAMES} and proxies to 127.0.0.1:${UPSTREAM_PORT}."
echo "Jenkins blue-green deploy will switch Nginx between ports 3001 and 3002 after the first deploy."
