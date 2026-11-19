#!/usr/bin/env bash
# Cài đặt VPS lần đầu cho F21 Hotel (Ubuntu 22.04/24.04 hoặc Debian 12). Chạy bằng root trên VPS:
#   bash setup.sh
# Chạy lại nhiều lần không sao (bước nào đã xong thì bỏ qua).
# Kết quả: Node 24, Caddy (web server, HTTPS), tường lửa chỉ mở 22/80/443, swap 2 GB khi RAM < 4 GB,
# người dùng hệ thống f21, thư mục /srv/f21, dịch vụ systemd f21 (chạy website ở 127.0.0.1:3000),
# sao lưu SQLite mỗi ngày lúc 03:00 (giữ 14 bản).
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

apt-get update -qq
apt-get install -y -qq curl ca-certificates gnupg rsync sqlite3 ufw debian-keyring debian-archive-keyring apt-transport-https >/dev/null

# Múi giờ Việt Nam cho log; ứng dụng tự tính giờ theo UTC/Asia/Ho_Chi_Minh
timedatectl set-timezone Asia/Ho_Chi_Minh || true

# Swap: build Next.js cần ~1,5–2 GB RAM
if ! swapon --show | grep -q . && [ "$(awk '/MemTotal/ {print $2}' /proc/meminfo)" -lt 4000000 ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "vm.swappiness=10" > /etc/sysctl.d/99-swap.conf && sysctl -q -p /etc/sysctl.d/99-swap.conf
fi

# Node.js 24 LTS
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 24 ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi

# Caddy
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq && apt-get install -y -qq caddy >/dev/null
fi

# Tường lửa
ufw allow OpenSSH >/dev/null && ufw allow 80/tcp >/dev/null && ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

# Người dùng và thư mục
id f21 >/dev/null 2>&1 || useradd --system --create-home --home-dir /srv/f21 --shell /usr/sbin/nologin f21
mkdir -p /srv/f21/{src,releases,data,backups}
chown -R f21:f21 /srv/f21
chmod 750 /srv/f21/data /srv/f21/backups

# File cấu hình bí mật (deploy.sh điền giá trị). Chỉ root và f21 đọc được
if [ ! -f /srv/f21/.env ]; then
  umask 077
  cat > /srv/f21/.env <<ENV
PORT=3000
HOSTNAME=127.0.0.1
SQLITE_PATH=/srv/f21/data/f21.db
PAYLOAD_SECRET=$(openssl rand -hex 32)
F21_CRON=1
NEXT_TELEMETRY_DISABLED=1
ENV
  chown f21:f21 /srv/f21/.env
fi

# Dịch vụ website
cat > /etc/systemd/system/f21.service <<'UNIT'
[Unit]
Description=F21 Hotel website (Next.js)
After=network.target

[Service]
User=f21
Group=f21
WorkingDirectory=/srv/f21/current
EnvironmentFile=/srv/f21/.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
# Giới hạn bộ nhớ để một lỗi rò rỉ không làm treo cả máy
MemoryMax=1200M
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ReadWritePaths=/srv/f21

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable f21 >/dev/null 2>&1 || true

# Caddy: tạm thời phục vụ qua địa chỉ IP (http). Khi chuyển tên miền, deploy.sh --domain thay file này.
if [ ! -f /etc/caddy/.f21 ]; then
  cat > /etc/caddy/Caddyfile <<'CADDY'
:80 {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000
}
CADDY
  touch /etc/caddy/.f21
  systemctl reload caddy || systemctl restart caddy
fi

# Sao lưu SQLite mỗi ngày 03:00, giữ 14 bản
cat > /etc/cron.d/f21-backup <<'CRON'
0 3 * * * f21 sqlite3 /srv/f21/data/f21.db ".backup /srv/f21/backups/f21-$(date +\%F).db" && find /srv/f21/backups -name 'f21-*.db' -mtime +14 -delete
CRON

echo "Xong. Node $(node -v), $(caddy version | cut -d' ' -f1), RAM $(free -h | awk '/Mem/ {print $2}'), swap $(free -h | awk '/Swap/ {print $2}')"
