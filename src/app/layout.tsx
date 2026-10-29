import type { Metadata, Viewport } from "next";
import { STIX_Two_Text } from "next/font/google";
import localFont from "next/font/local";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

// Font tiêu đề h1–h4 (1FTV International)
const heading = localFont({
  src: "./fonts/1ftv-international.otf",
  variable: "--font-1ftv",
  display: "swap",
  // Font thiếu các ký tự " # $ % & ' ( ) * + - / < = > [ \ ] ^ _ { | } ~ – — “ ” ‘ ’ … • · ′
  // Loại chúng khỏi unicode-range để trình duyệt lấy từ STIX thay vì hiện ô trống
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0020-0021, U+002C, U+002E, U+0030-003B, U+003F-005A, U+0060-007A, U+00A0-00B6, U+00B8-2012, U+2015-2017, U+201A-201B, U+201E-2021, U+2023-2025, U+2027-2031, U+2033-FFFF",
    },
  ],
});

// Font nội dung; giá và số dùng nét đậm. Tự host qua next/font thay cho thẻ <link> Google Fonts
const stix = STIX_Two_Text({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-stix",
  display: "swap",
});

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
  image: `${site.url}/img/mat-tien.jpg`,
  logo: `${site.url}/img/logo-ngang.png`,
  telephone: site.phone,
  email: site.email,
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
    <html lang="vi" className={`${heading.variable} ${stix.variable}`}>
      <head>
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
      </body>
    </html>
  );
}
