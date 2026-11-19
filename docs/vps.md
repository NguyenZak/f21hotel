# Chạy website trên VPS

Từ 11/2026 website có thể chạy trên VPS (Node.js + SQLite) thay cho Cloudflare Workers. Nhánh `vps`.

## Khác gì so với Cloudflare

- Dữ liệu: một file SQLite `/srv/f21/data/f21.db` (cùng cấu trúc với D1, `src/lib/sqlite-d1.ts` giả API D1).
- Sửa trong CMS là website cập nhật ngay (revalidateTag), không cần build lại.
- Email nhắc lịch: `src/instrumentation.ts` (01:00, 07:00 UTC) thay cho cron của Cloudflare.
- 404 cho bài viết / địa điểm không có: `src/proxy.ts` thay cho `worker.ts`.
- Ảnh vẫn ở Cloudinary.

## Cài đặt lần đầu

1. Cài khoá SSH: `ssh-copy-id -i ~/.ssh/f21_vps.pub root@<IP>`
2. Cài máy chủ: `scp -i ~/.ssh/f21_vps scripts/vps/setup.sh root@<IP>:/root/ && ssh -i ~/.ssh/f21_vps root@<IP> bash /root/setup.sh`
3. Biến môi trường: `scripts/vps/deploy.sh --env` (chép CLOUDINARY_* từ .env.local). Khoá Resend (RESEND_API_KEY, EMAIL_FROM) nếu dùng thì thêm vào `.env.local` trước khi chạy.
4. Dữ liệu: xuất D1 `npx wrangler d1 export D1 --remote --output d1.sql`, rồi `scripts/vps/deploy.sh --import d1.sql`.
5. Deploy: `scripts/vps/deploy.sh`. Website chạy ở http://<IP>.
6. Tài khoản CMS: mật khẩu cũ vẫn dùng được (đã nằm trong dữ liệu). Cần đặt lại thì trên VPS:
   `cd /srv/f21/src && SQLITE_PATH=/srv/f21/data/f21.db ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin.mjs --sqlite`

## Hằng ngày

- Deploy code: `scripts/vps/deploy.sh` (build trên VPS, giữ 3 bản cũ, tự quay lại bản cũ nếu bản mới không chạy).
- Migration: `scripts/vps/deploy.sh --migrate db/migrations/00xx.sql` (tự sao lưu trước khi chạy), rồi deploy.
- Sao lưu: mỗi ngày 03:00 vào `/srv/f21/backups` (giữ 14 ngày).
- Log: `ssh root@<IP> journalctl -u f21 -f`
