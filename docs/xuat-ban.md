# Tự cập nhật website (Workers Builds)

Trang website chỉ dựng lúc build: Workers Free không đủ CPU để dựng lại trang mỗi khi lưu CMS (sự cố 02/11/2026).
Từ 08/11/2026 CMS không còn nút "Xuất bản website": lưu là đủ. Cron mỗi 2 phút (`src/cms/server/publish.ts`,
`wrangler.jsonc` "triggers") thấy nội dung mới đã lưu và đã 2 phút không ai sửa thêm thì gọi **Deploy Hook** của
Cloudflare Workers Builds. Cloudflare lấy code ở nhánh `production` trên GitHub, build lại (đọc D1 thật) rồi deploy.
Khoảng 10 phút sau khi lưu, website có nội dung mới. Lưu nháp trang kéo thả không kích hoạt build.
Mỗi lần gọi build ghi vào CMS › Nhật ký ("Bản cập nhật website"). Log: `npx wrangler tail f21hotel` (dòng `[publish]`).

Không cần build với: đặt phòng, phòng trống, giá theo ngày, email khách. Các mục này chạy qua API, luôn cập nhật ngay.
Gói Free có 3.000 phút build mỗi tháng, mỗi lần chỉ chạy một build, mỗi build tối đa 20 phút.

## Cài đặt (làm một lần, trên dashboard Cloudflare)

Trước khi cài, chạy trên D1 thật các migration mà code ở nhánh `production` cần
(`db/migrations/0003_booking_emails.sql`, `0004_posts.sql`): `npx wrangler d1 execute D1 --remote --file db/migrations/<file>`.
Khi vừa nối GitHub, Cloudflare build ngay một lần, nên D1 thật phải sẵn sàng từ trước.

1. **Nhánh production**: tạo nhánh `production` từ commit đang chạy hoặc commit muốn deploy:
   `git push origin <commit>:refs/heads/production`. Mỗi lần push vào nhánh này là Cloudflare deploy, nên chỉ push
   khi code đã sẵn sàng và migration đã chạy xong. Các nhánh `cms`, `main` không tự deploy.
2. **API token cho build**: Cloudflare › My Profile › API Tokens › Create Token › *Custom token*. Cấp quyền:
   Account: Workers Scripts (Edit), Workers KV Storage (Edit), **D1 (Edit)**, Account Settings (Read);
   Zone: Workers Routes (Edit); User: User Details (Read), Memberships (Read). Chỉ cho tài khoản của khách sạn.
   Token tự tạo của Workers Builds không có quyền D1, mà bước build phải đọc D1 thật để dựng trang.
3. Workers & Pages › `f21hotel` › **Settings › Builds** › Connect: chọn repo `NguyenZak/f21hotel`, rồi điền:
   - Branch (production branch): `production`. Bỏ chọn *Enable Preview Builds* (khỏi build mỗi khi push nhánh khác).
   - Build command: `npm run build:cf`
   - Deploy command: `npx opennextjs-cloudflare deploy`
   - API token: chọn token tạo ở bước 2.
   - **Build variables and secrets**:
     `CLOUDINARY_CLOUD_NAME` (bắt buộc: trang dựng sẵn cần nó để tạo đường dẫn ảnh),
     `CLOUDFLARE_ACCOUNT_ID` = `a53fd282b8369dffc65cf51b9e234e2a`,
     `CLOUDFLARE_API_TOKEN` (secret) = token ở bước 2, để wrangler đọc D1 thật trong bước build.
4. Settings › Builds › **Deploy Hooks** › Create: đặt tên `CMS tự cập nhật`, chọn nhánh `production`. Chép URL.
   Ai có URL này đều build được (không cần đăng nhập), nên giữ kín như mật khẩu.
5. Đặt URL làm secret cho worker: `npx wrangler secret put DEPLOY_HOOK_URL`, rồi dán URL.
6. Thử: sửa một mục trong CMS, lưu, chờ 2–4 phút rồi xem tiến độ ở Workers & Pages › `f21hotel` › Deployments / Builds.
   Build lỗi thì website cũ vẫn chạy bình thường. Mở log build để xem lý do.

## Deploy code (cho người làm website)

Code mới vẫn phải qua bước kiểm tra như trước: chạy migration D1 trước, sau đó mới đưa code vào nhánh `production`
(`git push origin cms:production`). Cloudflare tự build và deploy, không cần chạy `opennextjs-cloudflare deploy` ở máy.
