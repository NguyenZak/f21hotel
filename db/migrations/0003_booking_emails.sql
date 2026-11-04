-- Email gửi khách: đã nhận đặt phòng, đã xác nhận, nhắc trước ngày nhận phòng (src/lib/booking-emails.ts).
-- Mỗi lần gửi (thành công hay lỗi) là một dòng: CMS hiện lịch sử trong đơn, cron nhắc lịch không gửi trùng.
-- Xoá đặt phòng thì xoá luôn lịch sử email của đơn đó. Chỉ thêm bảng, không đổi dữ liệu cũ.
-- Chạy TRƯỚC khi deploy code gửi email:
--   npx wrangler d1 execute D1 --local --file db/migrations/0003_booking_emails.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0003_booking_emails.sql
CREATE TABLE IF NOT EXISTS `booking_emails` (
	`id` integer PRIMARY KEY NOT NULL,
	`booking_id` integer NOT NULL,
	`kind` text NOT NULL,
	`recipient` text NOT NULL,
	`status` text NOT NULL,
	`message_id` text,
	`error` text,
	`user_id` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX IF NOT EXISTS `booking_emails_booking_idx` ON `booking_emails` (`booking_id`);
