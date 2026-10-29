# Nhận yêu cầu đặt phòng vào Google Sheet và email

Form trên website gửi mỗi yêu cầu tới một URL Google Apps Script. Script ghi một dòng vào Google Sheet và email cho lễ tân. Chi phí: 0đ.

## 1. Tạo Sheet và script

1. Đăng nhập Gmail của khách sạn, tạo Google Sheet mới tên `F21 – Đặt phòng website`.
2. Menu **Tiện ích mở rộng → Apps Script**, xoá code mẫu, dán đoạn dưới đây.
3. Sửa `EMAIL_LE_TAN` và `SECRET` (một chuỗi ngẫu nhiên tự đặt).

```js
const EMAIL_LE_TAN = "datphong@f21hotel.com";
const SECRET = "doi-chuoi-nay";

const COLUMNS = [
  "submittedAt", "kind", "name", "phone", "checkIn", "checkOut", "nights",
  "guests", "room", "roomCount", "code", "company", "groupType", "invoice", "note",
];

function doPost(e) {
  if (e.parameter.key !== SECRET) {
    return ContentService.createTextOutput("forbidden");
  }
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow([...COLUMNS, "Trạng thái"]);
  sheet.appendRow([...COLUMNS.map((c) => data[c] ?? ""), "Mới"]);

  MailApp.sendEmail({
    to: EMAIL_LE_TAN,
    subject: `[F21] ${data.kind === "group" ? "Báo giá đoàn" : "Đặt phòng"}: ${data.name} – ${data.checkIn}`,
    body: data.summary,
  });
  return ContentService.createTextOutput("ok");
}
```

## 2. Xuất bản

1. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**.
2. Thực thi với tư cách: **Tôi**. Người có quyền truy cập: **Bất kỳ ai**.
3. Cấp quyền khi được hỏi, sao chép URL kết thúc bằng `/exec`.

## 3. Gắn vào website

URL đầy đủ có dạng `https://script.google.com/macros/s/.../exec?key=doi-chuoi-nay`.

- Chạy ở máy: ghi vào file `.dev.vars`

  ```
  BOOKING_WEBHOOK_URL=https://script.google.com/macros/s/.../exec?key=doi-chuoi-nay
  ```

- Trên Cloudflare:

  ```sh
  npx wrangler secret put BOOKING_WEBHOOK_URL
  ```

Khi chưa đặt biến này, form vẫn hoạt động: khách thấy nội dung đã soạn sẵn và bấm “Gửi qua Zalo” để chuyển cho lễ tân.
