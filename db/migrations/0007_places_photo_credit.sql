-- Ghi công ảnh cho Tiện ích xung quanh: ảnh giấy phép mở (Wikimedia Commons, Flickr CC BY/BY-SA) phải ghi tác giả và giấy phép.
-- Website hiện dòng "Ảnh: …" dưới lưới ảnh và dưới ảnh ở trang chi tiết. Chỉ thêm cột.
--   npx wrangler d1 execute D1 --local --file db/migrations/0007_places_photo_credit.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0007_places_photo_credit.sql
ALTER TABLE `places` ADD `photo_credit` text;
ALTER TABLE `places` ADD `photo_source` text;
