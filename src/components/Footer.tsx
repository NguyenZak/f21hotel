import Image from "next/image";
import Link from "next/link";
import { nav, site, telLink, zaloLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/img/logo-dung-trang.png" alt={site.name} width={507} height={367} />
            <p>{site.tagline}. Nghỉ yên tĩnh trong khu biệt thự Hoa Phượng, phía Tây Hà Nội.</p>
          </div>

          <div>
            <h4>Khám phá</h4>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/dat-phong#chinh-sach">Chính sách</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Liên hệ</h4>
            <ul>
              <li>
                <a href={telLink}>Hotline: {site.phoneDisplay}</a>
              </li>
              <li>
                <a href={zaloLink} target="_blank" rel="noopener">
                  Zalo: {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${site.feedbackPhone}`}>Phản ánh dịch vụ: {site.feedbackPhoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener">
                  Facebook
                </a>{" "}
                ·{" "}
                <a href={site.social.tiktok} target="_blank" rel="noopener">
                  TikTok
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Địa chỉ</h4>
            <ul>
              <li>{site.address.full}</li>
              <li style={{ fontStyle: "italic" }}>{site.directions}</li>
              <li>
                <a href={site.social.googleMaps} target="_blank" rel="noopener">
                  Chỉ đường trên Google Maps →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {site.name}. Bảo lưu mọi quyền.</span>
        <span>
          Ngày đêm: nhận {site.checkIn}, trả {site.checkOut} · Qua đêm: nhận 19:00, trả 10:00
        </span>
      </div>
    </footer>
  );
}
