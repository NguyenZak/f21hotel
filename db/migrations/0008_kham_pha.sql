-- Trang Tiện ích xung quanh đổi đường dẫn /xung-quanh → /kham-pha (next.config.ts chuyển hướng 301 link cũ).
-- Sửa link đã lưu trong bố cục trang (Puck JSON: nút của khối Vị trí trên trang chủ), cả bản đã xuất bản lẫn bản nháp.
UPDATE pages SET data = replace(data, '"/xung-quanh', '"/kham-pha') WHERE data LIKE '%"/xung-quanh%';
UPDATE pages SET draft = replace(draft, '"/xung-quanh', '"/kham-pha') WHERE draft LIKE '%"/xung-quanh%';
