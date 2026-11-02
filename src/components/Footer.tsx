import Image from "next/image";
import Link from "next/link";
import { getSite } from "@/lib/cms";
import { directionsUrl, nav } from "@/lib/site";
import { IconZalo } from "./Icons";

export async function Footer() {
  const site = await getSite();
  const { telLink, zaloLink } = site;
  const socials = [
    { label: "Facebook", href: site.social.facebook },
    { label: "TikTok", href: site.social.tiktok },
  ].filter((x) => x.href);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/img/logo-dung-trang.png" alt={site.name} width={507} height={367} />
            <p>{site.tagline}. Nghỉ yên tĩnh trong khu biệt thự Hoa Phượng, phía Tây Hà Nội.</p>
          </div>

          <div>
            <h2 className="footer-title">Khám phá</h2>
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
            <h2 className="footer-title">Liên hệ</h2>
            <ul>
              <li>
                <a href={telLink}>Hotline: {site.phoneDisplay}</a>
              </li>
              <li>
                <a className="footer-zalo" href={zaloLink} target="_blank" rel="noopener">
                  <IconZalo /> Zalo: {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${site.feedbackPhone}`}>Phản ánh dịch vụ: {site.feedbackPhoneDisplay}</a>
              </li>
              {/* Mục chưa có dữ liệu trong site.ts thì ẩn, tránh link trống hoặc sai */}
              {site.email ? (
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              ) : null}
              {socials.length ? (
                <li className="footer-social">
                  {socials.map((x) => (
                    <a key={x.label} href={x.href} target="_blank" rel="noopener">
                      {x.label}
                    </a>
                  ))}
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Địa chỉ</h2>
            <ul>
              <li>{site.address.full}</li>
              <li style={{ fontStyle: "italic" }}>{site.directions}</li>
              <li>
                <a href={directionsUrl(site.mapQuery)} target="_blank" rel="noopener">
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
