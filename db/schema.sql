-- Cấu trúc D1 của F21 Hotel (bảng do CMS Payload tạo trước đây, CMS mới dùng lại nguyên vẹn).
-- Dùng khi dựng D1 mới (máy dev mới): npx wrangler d1 execute D1 --local --file db/schema.sql
-- D1 thật trên Cloudflare đã có sẵn các bảng này; đổi cấu trúc thì thêm file db/migrations/NNNN_*.sql.
PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS `audit_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`action` text,
	`target` text,
	`doc_id` text,
	`title` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE IF NOT EXISTS `bookings` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`source` text DEFAULT 'phone' NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`nights` numeric,
	`guest_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`guests` numeric DEFAULT 2,
	`arrival_time` text,
	`promo_code` text,
	`note` text,
	`total` numeric,
	`deposit` numeric,
	`paid` numeric DEFAULT 0,
	`staff_note` text,
	`external_ref` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `bookings_items` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`room_type_id` integer NOT NULL,
	`stay_type` text DEFAULT 'fullDay' NOT NULL,
	`quantity` numeric DEFAULT 1 NOT NULL,
	`amount` numeric,
	FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `bookings_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`rooms_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rooms_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `faqs` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`order` numeric DEFAULT 0,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`prefix` text DEFAULT '',
	`_objectkey` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric
);
CREATE TABLE IF NOT EXISTS `offers` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`tag` text NOT NULL,
	`summary` text NOT NULL,
	`when` text NOT NULL,
	`code` text,
	`featured` integer DEFAULT false,
	`active` integer DEFAULT true,
	`order` numeric DEFAULT 0,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `offers_details` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`published_at` text,
	`data` text,
	`draft` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `payload_kv` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL
);
CREATE TABLE IF NOT EXISTS `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	`media_id` integer,
	`room_types_id` integer,
	`rooms_id` integer,
	`bookings_id` integer,
	`rate_rules_id` integer,
	`offers_id` integer,
	`reviews_id` integer,
	`faqs_id` integer,
	`pages_id` integer,
	`audit_logs_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`room_types_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rooms_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bookings_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rate_rules_id`) REFERENCES `rate_rules`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`offers_id`) REFERENCES `offers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviews_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faqs_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`audit_logs_id`) REFERENCES `audit_logs`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `rate_rules` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`adjust` numeric DEFAULT 0,
	`min_nights` numeric,
	`closed` integer DEFAULT false,
	`active` integer DEFAULT true,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `rate_rules_days` (
	`order` integer NOT NULL,
	`parent_id` integer NOT NULL,
	`value` text,
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `rate_rules`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `rate_rules_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`room_types_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `rate_rules`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`room_types_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`text` text NOT NULL,
	`rating` numeric DEFAULT 5 NOT NULL,
	`source` text NOT NULL,
	`date` text NOT NULL,
	`published` integer DEFAULT false,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `room_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`short` text NOT NULL,
	`description` text NOT NULL,
	`guests` numeric NOT NULL,
	`prices_hourly` numeric NOT NULL,
	`prices_overnight` numeric NOT NULL,
	`prices_full_day` numeric NOT NULL,
	`prices_extra_hour` numeric NOT NULL,
	`order` numeric DEFAULT 0,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE IF NOT EXISTS `room_types_amenities` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `room_types_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`media_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `rooms` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`floor` numeric NOT NULL,
	`room_type_id` integer NOT NULL,
	`active` integer DEFAULT true,
	`note` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE IF NOT EXISTS `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`price_from` numeric NOT NULL,
	`phone` text NOT NULL,
	`phone_display` text NOT NULL,
	`zalo` text NOT NULL,
	`feedback_phone` text,
	`feedback_phone_display` text,
	`email` text,
	`reply_hours` text,
	`social_facebook` text,
	`social_tiktok` text,
	`social_google_maps` text,
	`address_street` text NOT NULL,
	`address_locality` text NOT NULL,
	`address_region` text NOT NULL,
	`address_full` text NOT NULL,
	`directions` text NOT NULL,
	`map_query` text,
	`entrance_video` text,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`price_notes_extra_person` numeric,
	`price_notes_deposit` text,
	`price_notes_refund` text,
	`price_notes_water` text,
	`updated_at` text,
	`created_at` text
