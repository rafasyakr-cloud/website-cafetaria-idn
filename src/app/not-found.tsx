import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-6 py-16 text-center relative selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6">
        <Link href="/" className="inline-block relative h-12 w-44 mx-auto">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Steaming Mug Vector */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-container flex items-center justify-center text-primary border border-outline-variant/60 shadow-warm">
          <span className="material-symbols-outlined text-5xl">coffee</span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-outline uppercase tracking-widest">
            Error 404 • Halaman Belum Diseduh
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Cangkir yang Anda Cari Tidak Ada di Meja
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Halaman atau tautan yang Anda tuju mungkin telah dipindahkan, diganti nama, atau belum tersedia di kedai kami.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/menu"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">restaurant_menu</span>
            <span>Jelajahi Menu Kopi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

