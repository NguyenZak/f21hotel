-- Tiện ích xung quanh (CMS › Tiện ích xung quanh): quán ăn, chỗ vui chơi, sân thể thao, siêu thị… quanh F21.
-- Hiện thành lưới ảnh ở trang Vị trí và khối "Xung quanh F21" của trình dựng trang. Ảnh lấy từ Thư viện ảnh
-- (places_rels path "photo"). Chỉ thêm bảng, không đổi dữ liệu cũ.
-- Chạy TRƯỚC khi deploy code đọc các bảng này:
--   npx wrangler d1 execute D1 --local --file db/migrations/0005_places.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0005_places.sql
CREATE TABLE IF NOT EXISTS `places` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`time` text,
	`note` text,
	`map_query` text,
	`order` numeric,
	`published` integer DEFAULT true,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `places_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`media_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `places_rels_parent_idx` ON `places_rels` (`parent_id`);
