-- Bài viết (cẩm nang) cho SEO/GEO: /bai-viet và /bai-viet/<slug>, soạn trong CMS › Bài viết.
-- Nội dung viết bằng Markdown (src/lib/markdown.ts). Ảnh bìa lấy từ Thư viện ảnh (posts_rels path "cover"),
-- phần hỏi đáp cuối bài ở posts_faqs (website gắn schema FAQPage). Chỉ thêm bảng, không đổi dữ liệu cũ.
-- Chạy TRƯỚC khi deploy code đọc các bảng này:
--   npx wrangler d1 execute D1 --local --file db/migrations/0004_posts.sql
--   npx wrangler d1 execute D1 --remote --file db/migrations/0004_posts.sql
CREATE TABLE IF NOT EXISTS `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`topic` text,
	`published` integer DEFAULT false,
	`published_at` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `posts_slug_idx` ON `posts` (`slug`);
CREATE TABLE IF NOT EXISTS `posts_faqs` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `posts_faqs_parent_id_idx` ON `posts_faqs` (`_parent_id`);
CREATE TABLE IF NOT EXISTS `posts_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`media_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `posts_rels_parent_idx` ON `posts_rels` (`parent_id`);
