# F21 Hotel – Website

Website đặt phòng trực tiếp cho F21 Hotel, khu biệt thự Hoa Phượng, An Khánh, Hà Nội.

- Next.js 16 (App Router, Cache Components) + TypeScript
- Chạy trên Cloudflare Workers qua [OpenNext](https://opennext.js.org/cloudflare)
- Font: SVN-Audrey (tiêu đề) và Lora (nội dung), màu theo Cẩm nang thương hiệu

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

## Lưu ý về font SVN-Audrey

Font không có các ký tự `< > @ _ \` { | } ~ © ® ° ² · × – — • … € ™`. Những ký tự này được loại khỏi `unicode-range` trong [src/app/layout.tsx](src/app/layout.tsx) để trình duyệt tự lấy từ font dự phòng, tránh hiện ô trống.
