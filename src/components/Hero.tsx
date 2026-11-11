import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-10 pb-20 lg:pt-14 lg:pb-28 px-6 lg:px-10 overflow-hidden bg-gradient-to-b from-surface via-surface-container-low to-surface"
      aria-label="Bagian Utama"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copywriting */}
        <div className="lg:col-span-6 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant/60 shadow-xs">
            <span className="text-primary text-xs font-semibold" aria-hidden="true">✦</span>
            <span className="text-on-surface-variant text-xs font-semibold tracking-wide">
              Artisan Roastery & Nusantara Flavor
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-on-surface leading-[1.15] tracking-tight">
            Menghadirkan Seni{" "}
            <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-4">
              Kopi Nusantara
            </span>{" "}
            & Kenyamanan Ruang Terbaik
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
            {siteConfig.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150"
            >
              <span>Jelajahi Menu & Tempat</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              href="#kontak"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-semibold text-sm transition-all active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined text-base">event_seat</span>
              <span>Reservasi Acara</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/40">
            <div className="flex text-amber-500" aria-label="Rating 5 bintang">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined fill-icon text-xl text-primary">
                  star
                </span>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-on-surface-variant">
              <strong className="text-on-surface font-semibold">{siteConfig.stats.rating}</strong>{" "}
              dari {siteConfig.stats.reviewsCount}
            </span>
          </div>
        </div>

        {/* Right Hero Media Bento Card */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/40 bg-surface-container-lowest aspect-[4/3] lg:aspect-[5/4] w-full">
            <Image
              src="/images/hero-interior.png"
              alt="Interior estetik modern Cafetaria IDN dengan sentuhan kayu hangat dan barista profesional"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 via-transparent to-transparent" />

            {/* Floating Badge 1 (Top Right) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface leading-tight">100% Single Origin</p>
                <p className="text-xs text-secondary pt-0.5">Specialty Arabica Nusantara</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Left) */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-xl p-3 sm:p-4 shadow-lg flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-xl sm:text-2xl">storefront</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-lg text-on-surface font-bold">
                    {siteConfig.stats.branchesCount}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{siteConfig.stats.branchesList}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

