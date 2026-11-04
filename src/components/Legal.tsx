import type { SiteData } from "@/lib/cms";

// Ngày cập nhật Chính sách bảo vệ dữ liệu cá nhân và Điều khoản đặt phòng. Sửa nội dung hai trang thì đổi ngày này.
export const LEGAL_UPDATED = "03/11/2026";

// Thông tin chủ website bắt buộc công bố (Luật TMĐT 122/2025 Điều 11), lấy từ CMS › Thông tin khách sạn.
// Mục nào CMS chưa điền thì ẩn, không hiện chỗ trống.
export function LegalOwner({ site }: { site: SiteData }) {
  const { legal } = site;
  const rows: [string, React.ReactNode][] = [
    ["Chủ sở hữu", legal.name || site.name],
    ["Địa chỉ", site.address.full],
    ["Mã số thuế", legal.taxCode],
    ["Đăng ký kinh doanh", legal.businessReg],
    ["Hotline", <a key="tel" href={site.telLink}>{site.phoneDisplay}</a>],
    ["Phản ánh dịch vụ", site.feedbackPhone ? <a key="fb" href={`tel:${site.feedbackPhone}`}>{site.feedbackPhoneDisplay}</a> : ""],
    ["Email", site.email ? <a key="mail" href={`mailto:${site.email}`}>{site.email}</a> : ""],
  ];
  return (
    <dl className="legal-owner">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
    </dl>
  );
}
