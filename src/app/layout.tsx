import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { motionBootScript } from "@/lib/motion";
import { site } from "@/lib/site";
import { theme } from "@/lib/theme";
import { fontVar, fontVariables } from "./fonts";
import "./globals.css";

// Trỏ từng vai trò chữ vào font đang chọn trong theme (sau này do CMS quyết định)
const fontRoles = {
  "--font-role-heading": fontVar(theme.fonts.heading),
  "--font-role-hero": fontVar(theme.fonts.hero),
  "--font-role-body": fontVar(theme.fonts.body),
  "--font-role-ui": fontVar(theme.fonts.ui),
} as CSSProperties;

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: "#8d191d",
};

const hotelJsonLd = {
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-motion được script trong <head> gắn trước khi React chạy
    <html lang="vi" className={fontVariables} style={fontRoles} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
      </head>
      <body>
        <a className="skip" href="#noi-dung">
          Bỏ qua tới nội dung
        </a>
        <Header />
        <main id="noi-dung">{children}</main>
        <Footer />
        <ContactBar />
        <Motion />
      </body>
    </html>
  );
}
