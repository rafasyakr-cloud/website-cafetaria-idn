import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import LoadingScreen from "@/components/LoadingScreen";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: `${siteConfig.name} — Seni Kopi Nusantara & Kenyamanan Ruang`,
  description: siteConfig.description,
  keywords: [
    "Cafetaria IDN",
    "IDN Cafetaria",
    "Artisan Coffee Jakarta",
    "Specialty Coffee Indonesia",
    "Tempat Nongkrong Aesthetic",
    "Cafe WFC Senopati",
    "Kopi Nusantara",
    "Single Origin Gayo Toraja Kintamani",
  ],
  authors: [{ name: "Cafetaria IDN" }],
  openGraph: {
    title: `${siteConfig.name} — Seni Kopi Nusantara & Kenyamanan Ruang`,
    description: siteConfig.description,
    url: "https://cafetariaidn.com",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-interior.png",
        width: 1200,
        height: 630,
        alt: "Cafetaria IDN Interior & Roastery",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-surface text-on-surface font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed relative">
        <LoadingScreen />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
