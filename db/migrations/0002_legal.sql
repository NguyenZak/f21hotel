-- Tuân thủ pháp luật (rà soát 02/11/2026): thông tin doanh nghiệp bắt buộc công bố (Luật TMĐT 122/2025 Điều 11),
-- ghi chú VAT cạnh bảng giá, link xác nhận thông báo Bộ Công Thương, và lưu sự đồng ý của khách khi đặt phòng
-- (Luật Bảo vệ dữ liệu cá nhân 91/2025: đồng ý theo từng mục đích, kiểm chứng được). Chỉ thêm cột, không đổi dữ liệu cũ.
-- Chạy TRƯỚC khi deploy code đọc/ghi các cột này:
--   npx wrangler d1 execute D1 --local --file db/migrations/0002_legal.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0002_legal.sql
ALTER TABLE `site_settings` ADD `legal_name` text;
ALTER TABLE `site_settings` ADD `tax_code` text;
ALTER TABLE `site_settings` ADD `business_reg` text;
ALTER TABLE `site_settings` ADD `moit_url` text;
ALTER TABLE `site_settings` ADD `price_notes_vat` text;
-- Thời điểm khách đồng ý xử lý dữ liệu cá nhân (bắt buộc khi đặt online) và có đồng ý nhận ưu đãi không (tuỳ chọn)
ALTER TABLE `bookings` ADD `data_consent_at` text;
ALTER TABLE `bookings` ADD `marketing_consent` integer DEFAULT 0;
