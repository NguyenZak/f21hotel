import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { motionBootScript } from "@/lib/motion";
import { getSite, getThemeFonts, type SiteData } from "@/lib/cms";
import { fontVar, fontVariables } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} – ${site.tagline} | An Khánh, gần Mỹ Đình`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
    },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: "#8d191d",
};

const hotelJsonLd = (site: SiteData) => ({
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/img/anh/mat-tien-ngay.webp`,
  logo: `${site.url}/img/logo-ngang.png`,
  telephone: site.phone,
  ...(site.email ? { email: site.email } : {}),
  priceRange: "300.000đ – 1.200.000đ",
  checkinTime: site.checkIn,
  checkoutTime: site.checkOut,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  amenityFeature: ["Wifi miễn phí", "Điều hoà"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
});

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [site, fonts] = await Promise.all([getSite(), getThemeFonts()]);
  // Trỏ từng vai trò chữ vào font chọn trong CMS (Cài đặt › Giao diện)
  const fontRoles = {
    "--font-role-heading": fontVar(fonts.heading),
    "--font-role-hero": fontVar(fonts.hero),
    "--font-role-body": fontVar(fonts.body),
    "--font-role-ui": fontVar(fonts.ui),
  } as CSSProperties;
  const contact = { name: site.name, phoneDisplay: site.phoneDisplay, telLink: site.telLink, zaloLink: site.zaloLink };

  return (
    // data-motion được script trong <head> gắn trước khi React chạy
    <html lang="vi" className={fontVariables} style={fontRoles} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd(site)) }} />
      </head>
      <body>
        <a className="skip" href="#noi-dung">
          Bỏ qua tới nội dung
        </a>
        <Header contact={contact} />
        <main id="noi-dung">{children}</main>
        <Footer />
        <ContactBar contact={contact} />
        <Motion />
      </body>
    </html>
  );
}
