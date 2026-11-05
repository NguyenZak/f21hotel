-- Thư mục cho Thư viện ảnh (CMS › Thư viện ảnh, giao diện kiểu Finder). Thư mục chỉ nằm trong D1 để xếp ảnh cho gọn:
-- ảnh trên Cloudinary không đổi chỗ, đường dẫn ảnh đang dùng trên website giữ nguyên. Chỉ thêm bảng và cột.
--   npx wrangler d1 execute D1 --local --file db/migrations/0009_media_folders.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0009_media_folders.sql
CREATE TABLE IF NOT EXISTS `media_folders` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parent_id` integer REFERENCES `media_folders`(`id`) ON DELETE SET NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE INDEX IF NOT EXISTS `media_folders_parent_idx` ON `media_folders` (`parent_id`);
ALTER TABLE `media` ADD `folder_id` integer REFERENCES `media_folders`(`id`) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS `media_folder_idx` ON `media` (`folder_id`);
