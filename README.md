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

## CMS (nhánh `cms`, đang làm)

Trang quản trị: `/admin` (tiếng Việt). Dựng bằng [Payload CMS 3](https://payloadcms.com) chạy chung trong dự án Next.js này.

- **Dữ liệu:** Cloudflare D1. Chạy ở máy thì wrangler tự giả lập, không cần tạo gì trên Cloudflare.
- **Ảnh:** Cloudinary, qua bộ kết nối tự viết ở [src/payload/cloudinary.ts](src/payload/cloudinary.ts) (gọi REST API bằng `fetch`, chạy được trên Workers). Chưa khai báo `CLOUDINARY_*` thì bản dev lưu ảnh vào `media-uploads/`.
- **Vai trò:** Chủ, Quản lý, Nhân viên. Bảng quyền ở [src/payload/access.ts](src/payload/access.ts). Không có form tự đăng ký: tài khoản Chủ đầu tiên tạo bằng `npm run create-admin` (CMS thật: `create-admin:remote`, đọc ADMIN_EMAIL/ADMIN_NAME/ADMIN_PASSWORD trong `.env.local`); các tài khoản sau do Chủ tạo trong CMS › Hệ thống › Tài khoản.
- **Nhật ký thao tác:** mọi thêm, sửa, xoá đều ghi lại người thực hiện ([src/payload/audit.ts](src/payload/audit.ts)).
- **Bảng dữ liệu:** Tài khoản, Thư viện ảnh, Hạng phòng, Danh sách phòng, Ưu đãi, Đánh giá, Hỏi đáp, Trang, Nhật ký; cài đặt chung: Thông tin khách sạn, Giao diện (font).

### Trình dựng trang (kéo thả)

CMS › Nội dung › Trang › chọn trang › **Mở trình dựng trang** (đường dẫn `/editor/<id>`, chỉ Chủ và Quản lý). Dựng bằng [Puck](https://puckeditor.com).

- **Lưu nháp** chỉ lưu bản đang sửa, website chưa đổi. **Xuất bản** mới đưa lên website và làm mới trang ngay.
- Trang chủ là trang có mã `home`. Chưa xuất bản lần nào thì trang chủ dùng bố cục mặc định ở [src/blocks/home.ts](src/blocks/home.ts).
- Các khối ở [src/blocks/](src/blocks/): `render.tsx` (giao diện, dùng chung cho website và khung xem trước), `editor-config.tsx` (trường chỉnh sửa, giá trị mặc định), `config.ts` (bản chỉ hiển thị). Khối Phòng, Ưu đãi, Đánh giá, Hỏi đáp tự lấy dữ liệu từ các bảng tương ứng; thêm khối mới thì khai báo ở cả ba file.

### Chạy ở máy

```sh
npm install
# .env.local: PAYLOAD_SECRET (bắt buộc), SEED_PASSWORD (tuỳ chọn), CLOUDINARY_* (tuỳ chọn)
npm run seed     # nạp dữ liệu từ src/lib/site.ts vào CMS; có SEED_PASSWORD thì tạo thêm 3 tài khoản thử nghiệm *@f21.test
npm run dev      # mở http://localhost:3000/admin
npm run sync-media  # sau khi mới khai báo CLOUDINARY_*: đẩy ảnh đã tải trước đó (media-uploads/) lên Cloudinary
```

Sau khi sửa bảng dữ liệu: `npx payload migrate:create <ten>`, `npm run migrate`, `npm run generate:types` và `npm run generate:importmap`. Bản dev không tự đồng bộ cấu trúc dữ liệu (`push: false`), luôn đi qua migration như D1 thật; lấy code mới về thì chạy `npm run migrate`.

### Đặt phòng trực tuyến

Trang `/dat-phong` là luồng đặt phòng kiểu các trang đặt phòng: chọn ngày và số khách → xem phòng trống, giá từng hạng phòng (Ngày đêm; Qua đêm khi ở 1 đêm) → chọn số phòng → điền thông tin → trang xác nhận `/dat-phong/xac-nhan/<mã>` (không cho Google lập chỉ mục). Chưa thu tiền trên website: đặt phòng ở trạng thái **Chờ xác nhận** và giữ phòng ngay, lễ tân gọi xác nhận và thu cọc.

- **Phòng trống** = số phòng đang bán của hạng phòng (Danh sách phòng) trừ đặt phòng Chờ xác nhận / Đã xác nhận / Đã nhận phòng trùng đêm. Nghỉ giờ không tính. Hai khách cùng đặt phòng cuối cùng: kiểm tra lại sau khi lưu, đặt phòng làm vượt số phòng bị huỷ và khách được báo chọn lại.
- **Giá** = bảng giá của hạng phòng, cộng/trừ theo **Phòng & giá › Giá theo ngày** (Tết, cuối tuần, sự kiện…): phần trăm, ngừng bán online, số đêm tối thiểu. Nhiều quy tắc trùng đêm thì cộng dồn phần trăm.
- **CMS › Đặt phòng**: lễ tân nhập đặt phòng qua điện thoại, Zalo, OTA; gán số phòng (chặn gán trùng phòng, sai hạng phòng); đổi trạng thái, ghi tiền đã thu.
- **Cài đặt › Thông tin khách sạn › Đặt phòng online**: bật/tắt (tắt thì quay về form gửi yêu cầu), % cọc, số phòng và số đêm tối đa, tài khoản nhận cọc (điền đủ thì trang xác nhận hiện mã QR VietQR có sẵn số tiền và mã đặt phòng).
- Mỗi đặt phòng mới báo lễ tân qua `BOOKING_WEBHOOK_URL` ([hướng dẫn](docs/google-apps-script.md)).
- Code: [src/lib/reservations.ts](src/lib/reservations.ts) (phòng trống, giá), [src/app/(site)/dat-phong/actions.ts](src/app/(site)/dat-phong/actions.ts) (tìm phòng, tạo đặt phòng), [src/components/BookingEngine.tsx](src/components/BookingEngine.tsx) (giao diện), [src/payload/collections/Bookings.ts](src/payload/collections/Bookings.ts) (bảng dữ liệu).

### Lưu ý khi nâng cấp Payload
Ba file trong `src/app/(payload)/` do Payload tạo ra đã được sửa thêm `await connection()` (và `export const instant = false` ở trang admin) để chạy với Cache Components của Next.js 16. Nếu Payload tạo lại các file này thì phải thêm lại.
