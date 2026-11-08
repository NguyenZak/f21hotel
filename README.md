# F21 Hotel – Website

Website đặt phòng trực tiếp cho F21 Hotel, khu biệt thự Hoa Phượng, An Khánh, Hà Nội.

- Next.js 16 (App Router, Cache Components) + TypeScript
- Chạy trên Cloudflare Workers qua [OpenNext](https://opennext.js.org/cloudflare)
- Font: chọn trong [src/lib/theme.ts](src/lib/theme.ts) cho 3 vai trò (tiêu đề, hero, nội dung) từ 12 font nạp sẵn ở [src/app/fonts.ts](src/app/fonts.ts). Mặc định: Trajan Pro 3 cho tiêu đề, Inter cho hero, STIX Two Text cho nội dung. Màu theo Cẩm nang thương hiệu

## Chạy ở máy

```sh
npm install
cp .dev.vars.example .dev.vars   # tuỳ chọn, xem docs/google-apps-script.md
npm run dev                      # http://localhost:3000
npm run preview                  # build và chạy trong workerd, giống môi trường Cloudflare
```

## Deploy lên Cloudflare

```sh
npx wrangler login
npx wrangler secret put BOOKING_WEBHOOK_URL   # URL Google Apps Script
npm run deploy
```

Sau đó gắn tên miền trong Cloudflare Dashboard → Workers → `f21-hotel-web` → Settings → Domains & Routes, và sửa `url` trong [src/lib/site.ts](src/lib/site.ts) cho đúng tên miền.

## Sửa nội dung

Toàn bộ thông tin khách sạn nằm trong [src/lib/site.ts](src/lib/site.ts): số điện thoại, Zalo, địa chỉ, giờ nhận/trả phòng, hạng phòng và giá, ưu đãi, khoảng cách, câu hỏi thường gặp. Tìm `TODO` để thấy các mục cần khách sạn xác nhận.

Ảnh phòng đang là ảnh tạm (khối màu đỏ có biểu tượng). Khi có ảnh chụp, đặt vào `public/img/` và thay `<Placeholder>` bằng `<Image>` trong [src/components/ui.tsx](src/components/ui.tsx) và [src/app/phong/page.tsx](src/app/phong/page.tsx).

## Cấu trúc

| Đường dẫn | Trang |
| --- | --- |
| `/` | Trang chủ: hero, đặt nhanh, giới thiệu, phòng, quyền lợi đặt trực tiếp, nhóm khách, vị trí, ưu đãi, hỏi đáp |
| `/phong` | Chi tiết 4 hạng phòng |
| `/uu-dai` | Ưu đãi theo dịp, có mã |
| `/doan-doanh-nghiep` | Gói đoàn và form xin báo giá |
| `/vi-tri` | Bản đồ, câu chỉ đường, khoảng cách, video đường vào |
| `/dat-phong` | Form đặt phòng, liên hệ, chính sách |

Đường dẫn đặt phòng nhận tham số để điền sẵn form: `/dat-phong?room=deluxe&in=2026-11-07&out=2026-11-08&guests=2&code=10FEST`.

## Form đặt phòng

Form gửi qua Server Action ([src/app/actions.ts](src/app/actions.ts)): kiểm tra dữ liệu ở server, gửi về Google Sheet và email lễ tân qua webhook ([hướng dẫn](docs/google-apps-script.md)), sau đó cho khách bấm “Gửi qua Zalo” với nội dung đã soạn sẵn.

## Đo lường

[src/lib/track.ts](src/lib/track.ts) gửi các sự kiện `click_call`, `click_zalo`, `submit_booking` tới GA4 / Google Ads khi đã gắn `gtag` (chưa gắn).

## CMS (quản trị khách sạn)

Trang quản trị: **`/quan-tri`** (tiếng Việt, dùng được trên điện thoại). `/admin` (CMS Payload cũ, đã bỏ) chuyển hướng về đây.

Website chạy trên **Cloudflare Workers gói Free**, giới hạn **10 ms CPU mỗi yêu cầu**. Vì vậy:

- **Giao diện CMS** là các trang tĩnh chạy trong trình duyệt ([src/cms/client](src/cms/client), route ở [src/app/(cms)](src/app/(cms))).
- **API** `/api/cms/*` (CMS) và `/api/booking/*` (đặt phòng trên website) chạy trong [worker.ts](worker.ts), **trước khi nạp Next.js**: mỗi yêu cầu chỉ là vài câu SQL trên D1 (0–5 ms CPU). Code: [src/cms/server](src/cms/server), [src/lib/booking-api.ts](src/lib/booking-api.ts). Khi chạy `next dev`, các route [src/app/api](src/app/api) gọi cùng hàm đó.
- **Trang website** đọc D1 bằng SQL ([src/lib/site-data.ts](src/lib/site-data.ts)), được lưu đệm theo nhãn ([src/lib/cms.ts](src/lib/cms.ts)). Trang chỉ được dựng lúc build, đọc D1 thật; **không dựng lại trên Workers** (gói Free 10 ms CPU, dựng một trang tốn ~650 ms làm worker treo và cả website trả 500). Nội dung sửa trong CMS lên website ở lần deploy tiếp theo.
- Không dùng server action cho thao tác của khách hay của CMS: mỗi lần gọi phải nạp cả Next.js (200–500 ms CPU khi worker vừa khởi động).

Chi tiết:

- **Dữ liệu:** Cloudflare D1, cấu trúc ở [db/schema.sql](db/schema.sql) (giữ nguyên các bảng do CMS Payload tạo trước đây).
- **Đăng nhập:** cookie ký HMAC bằng `PAYLOAD_SECRET`, 7 ngày; sai 5 lần khoá 10 phút. Mật khẩu PBKDF2-SHA256 30000 vòng (≈6 ms CPU trên Workers). Không có form tự đăng ký: tài khoản Chủ tạo/đặt lại bằng `npm run create-admin` (D1 thật: `create-admin:remote`, đọc `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` trong `.env.local`; xoá `ADMIN_PASSWORD` sau khi xong). Các tài khoản khác do Chủ tạo trong CMS › Cài đặt › Tài khoản.
- **Vai trò:** Chủ (toàn quyền), Quản lý (nội dung, giá, cài đặt, nhật ký), Nhân viên (đặt phòng, lịch phòng, xem phòng). Nhật ký thao tác ghi mọi lần thêm, sửa, xoá.
- **Vận hành:** Hôm nay, Đặt phòng (tạo/sửa, gán phòng, Xác nhận → Nhận phòng → Trả phòng), Lịch phòng ([src/cms/server/bookings.ts](src/cms/server/bookings.ts)).
- **Nội dung:** hạng phòng, phòng, giá theo ngày, ưu đãi, đánh giá, hỏi đáp, thông tin khách sạn, giao diện, khai báo ở [src/cms/schema.ts](src/cms/schema.ts); form và API sinh từ khai báo này. Thêm trường: thêm cột vào D1 (file `db/migrations/NNNN_*.sql`, chạy `npx wrangler d1 execute D1 --remote --file …`) rồi khai báo trong schema.ts.
- **Ảnh:** Cloudinary. Trình duyệt tải thẳng lên Cloudinary bằng chữ ký do API cấp ([src/cms/server/media.ts](src/cms/server/media.ts)).
- **Trình dựng trang:** CMS › Website › Trang › Mở trình dựng (`/quan-tri/dung-trang?id=`), dựng bằng [Puck](https://puckeditor.com). Lưu nháp không đổi website; Xuất bản thì website tự cập nhật sau khoảng 10 phút. Các khối ở [src/blocks](src/blocks): `render.tsx` (giao diện), `editor-config.tsx` (trường chỉnh sửa), `config.ts` (bản chỉ hiển thị).

### Chạy ở máy

```sh
npm install
# .env.local: PAYLOAD_SECRET (khoá ký phiên đăng nhập), CLOUDINARY_* (thư viện ảnh)
npm run db:schema          # dựng bảng cho D1 ở máy (lần đầu)
# Lấy dữ liệu thật về máy (tuỳ chọn): npx wrangler d1 export D1 --remote --output data.sql
#                                      npx wrangler d1 execute D1 --local --file data.sql
npm run create-admin       # tạo tài khoản Chủ cho D1 ở máy (ADMIN_* trong .env.local)
npm run dev                # mở http://localhost:3000/quan-tri
```

### Bài viết (cẩm nang SEO/GEO)

CMS › Bài viết: tiêu đề, tóm tắt, ảnh bìa, nội dung Markdown (có xem trước), hỏi đáp cuối bài. Website: `/bai-viet`, `/bai-viet/<mã>` (schema BlogPosting, FAQPage, breadcrumb), sitemap và `/llms.txt` tự thêm bài. Bài còn dấu `[CẦN XÁC NHẬN]` không bật “Đăng” được. Đường dẫn bài không có bị worker.ts trả 404 trước khi tới Next.js. Code: [src/lib/markdown.ts](src/lib/markdown.ts), [src/app/(site)/bai-viet](src/app/(site)/bai-viet). Bật “Đăng” và lưu: bài lên website sau khoảng 10 phút (tự build lại, [docs/xuat-ban.md](docs/xuat-ban.md)).

### Đặt phòng trực tuyến

Trang `/dat-phong`: chọn ngày và số khách → xem phòng trống và giá từng hạng phòng → chọn số phòng → điền thông tin → trang xác nhận `/dat-phong/xac-nhan/<mã>` (không cho Google lập chỉ mục). Chưa thu tiền trên website: đặt phòng ở trạng thái **Chờ xác nhận** và giữ phòng ngay, lễ tân gọi xác nhận và thu cọc.

- **Phòng trống** = số phòng đang bán của hạng phòng trừ đặt phòng Chờ xác nhận / Đã xác nhận / Đã nhận phòng trùng đêm. Nghỉ giờ không tính. Hai khách cùng đặt phòng cuối cùng: kiểm tra lại sau khi lưu, đặt phòng làm vượt số phòng bị huỷ và khách được báo chọn lại.
- **Giá** = bảng giá của hạng phòng, cộng/trừ theo **Giá theo ngày** (Tết, cuối tuần, sự kiện…): phần trăm, ngừng bán online, số đêm tối thiểu. Nhiều quy tắc trùng đêm thì cộng dồn phần trăm.
- **Cài đặt › Thông tin khách sạn › Đặt phòng online**: bật/tắt, % cọc, số phòng và số đêm tối đa, tài khoản nhận cọc (điền đủ thì trang xác nhận hiện mã QR VietQR có sẵn số tiền và mã đặt phòng).
- Mỗi đặt phòng mới báo lễ tân qua `BOOKING_WEBHOOK_URL` ([hướng dẫn](docs/google-apps-script.md)).
- Email cho khách có điền email: đã nhận đặt phòng (đặt online), đã xác nhận (đơn chuyển sang Đã xác nhận trong CMS, trừ đơn OTA), nhắc lịch một ngày trước ngày nhận phòng (cron 8:00 và 14:00). Gửi qua Resend, cài đặt theo [docs/email-khach.md](docs/email-khach.md). Code: [src/lib/booking-emails.ts](src/lib/booking-emails.ts).
- Code: [src/lib/reservations.ts](src/lib/reservations.ts) (phòng trống, giá, tạo đơn), [src/lib/booking-api.ts](src/lib/booking-api.ts) (API), [src/components/BookingEngine.tsx](src/components/BookingEngine.tsx) (giao diện).

### Deploy

Build từ một bản checkout sạch của commit cần deploy (không lẫn thay đổi chưa commit), có `.env.local` (cần `CLOUDINARY_CLOUD_NAME` để dựng URL ảnh), rồi `npm run build:cf` và `npx opennextjs-cloudflare deploy`. `build:cf` dùng env `build` trong wrangler.jsonc: D1 đọc thẳng database thật, nên trang dựng sẵn khớp nội dung CMS (`next dev` vẫn dùng D1 giả lập ở máy). Secret trên Cloudflare: `PAYLOAD_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `BOOKING_WEBHOOK_URL`, `RESEND_API_KEY`, `DEPLOY_HOOK_URL`. Khi đã cài Workers Builds ([docs/xuat-ban.md](docs/xuat-ban.md)), deploy bằng cách đưa commit vào nhánh `production` (sau khi chạy migration); nội dung CMS tự lên website khoảng 10 phút sau khi lưu (cron gọi Deploy Hook, [src/cms/server/publish.ts](src/cms/server/publish.ts)). Đo CPU: `npx wrangler tail f21hotel --format json` (trường `cpuTime`).
