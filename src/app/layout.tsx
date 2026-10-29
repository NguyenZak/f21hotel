import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";
import localFont from "next/font/local";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

// Font chính của thương hiệu (tiêu đề, nút, nhãn)
const audrey = localFont({
  src: "./fonts/SVN-Audrey.otf",
  variable: "--font-audrey",
  display: "swap",
  // Font không có các glyph: < > @ _ ` { | } ~ © ® ° ² · × – — • … € ™
  // Loại chúng khỏi unicode-range để trình duyệt lấy từ font dự phòng thay vì hiện ô trống
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-003B, U+003D, U+003F, U+0041-005E, U+0061-007A, U+00A0-00A8, U+00AA-00AD, U+00AF, U+00B1, U+00B3-00B6, U+00B8-00D6, U+00D8-2012, U+2015-2021, U+2023-2025, U+2027-20AB, U+20AD-2121, U+2123-FFFF",
    },
  ],
});

// Font phụ cho nội dung, tự host qua next/font thay cho thẻ <link> Google Fonts
const lora = Lora({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-lora",
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
    <html lang="vi" className={`${audrey.variable} ${lora.variable}`}>
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
