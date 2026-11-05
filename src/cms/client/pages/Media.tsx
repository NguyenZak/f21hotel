"use client";

import { Finder } from "../Finder";

// Thư viện ảnh: giao diện kiểu Finder (Finder.tsx). Tải ảnh lên Cloudinary, xếp vào thư mục, sửa mô tả, xoá ảnh không còn dùng
export function MediaPage() {
  return (
    <>
      <div className="c-page__head">
        <div>
          <h1>Thư viện ảnh</h1>
          <p>
            Ảnh lưu trên Cloudinary, tự nén cho nhẹ. Kéo ảnh từ máy tính vào để tải lên, kéo ảnh thả vào thư mục để xếp gọn. Nhấp chuột phải để xem thêm
            thao tác, phím cách để xem nhanh.
          </p>
        </div>
      </div>
      <Finder />
    </>
  );
}
