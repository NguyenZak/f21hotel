-- Tăng chuyển đổi đặt phòng: điểm đánh giá, thông tin phòng, giảm giá đặt trực tiếp / mã ưu đãi / ở dài ngày,
-- đổi huỷ miễn phí. Chỉ thêm cột, không đổi dữ liệu cũ (trừ mức giảm ở dài ngày, điền theo bảng giá hiện có).
-- Chạy TRƯỚC khi deploy code đọc các cột này:
--   npx wrangler d1 execute D1 --local --file db/migrations/0001_conversion.sql
--   CLOUDFLARE_ENV=remote npx wrangler d1 execute D1 --remote --file db/migrations/0001_conversion.sql
ALTER TABLE `site_settings` ADD `rating_score` numeric;
ALTER TABLE `site_settings` ADD `rating_count` numeric;
ALTER TABLE `site_settings` ADD `rating_source` text;
ALTER TABLE `site_settings` ADD `rating_url` text;
ALTER TABLE `site_settings` ADD `booking_direct_discount` numeric DEFAULT 0;
ALTER TABLE `site_settings` ADD `booking_free_cancel_days` numeric DEFAULT 0;
ALTER TABLE `site_settings_price_notes_long_stay` ADD `min_nights` numeric;
ALTER TABLE `site_settings_price_notes_long_stay` ADD `percent` numeric;
ALTER TABLE `room_types` ADD `area` numeric;
ALTER TABLE `room_types` ADD `bed` text;
ALTER TABLE `room_types` ADD `view` text;
ALTER TABLE `offers` ADD `discount_percent` numeric;

-- Bảng giá đang ghi: trên 7 ngày giảm 5%, trên 15 ngày giảm 10%, trên 30 ngày giảm 15%
UPDATE `site_settings_price_notes_long_stay` SET `min_nights` = 7, `percent` = 5 WHERE `label` LIKE '%7 ngày%' AND `min_nights` IS NULL;
UPDATE `site_settings_price_notes_long_stay` SET `min_nights` = 15, `percent` = 10 WHERE `label` LIKE '%15 ngày%' AND `min_nights` IS NULL;
UPDATE `site_settings_price_notes_long_stay` SET `min_nights` = 30, `percent` = 15 WHERE `label` LIKE '%30 ngày%' AND `min_nights` IS NULL;
