import type { Metadata, Viewport } from "next";
import { Playfair_Display, STIX_Two_Text } from "next/font/google";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

// Font tiêu đề, giá và số
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

// Font phụ cho nội dung, tự host qua next/font thay cho thẻ <link> Google Fonts
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
    <html lang="vi" className={`${playfair.variable} ${stix.variable}`}>
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
