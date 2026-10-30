"use client";

import { useDocumentInfo } from "@payloadcms/ui";

// Nút trên trang sửa của collection Trang: mở trình dựng kéo thả
export function OpenEditor() {
  const { id } = useDocumentInfo();
  if (!id) return <p style={{ marginBottom: 24 }}>Lưu trang lần đầu rồi mở trình dựng để thiết kế nội dung.</p>;
  return (
    <div style={{ marginBottom: 24 }}>
      <a className="btn btn--style-primary btn--size-medium" href={`/editor/${id}`} style={{ textDecoration: "none" }}>
        Mở trình dựng trang
      </a>
    </div>
  );
}
