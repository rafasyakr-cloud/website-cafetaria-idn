import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function About() {
  return (
    <section
      id="tentang-kami"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface-container-lowest"
      aria-label="Tentang Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header Tag & Text */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary-container/50 text-secondary text-xs font-semibold tracking-wider uppercase">
            <span>Tentang Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
            Dedikasi Menjaga Keaslian Rasa, Menghubungkan Manusia
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Didirikan oleh <strong className="text-on-surface font-bold">{siteConfig.owner.name}</strong>, Cafetaria IDN berakar dari sebuah roastery mikro independen dengan misi sederhana: mengangkat harkat biji kopi kepulauan Indonesia ke panggung modern. Kami bermitra secara langsung (<em>direct trade</em>) dengan petani perkebunan di Dataran Tinggi Aceh Gayo, lereng pegunungan Toraja, hingga tanah vulkanis Kintamani Bali.
          </p>
        </div>

        {/* Bento Visual & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Image & Founder Quote */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container min-h-[400px] flex flex-col justify-end p-8">
            <Image
              src="/images/barista-pour.png"
              alt="Artisan barista Cafetaria IDN menuangkan susu bertekstur lembut untuk kreasi latte art"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/50 to-transparent" />

            <div className="relative z-10 text-inverse-on-surface space-y-3">
              <span className="material-symbols-outlined text-3xl text-primary-fixed-dim">
                format_quote
              </span>
              <p className="text-sm sm:text-base italic text-inverse-on-surface/95 leading-relaxed">
                &ldquo;{siteConfig.owner.quote}&rdquo;
              </p>
              <div className="pt-3 border-t border-outline/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-inverse-on-surface">{siteConfig.owner.name}</p>
                  <p className="text-xs text-primary-fixed">{siteConfig.owner.title}</p>
                </div>
                <span className="material-symbols-outlined text-primary-fixed" aria-hidden="true">
                  verified
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3 Key Strengths Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Key 1 */}
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary transition-all duration-300 shadow-warm flex items-start gap-5 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">eco</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg text-on-surface font-semibold">
                  Biji Kopi Kurasi Petani Nusantara
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Hanya menggunakan biji specialty grade cupping score 85+. Disangrai mingguan dengan profil medium roast yang presisi untuk mengeluarkan aroma floral, keasaman manis, dan karakter terroir otentik.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-xs text-secondary font-medium">
                    Gayo Washed
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-xs text-secondary font-medium">
                    Toraja Sapan
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-xs text-secondary font-medium">
                    Kintamani Natural
                  </span>
                </div>
              </div>
            </div>

            {/* Key 2 */}
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary transition-all duration-300 shadow-warm flex items-start gap-5 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">wifi</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg text-on-surface font-semibold">
                  Atmosfer & Fasilitas Produktif (WFC-Ready)
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Dirancang khusus oleh {siteConfig.owner.name} untuk gaya hidup modern dan Gen Z. Dilengkapi koneksi WiFi serat optik 200 Mbps, outlet listrik di setiap meja, pencahayaan alami nan lembut, dan zona hening yang kondusif untuk bekerja.
                </p>
                <div className="pt-2 flex items-center gap-4 text-secondary text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">power</span> Colokan Setiap Meja
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">volume_down</span> Akustik Tenang
                  </span>
                </div>
              </div>
            </div>

            {/* Key 3 */}
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant/50 hover:border-primary transition-all duration-300 shadow-warm flex items-start gap-5 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">bakery_dining</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg text-on-surface font-semibold">
                  Kreasi Pastry & Kuliner Sehat
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Dipanggang segar setiap pagi (freshly baked) oleh artisan baker kami. Menggunakan mentega Prancis kualitas terbaik, fermentasi ragi alami, dan bumbu rempah nusantara tanpa pengawet sintetik.
                </p>
                <div className="pt-2 flex items-center gap-4 text-secondary text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> 100% Tanpa Pengawet
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span> Panggang Setiap Pagi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
