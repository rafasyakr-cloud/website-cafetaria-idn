import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Katalog Menu & Pemesanan — ${siteConfig.name}`,
  description:
    "Eksplorasi kreasi seduhan kopi artisan, manual brew single origin, sajian nusantara modern, dan pastry renyah yang dipanggang segar di Cafetaria IDN.",
};

export default function MenuPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb & Header Banner */}
        <section className="pt-8 pb-4 px-6 lg:px-10 bg-surface-container-low border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-outline mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-primary font-semibold">Katalog Menu & Kuliner</span>
            </nav>
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Katalog Menu & Cita Rasa Nusantara
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Pilih menu favorit Anda, kustomisasi tingkat manis atau susu, dan pesan langsung dari meja atau bawa pulang (takeaway).
              </p>
            </div>
          </div>
        </section>

        {/* Full Interactive Menu Section */}
        <Menu />
      </main>
      <Footer />
    </div>
  );
}

