import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Services() {
  return (
    <section
      id="layanan"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface-container-low"
      aria-label="Layanan Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-surface border border-outline-variant text-xs text-primary uppercase font-bold tracking-wider">
            Layanan Terpadu
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
            Layanan Komprehensif Kami
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Solusi kuliner dan ruang serbaguna yang dirancang untuk kebutuhan personal maupun korporat.
          </p>
        </div>

        {/* 4 Interactive Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/60 shadow-warm hover:shadow-warm-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-secondary-container/60 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-on-surface">{service.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs text-secondary font-medium">{service.badge}</span>
                <span
                  className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Banner Highlight */}
        <div className="rounded-2xl bg-inverse-surface text-inverse-on-surface p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-lg font-semibold text-primary-fixed-dim">
              Konsultasi Kebutuhan B2B & Event Khusus
            </p>
            <p className="text-sm text-inverse-on-surface/80 max-w-2xl leading-relaxed">
              Tim kami siap mengkustomisasi menu katering, setup mobile bar, dan penjadwalan ruang sesuai anggaran dan kebutuhan eksklusif perusahaan Anda.
            </p>
          </div>
          <Link
            href="#kontak"
            className="whitespace-nowrap px-8 py-3.5 rounded-full bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-on-primary font-semibold text-sm transition-all duration-150 active:scale-95 shadow"
          >
            Hubungi Tim Event
          </Link>
        </div>
      </div>
    </section>
  );
}

