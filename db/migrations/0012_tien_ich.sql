-- Trang Tiện ích xung quanh đổi đường dẫn /kham-pha → /tien-ich (next.config.ts chuyển hướng 301 link cũ).
-- Sửa link đã lưu trong nội dung: bố cục trang (Puck JSON, cả bản nháp), bài viết, giới thiệu địa điểm.
UPDATE pages SET data = replace(data, '/kham-pha', '/tien-ich') WHERE instr(data, '/kham-pha') > 0;
UPDATE pages SET draft = replace(draft, '/kham-pha', '/tien-ich') WHERE instr(draft, '/kham-pha') > 0;
UPDATE posts SET body = replace(body, '/kham-pha', '/tien-ich') WHERE instr(body, '/kham-pha') > 0;
UPDATE posts SET excerpt = replace(excerpt, '/kham-pha', '/tien-ich') WHERE instr(excerpt, '/kham-pha') > 0;
UPDATE places SET body = replace(body, '/kham-pha', '/tien-ich') WHERE instr(body, '/kham-pha') > 0;
