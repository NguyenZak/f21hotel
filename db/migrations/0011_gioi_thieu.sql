-- Trang Giới thiệu (/gioi-thieu) trong CMS › Trang. data để trống: website dùng bố cục mặc định
-- (defaultAbout trong src/blocks/home.ts) cho tới khi chủ khách sạn bấm Xuất bản trong trình dựng.
INSERT INTO pages (title, slug)
SELECT 'Giới thiệu', 'gioi-thieu'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'gioi-thieu');
