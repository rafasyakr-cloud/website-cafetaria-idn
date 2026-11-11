import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Spaces from "@/components/Spaces";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Suasana & Kenyamanan Tempat — ${siteConfig.name}`,
  description:
    "Jelajahi kenyamanan ruang Cafetaria IDN: Roastery Bar, Productive WFC Lounge, Glasshouse Garden, dan Private Meeting Mezzanine berkapasitas 15-40 orang.",
};

export default function TempatPage() {
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
              <span className="text-primary font-semibold">Suasana & Kenyamanan Ruang</span>
            </nav>
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Eksplorasi Ruang & Fasilitas Gerai
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Dirancang khusus dengan zonasi fungsional untuk mendukung kebutuhan kerja santai (WFC), pertemuan bisnis, dan kumpul hangat keluarga.
              </p>
            </div>
          </div>
        </section>

        {/* Full Spaces Component */}
        <Spaces />

        {/* Direct Booking / Contact Section */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

