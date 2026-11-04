# Quy trình nội bộ: dữ liệu cá nhân của khách

Dành cho chủ khách sạn, quản lý và lễ tân. Đi kèm trang công khai `/chinh-sach-bao-mat` (src/app/(site)/chinh-sach-bao-mat/page.tsx).
Căn cứ: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, Nghị định 356/2025/NĐ-CP. Bản nháp từ rà soát 02/11/2026, cần luật sư duyệt.

## Dữ liệu đang có ở đâu

| Dữ liệu | Nơi lưu | Ai xem được |
|---|---|---|
| Đơn đặt phòng online (họ tên, SĐT, email, ngày ở, ghi chú, thời điểm đồng ý, có nhận ưu đãi không) | Cloudflare D1 `f21-hotel-cms`, vùng APAC | Tài khoản CMS được phân quyền |
| Email gửi khách (đã nhận, xác nhận, nhắc lịch): địa chỉ email, họ tên, chi tiết đơn | Resend (Hoa Kỳ) gửi đi; lịch sử gửi lưu ở bảng `booking_emails` trong D1, xoá cùng đơn | Tài khoản CMS được phân quyền |
| Yêu cầu đặt phòng / báo giá đoàn từ form | Không lưu trên website. Gửi tới lễ tân qua webhook (nếu bật `BOOKING_WEBHOOK_URL`) hoặc khách tự gửi qua Zalo | Lễ tân |
| Tin nhắn Zalo, cuộc gọi | Zalo / điện thoại của khách sạn | Lễ tân |

Bật webhook gửi đơn sang Google Sheets thì phải thêm Google vào mục 4 của trang chính sách trước.

## Gửi khuyến mại

- Chỉ nhắn ưu đãi cho khách có dòng **"Nhận ưu đãi qua Zalo/SMS: Khách đồng ý"** trong CMS › Đặt phòng.
- Khách nhắn ngừng nhận: xoá khỏi danh sách Zalo ngay, ghi vào ghi chú nội bộ của đơn.

## Khách yêu cầu xem, sửa, xoá dữ liệu

1. Đối chiếu số điện thoại hoặc mã đặt phòng để chắc là chính chủ.
2. Trả lời "đã nhận yêu cầu" trong **2 ngày làm việc**.
3. Hoàn thành trong: xem/sửa/cung cấp **10 ngày**; rút đồng ý, hạn chế, phản đối xử lý **15 ngày**; xoá **20 ngày**.
4. Xoá đơn: CMS › Đặt phòng › mở đơn › Xoá. Thông tin còn phải giữ cho kế toán, thuế (hoá đơn) thì giữ phần đó, báo cho khách biết.

## Định kỳ

- Mỗi quý: xoá đơn đã trả phòng quá **24 tháng** (thời hạn ghi trong chính sách).
- Khi nghỉ việc: khoá tài khoản CMS của nhân viên ngay trong ngày (CMS › Cài đặt › Tài khoản).

## Khi nghi lộ hoặc mất dữ liệu

1. Khoá tài khoản CMS liên quan, đổi mật khẩu, báo người quản trị website.
2. Ghi lại: phát hiện lúc nào, dữ liệu gì, bao nhiêu khách, nguyên nhân sơ bộ.
3. Báo cơ quan chuyên trách bảo vệ dữ liệu cá nhân (Bộ Công an) **chậm nhất 72 giờ** từ khi phát hiện, theo Mẫu 08 của Nghị định 356/2025.
4. Báo cho khách bị ảnh hưởng nếu sự cố có thể gây hại cho họ.
