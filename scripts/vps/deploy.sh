#!/usr/bin/env bash
# Deploy website F21 lên VPS, chạy từ máy (thư mục gốc dự án):
#   scripts/vps/deploy.sh                      # build + chạy bản mới
#   scripts/vps/deploy.sh --env                # chỉ chép CLOUDINARY_* từ .env.local lên /srv/f21/.env
#   scripts/vps/deploy.sh --import dump.sql    # lần đầu: nạp dữ liệu (xuất từ D1) vào /srv/f21/data/f21.db
#   scripts/vps/deploy.sh --migrate db/migrations/0015_x.sql   # chạy migration trên SQLite của VPS
# Cần: khoá SSH ~/.ssh/f21_vps đã cài cho root@VPS, VPS đã chạy scripts/vps/setup.sh.
# Build chạy trên VPS (đọc dữ liệu thật trong SQLite để dựng sẵn trang); bản cũ giữ lại 3 bản để quay lui:
#   ssh root@VPS 'ln -sfn /srv/f21/releases/<bản cũ> /srv/f21/current && systemctl restart f21'
set -euo pipefail
VPS="${F21_VPS:-root@180.93.127.106}"
KEY="${F21_KEY:-$HOME/.ssh/f21_vps}"
SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=6 "$VPS")
cd "$(dirname "$0")/../.."

set_env() { # set_env KEY VALUE: ghi/đổi một dòng trong /srv/f21/.env trên VPS
  printf '%s\n' "$2" | "${SSH[@]}" "k='$1'; v=\$(cat); f=/srv/f21/.env; grep -v \"^\$k=\" \$f > \$f.tmp || true; printf '%s=%s\n' \"\$k\" \"\$v\" >> \$f.tmp; mv \$f.tmp \$f; chown f21:f21 \$f; chmod 600 \$f"
}

case "${1:-}" in
  --env)
    for k in CLOUDINARY_CLOUD_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET CLOUDINARY_FOLDER EMAIL_FROM RESEND_API_KEY BOOKING_WEBHOOK_URL; do
      v=$(grep -E "^\s*$k\s*=" .env.local 2>/dev/null | tail -1 | sed -E 's/^[^=]*=\s*//; s/^["'\'']|["'\'']$//g' || true)
      [ -n "$v" ] && set_env "$k" "$v" && echo "✓ $k"
    done
    exit 0 ;;
  --import)
    f="${2:?Thiếu file .sql}"
    "${SSH[@]}" "test ! -s /srv/f21/data/f21.db" || { echo "VPS đã có /srv/f21/data/f21.db, không ghi đè. Xoá tay nếu thật sự muốn nạp lại."; exit 1; }
    scp -i "$KEY" "$f" "$VPS:/tmp/f21-import.sql"
    "${SSH[@]}" "sqlite3 /srv/f21/data/f21.db < /tmp/f21-import.sql && sqlite3 /srv/f21/data/f21.db 'drop table if exists _cf_METADATA; drop table if exists _cf_KV; pragma journal_mode=wal;' >/dev/null && chown f21:f21 /srv/f21/data/f21.db && rm /tmp/f21-import.sql && sqlite3 /srv/f21/data/f21.db 'select count(*) || \" bài viết\" from posts; select count(*) || \" đơn đặt phòng\" from bookings;'"
    exit 0 ;;
  --migrate)
    shift
    for f in "$@"; do
      scp -i "$KEY" "$f" "$VPS:/tmp/f21-migrate.sql"
      "${SSH[@]}" "sqlite3 /srv/f21/data/f21.db '.backup /srv/f21/backups/truoc-migration-$(date +%Y%m%d-%H%M%S).db' && sqlite3 -bail /srv/f21/data/f21.db < /tmp/f21-migrate.sql && rm /tmp/f21-migrate.sql" && echo "✓ $f"
    done
    exit 0 ;;
esac

echo "→ Chép mã nguồn lên VPS"
rsync -az --delete -e "ssh -i $KEY" \
  --exclude node_modules --exclude .next --exclude .git --exclude .wrangler --exclude .open-next \
  --exclude data --exclude '.env*' --exclude '*.log' \
  ./ "$VPS:/srv/f21/src/"

echo "→ Build trên VPS"
"${SSH[@]}" bash -s <<'REMOTE'
set -euo pipefail
chown -R f21:f21 /srv/f21/src
cd /srv/f21/src
run() { runuser -u f21 -- env HOME=/srv/f21 "$@"; }
# Chỉ cài lại thư viện khi package-lock.json đổi
lock=$(sha1sum package-lock.json | cut -d' ' -f1)
if [ ! -d node_modules ] || [ "$(cat node_modules/.lock-sha 2>/dev/null)" != "$lock" ]; then
  run npm ci --no-audit --no-fund --loglevel=error
  echo "$lock" > node_modules/.lock-sha && chown f21:f21 node_modules/.lock-sha
fi
# Biến môi trường thật (SQLITE_PATH, CLOUDINARY_*) để dựng sẵn trang từ dữ liệu thật; không gửi email lúc build
set -a; . /srv/f21/.env; set +a; export F21_CRON=0
# Next.js đôi khi dừng ở bước cuối để nhắc nâng cấp: chạy lại một lần
# (runuser giữ nguyên biến môi trường vừa nạp)
run npx next build --webpack > /srv/f21/build.log 2>&1 \
  || run npx next build --webpack > /srv/f21/build.log 2>&1 \
  || { tail -30 /srv/f21/build.log; exit 1; }

rel=/srv/f21/releases/$(date +%Y%m%d-%H%M%S)
mkdir -p "$rel"
cp -a .next/standalone/. "$rel/"
cp -a .next/static "$rel/.next/static"
cp -a public "$rel/public"
# Ảnh đã thu nhỏ (Next.js image) dùng chung giữa các bản, không phải làm lại sau mỗi lần deploy
mkdir -p /srv/f21/cache/images "$rel/.next/cache" && chown -R f21:f21 /srv/f21/cache
rm -rf "$rel/.next/cache/images" && ln -s /srv/f21/cache/images "$rel/.next/cache/images"
chown -R f21:f21 "$rel"
prev=$(readlink -f /srv/f21/current 2>/dev/null || true)
ln -sfn "$rel" /srv/f21/current
systemctl restart f21

ok=""
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then ok=1; break; fi
  sleep 1
done
if [ -z "$ok" ]; then
  echo "✗ Bản mới không chạy được, quay lại bản cũ"
  journalctl -u f21 -n 30 --no-pager
  [ -n "$prev" ] && ln -sfn "$prev" /srv/f21/current && systemctl restart f21
  exit 1
fi
# Giữ 3 bản gần nhất
ls -1dt /srv/f21/releases/*/ | tail -n +4 | xargs -r rm -rf
echo "✓ Đang chạy $(basename "$rel")"
REMOTE