, `booking_enabled` integer DEFAULT true, `booking_deposit_percent` numeric DEFAULT 50, `booking_max_rooms` numeric DEFAULT 5, `booking_max_nights` numeric DEFAULT 30, `booking_bank_bank_id` text, `booking_bank_account_no` text, `booking_bank_account_name` text);
CREATE TABLE IF NOT EXISTS `site_settings_price_notes_long_stay` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`discount` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `theme_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`fonts_heading` text NOT NULL,
	`fonts_hero` text NOT NULL,
	`fonts_body` text NOT NULL,
	`fonts_ui` text NOT NULL,
	`updated_at` text,
	`created_at` text
);
CREATE TABLE IF NOT EXISTS `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'staff' NOT NULL,
	`active` integer DEFAULT true,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text,
	`salt` text,
	`hash` text,
	`reset_password_requested_at` text,
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text
);
CREATE TABLE IF NOT EXISTS `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `audit_logs_created_at_idx` ON `audit_logs` (`created_at`);
CREATE INDEX IF NOT EXISTS `audit_logs_updated_at_idx` ON `audit_logs` (`updated_at`);
CREATE INDEX IF NOT EXISTS `audit_logs_user_idx` ON `audit_logs` (`user_id`);
CREATE INDEX IF NOT EXISTS `bookings_check_in_idx` ON `bookings` (`check_in`);
CREATE INDEX IF NOT EXISTS `bookings_check_out_idx` ON `bookings` (`check_out`);
CREATE UNIQUE INDEX IF NOT EXISTS `bookings_code_idx` ON `bookings` (`code`);
CREATE INDEX IF NOT EXISTS `bookings_created_at_idx` ON `bookings` (`created_at`);
CREATE INDEX IF NOT EXISTS `bookings_items_order_idx` ON `bookings_items` (`_order`);
CREATE INDEX IF NOT EXISTS `bookings_items_parent_id_idx` ON `bookings_items` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `bookings_items_room_type_idx` ON `bookings_items` (`room_type_id`);
CREATE INDEX IF NOT EXISTS `bookings_phone_idx` ON `bookings` (`phone`);
CREATE INDEX IF NOT EXISTS `bookings_rels_order_idx` ON `bookings_rels` (`order`);
CREATE INDEX IF NOT EXISTS `bookings_rels_parent_idx` ON `bookings_rels` (`parent_id`);
CREATE INDEX IF NOT EXISTS `bookings_rels_path_idx` ON `bookings_rels` (`path`);
CREATE INDEX IF NOT EXISTS `bookings_rels_rooms_id_idx` ON `bookings_rels` (`rooms_id`);
CREATE INDEX IF NOT EXISTS `bookings_status_idx` ON `bookings` (`status`);
CREATE INDEX IF NOT EXISTS `bookings_updated_at_idx` ON `bookings` (`updated_at`);
CREATE INDEX IF NOT EXISTS `faqs_created_at_idx` ON `faqs` (`created_at`);
CREATE INDEX IF NOT EXISTS `faqs_updated_at_idx` ON `faqs` (`updated_at`);
CREATE INDEX IF NOT EXISTS `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX IF NOT EXISTS `media_filename_idx` ON `media` (`filename`);
CREATE INDEX IF NOT EXISTS `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX IF NOT EXISTS `offers_created_at_idx` ON `offers` (`created_at`);
CREATE INDEX IF NOT EXISTS `offers_details_order_idx` ON `offers_details` (`_order`);
CREATE INDEX IF NOT EXISTS `offers_details_parent_id_idx` ON `offers_details` (`_parent_id`);
CREATE UNIQUE INDEX IF NOT EXISTS `offers_slug_idx` ON `offers` (`slug`);
CREATE INDEX IF NOT EXISTS `offers_updated_at_idx` ON `offers` (`updated_at`);
CREATE INDEX IF NOT EXISTS `pages_created_at_idx` ON `pages` (`created_at`);
CREATE UNIQUE INDEX IF NOT EXISTS `pages_slug_idx` ON `pages` (`slug`);
CREATE INDEX IF NOT EXISTS `pages_updated_at_idx` ON `pages` (`updated_at`);
CREATE UNIQUE INDEX IF NOT EXISTS `payload_kv_key_idx` ON `payload_kv` (`key`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_audit_logs_id_idx` ON `payload_locked_documents_rels` (`audit_logs_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_bookings_id_idx` ON `payload_locked_documents_rels` (`bookings_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_faqs_id_idx` ON `payload_locked_documents_rels` (`faqs_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_offers_id_idx` ON `payload_locked_documents_rels` (`offers_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_rate_rules_id_idx` ON `payload_locked_documents_rels` (`rate_rules_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_reviews_id_idx` ON `payload_locked_documents_rels` (`reviews_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_room_types_id_idx` ON `payload_locked_documents_rels` (`room_types_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_rooms_id_idx` ON `payload_locked_documents_rels` (`rooms_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX IF NOT EXISTS `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX IF NOT EXISTS `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE INDEX IF NOT EXISTS `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX IF NOT EXISTS `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE INDEX IF NOT EXISTS `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX IF NOT EXISTS `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX IF NOT EXISTS `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX IF NOT EXISTS `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX IF NOT EXISTS `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE INDEX IF NOT EXISTS `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX IF NOT EXISTS `rate_rules_created_at_idx` ON `rate_rules` (`created_at`);
CREATE INDEX IF NOT EXISTS `rate_rules_days_order_idx` ON `rate_rules_days` (`order`);
CREATE INDEX IF NOT EXISTS `rate_rules_days_parent_idx` ON `rate_rules_days` (`parent_id`);
CREATE INDEX IF NOT EXISTS `rate_rules_rels_order_idx` ON `rate_rules_rels` (`order`);
CREATE INDEX IF NOT EXISTS `rate_rules_rels_parent_idx` ON `rate_rules_rels` (`parent_id`);
CREATE INDEX IF NOT EXISTS `rate_rules_rels_path_idx` ON `rate_rules_rels` (`path`);
CREATE INDEX IF NOT EXISTS `rate_rules_rels_room_types_id_idx` ON `rate_rules_rels` (`room_types_id`);
CREATE INDEX IF NOT EXISTS `rate_rules_updated_at_idx` ON `rate_rules` (`updated_at`);
CREATE INDEX IF NOT EXISTS `reviews_created_at_idx` ON `reviews` (`created_at`);
CREATE INDEX IF NOT EXISTS `reviews_updated_at_idx` ON `reviews` (`updated_at`);
CREATE INDEX IF NOT EXISTS `room_types_amenities_order_idx` ON `room_types_amenities` (`_order`);
CREATE INDEX IF NOT EXISTS `room_types_amenities_parent_id_idx` ON `room_types_amenities` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `room_types_created_at_idx` ON `room_types` (`created_at`);
CREATE INDEX IF NOT EXISTS `room_types_rels_media_id_idx` ON `room_types_rels` (`media_id`);
CREATE INDEX IF NOT EXISTS `room_types_rels_order_idx` ON `room_types_rels` (`order`);
CREATE INDEX IF NOT EXISTS `room_types_rels_parent_idx` ON `room_types_rels` (`parent_id`);
CREATE INDEX IF NOT EXISTS `room_types_rels_path_idx` ON `room_types_rels` (`path`);
CREATE UNIQUE INDEX IF NOT EXISTS `room_types_slug_idx` ON `room_types` (`slug`);
CREATE INDEX IF NOT EXISTS `room_types_updated_at_idx` ON `room_types` (`updated_at`);
CREATE INDEX IF NOT EXISTS `rooms_created_at_idx` ON `rooms` (`created_at`);
CREATE UNIQUE INDEX IF NOT EXISTS `rooms_number_idx` ON `rooms` (`number`);
CREATE INDEX IF NOT EXISTS `rooms_room_type_idx` ON `rooms` (`room_type_id`);
CREATE INDEX IF NOT EXISTS `rooms_updated_at_idx` ON `rooms` (`updated_at`);
CREATE INDEX IF NOT EXISTS `site_settings_price_notes_long_stay_order_idx` ON `site_settings_price_notes_long_stay` (`_order`);
CREATE INDEX IF NOT EXISTS `site_settings_price_notes_long_stay_parent_id_idx` ON `site_settings_price_notes_long_stay` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_idx` ON `users` (`email`);
CREATE INDEX IF NOT EXISTS `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX IF NOT EXISTS `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE INDEX IF NOT EXISTS `users_updated_at_idx` ON `users` (`updated_at`);
PRAGMA foreign_keys = ON;
