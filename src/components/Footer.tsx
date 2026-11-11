"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer
      className="bg-inverse-surface border-t border-tertiary/20 text-inverse-on-surface"
      aria-label="Footer Website"
    >
      <div className="w-full py-16 px-6 lg:px-10 max-w-7xl mx-auto space-y-12">
        {/* Top Grid: Brand & Sitemap Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative h-10 w-36 brightness-200">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-surface-dim max-w-sm leading-relaxed">
              Cita rasa kopi nusantara dalam ruang bersahabat kelas dunia. Kami menghubungkan dedikasi petani lokal dengan penikmat kopi urban melalui sentuhan artisanal yang tulus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:text-primary-fixed hover:bg-surface-container/40 transition-colors"
                title="Instagram Cafetaria IDN"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:text-primary-fixed hover:bg-surface-container/40 transition-colors"
                title="TikTok Cafetaria IDN"
                aria-label="TikTok"
              >
                <span className="material-symbols-outlined text-lg">music_note</span>
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:text-primary-fixed hover:bg-surface-container/40 transition-colors"
                title="YouTube Cafetaria IDN"
                aria-label="YouTube"
              >
                <span className="material-symbols-outlined text-lg">smart_display</span>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:text-primary-fixed hover:bg-surface-container/40 transition-colors"
                title="LinkedIn Cafetaria IDN"
                aria-label="LinkedIn"
              >
                <span className="material-symbols-outlined text-lg">work</span>
              </a>
            </div>
          </div>

          {/* Col 2: Nav Sitemap Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary-fixed">Navigasi</p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#tentang-kami" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#layanan" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Layanan Katering
                  </Link>
                </li>
                <li>
                  <Link href="#layanan" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Sewa Tempat
                  </Link>
                </li>
                <li>
                  <Link href="#layanan" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Koleksi Kopi
                  </Link>
                </li>
                <li>
                  <Link href="#kontak" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Karier & Kemitraan
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary-fixed">Informasi</p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#kebijakan" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#syarat" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="#keberlanjutan" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Kemitraan Petani
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-xs text-surface-dim hover:text-primary-fixed hover:underline transition-all">
                    Pusat Bantuan (FAQ)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Quick Info & Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-sm font-semibold text-primary-fixed">Langganan Warta Kopi</p>
            <p className="text-xs text-surface-dim leading-relaxed">
              Dapatkan diskon biji sangrai bulanan dan undangan cupping session eksklusif bersama Q-Grader kami.
            </p>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Terima kasih sudah berlangganan Warta Kopi Cafetaria IDN!");
              }}
            >
              <input
                type="email"
                required
                placeholder="Alamat email Anda"
                className="w-full px-3 py-2 rounded-lg bg-surface-container/20 border border-outline/40 text-inverse-on-surface placeholder:text-surface-dim/60 text-xs focus:outline-none focus:border-primary-fixed"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed text-xs font-semibold hover:bg-primary transition-colors active:opacity-80"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-outline/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-dim text-center md:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. Didirikan oleh {siteConfig.owner.name}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-surface-dim">
              <span className="material-symbols-outlined text-base text-primary-fixed" aria-hidden="true">
                verified
              </span>
              Sertifikasi Halal & Specialty Coffee Association (SCA)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
