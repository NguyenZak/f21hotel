# Email gửi khách: xác nhận và nhắc lịch

Khách có điền email nhận 3 loại email (code: `src/lib/booking-emails.ts`):

| Email | Khi nào gửi |
|---|---|
| Đã nhận đặt phòng | Ngay khi khách đặt online. Có mã QR đặt cọc nếu CMS đã nhập tài khoản nhận cọc |
| Đặt phòng đã xác nhận | Khi lễ tân chuyển đơn sang **Đã xác nhận** trong CMS. Không tự gửi cho đơn Agoda, Booking.com, Traveloka, Trip.com, Expedia vì OTA đã gửi rồi |
| Nhắc ngày nhận phòng | 8:00 sáng, một ngày trước ngày nhận phòng, cho đơn Chờ xác nhận hoặc Đã xác nhận. Lần chạy 14:00 gửi lại đơn bị lỗi lúc sáng |

Trong CMS › Đặt phòng › mở đơn, thẻ **Email cho khách** cho xem các email đã gửi (gửi được hay lỗi). Hai nút trên thẻ gửi lại email xác nhận hoặc email nhắc lịch.

## Cài đặt (làm một lần)

Email gửi qua [Resend](https://resend.com). Gói miễn phí gửi được 3.000 email/tháng, tối đa 100 email/ngày, đủ cho 19 phòng.
Không dùng Email Sending của Cloudflare vì gửi tới địa chỉ bất kỳ cần gói Workers Paid.

1. Tạo tài khoản Resend bằng email của khách sạn.
2. Resend › **Domains** › Add domain: nhập `f21hotel.com.vn`, chọn vùng Tokyo (ap-northeast-1). Resend có nút tự thêm bản ghi DNS vào Cloudflare.
   Nếu thêm tay thì vào Cloudflare › DNS và tạo đúng các bản ghi Resend liệt kê (TXT `resend._domainkey`, MX và TXT của `send`).
   Chọn **DNS only** (đám mây xám) cho các bản ghi này. Chờ Resend báo **Verified**.
3. Resend › **API Keys** › Create: quyền **Sending access**, chỉ cho domain `f21hotel.com.vn`. Chép khoá ra (Resend chỉ hiện một lần).
4. Đặt khoá lên Cloudflare: `npx wrangler secret put RESEND_API_KEY` rồi dán khoá. Không dán khoá vào chat hay vào code.
5. Tạo bảng lịch sử email trên D1 thật, **trước** khi deploy code:
   `npx wrangler d1 execute D1 --remote --file db/migrations/0003_booking_emails.sql`
6. Deploy như thường lệ (README › Deploy). Cron chạy theo `triggers` trong wrangler.jsonc.
7. Thử: đặt một phòng trên website bằng email của mình, kiểm tra hộp thư (cả mục Spam), rồi huỷ đơn thử trong CMS.

Email gửi từ `F21 Hotel <datphong@f21hotel.com.vn>`. Đổi địa chỉ gửi thì đặt biến `EMAIL_FROM` (cùng tên miền đã xác minh).
Khách bấm Trả lời thì thư về email khách sạn trong CMS › Cài đặt › Thông tin khách sạn (ô Email).
Chưa đặt `RESEND_API_KEY` thì website vẫn chạy bình thường, chỉ không gửi email.

## Kiểm tra khi khách báo không nhận được email

- CMS › mở đơn › thẻ Email cho khách: dòng **Lỗi** có ghi lý do. Thường gặp: gõ sai email, hết hạn mức 100 email/ngày, domain chưa xác minh.
- Resend › **Emails**: trạng thái từng email (delivered, bounced…).
- Log của worker: `npx wrangler tail f21hotel`, tìm `[email]`.
