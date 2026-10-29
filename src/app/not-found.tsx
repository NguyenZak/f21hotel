import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap section-head center" style={{ marginBottom: 0 }}>
        <span className="eyebrow">Lỗi 404</span>
        <h1 style={{ color: "var(--maroon)" }}>Không tìm thấy trang</h1>
        <p>Đường dẫn có thể đã thay đổi. Quay về trang chủ hoặc gửi yêu cầu đặt phòng.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link className="btn" href="/">
            Về trang chủ
          </Link>
          <Link className="btn btn-ghost" href="/dat-phong">
            Đặt phòng
          </Link>
        </div>
      </div>
    </section>
  );
}
