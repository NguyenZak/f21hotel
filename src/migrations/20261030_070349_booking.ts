import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`bookings_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`room_type_id\` integer NOT NULL,
  	\`stay_type\` text DEFAULT 'fullDay' NOT NULL,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	\`amount\` numeric,
  	FOREIGN KEY (\`room_type_id\`) REFERENCES \`room_types\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_items_order_idx\` ON \`bookings_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`bookings_items_parent_id_idx\` ON \`bookings_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_items_room_type_idx\` ON \`bookings_items\` (\`room_type_id\`);`)
  await db.run(sql`CREATE TABLE \`bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`source\` text DEFAULT 'phone' NOT NULL,
  	\`check_in\` text NOT NULL,
  	\`check_out\` text NOT NULL,
  	\`nights\` numeric,
  	\`guest_name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`email\` text,
  	\`guests\` numeric DEFAULT 2,
  	\`arrival_time\` text,
  	\`promo_code\` text,
  	\`note\` text,
  	\`total\` numeric,
  	\`deposit\` numeric,
  	\`paid\` numeric DEFAULT 0,
  	\`staff_note\` text,
  	\`external_ref\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`bookings_code_idx\` ON \`bookings\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`bookings_status_idx\` ON \`bookings\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`bookings_check_in_idx\` ON \`bookings\` (\`check_in\`);`)
  await db.run(sql`CREATE INDEX \`bookings_check_out_idx\` ON \`bookings\` (\`check_out\`);`)
  await db.run(sql`CREATE INDEX \`bookings_phone_idx\` ON \`bookings\` (\`phone\`);`)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`bookings_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rooms_id\`) REFERENCES \`rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_rels_order_idx\` ON \`bookings_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`bookings_rels_parent_idx\` ON \`bookings_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`bookings_rels_path_idx\` ON \`bookings_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`bookings_rels_rooms_id_idx\` ON \`bookings_rels\` (\`rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`rate_rules_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`rate_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rate_rules_days_order_idx\` ON \`rate_rules_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`rate_rules_days_parent_idx\` ON \`rate_rules_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`rate_rules\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`from\` text NOT NULL,
  	\`to\` text NOT NULL,
  	\`adjust\` numeric DEFAULT 0,
  	\`min_nights\` numeric,
  	\`closed\` integer DEFAULT false,
  	\`active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`rate_rules_updated_at_idx\` ON \`rate_rules\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rate_rules_created_at_idx\` ON \`rate_rules\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`rate_rules_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`room_types_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`rate_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`room_types_id\`) REFERENCES \`room_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`rate_rules_rels_order_idx\` ON \`rate_rules_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`rate_rules_rels_parent_idx\` ON \`rate_rules_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`rate_rules_rels_path_idx\` ON \`rate_rules_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`rate_rules_rels_room_types_id_idx\` ON \`rate_rules_rels\` (\`room_types_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`bookings_id\` integer REFERENCES bookings(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`rate_rules_id\` integer REFERENCES rate_rules(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rate_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`rate_rules_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_deposit_percent\` numeric DEFAULT 50;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_max_rooms\` numeric DEFAULT 5;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_max_nights\` numeric DEFAULT 30;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_bank_bank_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_bank_account_no\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`booking_bank_account_name\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`bookings_items\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`DROP TABLE \`bookings_rels\`;`)
  await db.run(sql`DROP TABLE \`rate_rules_days\`;`)
  await db.run(sql`DROP TABLE \`rate_rules\`;`)
  await db.run(sql`DROP TABLE \`rate_rules_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`room_types_id\` integer,
  	\`rooms_id\` integer,
  	\`offers_id\` integer,
  	\`reviews_id\` integer,
  	\`faqs_id\` integer,
  	\`pages_id\` integer,
  	\`audit_logs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`room_types_id\`) REFERENCES \`room_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rooms_id\`) REFERENCES \`rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`offers_id\`) REFERENCES \`offers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audit_logs_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "room_types_id", "rooms_id", "offers_id", "reviews_id", "faqs_id", "pages_id", "audit_logs_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "room_types_id", "rooms_id", "offers_id", "reviews_id", "faqs_id", "pages_id", "audit_logs_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_room_types_id_idx\` ON \`payload_locked_documents_rels\` (\`room_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rooms_id_idx\` ON \`payload_locked_documents_rels\` (\`rooms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_offers_id_idx\` ON \`payload_locked_documents_rels\` (\`offers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_logs_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_enabled\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_deposit_percent\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_max_rooms\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_max_nights\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_bank_bank_id\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_bank_account_no\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`booking_bank_account_name\`;`)
}
