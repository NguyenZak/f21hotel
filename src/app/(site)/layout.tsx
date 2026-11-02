import type { Metadata, Viewport } from "next";
import { ContactBar } from "@/components/ContactBar";
import { FloatContact } from "@/components/FloatContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { motionBootScript } from "@/lib/motion";
import { getRooms, getSite, getThemeFonts } from "@/lib/cms";
import { hotelJsonLd, JsonLd, OG_IMAGES, ogImageMeta, websiteJsonLd } from "@/lib/seo";
import { fontRoleStyle, fontVariables } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const og = ogImageMeta(OG_IMAGES.home);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} – Khách sạn An Khánh, gần SVĐ Mỹ Đình`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      // Trang nào không khai báo ảnh riêng (pageMeta) thì dùng ảnh mặt tiền
      images: og.images,
    },
    twitter: og.twitter,
    // Cho Google hiện ảnh lớn ở kết quả tìm kiếm và Discover (mặc định chỉ được hiện ảnh nhỏ)
    robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    // canonical đặt riêng ở từng trang: đặt ở đây thì trang nào quên khai báo sẽ trỏ nhầm về trang chủ
  };
}

export const viewport: Viewport = {
  themeColor: "#8d191d",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [site, fonts, rooms] = await Promise.all([getSite(), getThemeFonts(), getRooms()]);
  const fontRoles = fontRoleStyle(fonts);
  const contact = { name: site.name, phoneDisplay: site.phoneDisplay, telLink: site.telLink, zaloLink: site.zaloLink };

  return (
    // data-motion được script trong <head> gắn trước khi React chạy
    <html lang="vi" className={fontVariables} style={fontRoles} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <JsonLd data={hotelJsonLd(site, rooms)} />
        <JsonLd data={websiteJsonLd(site)} />
      </head>
      <body>
        <a className="skip" href="#noi-dung">
          Bỏ qua tới nội dung
        </a>
        <Header contact={contact} />
        <main id="noi-dung">{children}</main>
        <Footer />
        <ContactBar contact={contact} />
        <FloatContact zaloLink={site.zaloLink} facebook={site.social.facebook} />
        <Motion />
      </body>
    </html>
  );
}
