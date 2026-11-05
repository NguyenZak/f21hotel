-- Đổi nhãn "Xung quanh F21" thành "Tiện ích F21" trong dữ liệu trang (khối trên trang chủ)
UPDATE pages SET data = replace(data, 'Xung quanh F21', 'Tiện ích F21') WHERE instr(data, 'Xung quanh F21') > 0;
UPDATE pages SET draft = replace(draft, 'Xung quanh F21', 'Tiện ích F21') WHERE instr(draft, 'Xung quanh F21') > 0;
