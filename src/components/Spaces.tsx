"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";

export default function Spaces() {
  const { setReservation } = useCart();

  const handleReserveSpace = (space: (typeof siteConfig.spaces)[0]) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setReservation({
      zoneName: space.name,
      date: d.toISOString().split("T")[0],
      timeSlot: "14:00 - 16:00",
      guestCount: 2,
      specialRequest: `Reservasi area ${space.name}`,
      downPayment: 50000,
    });
  };
  return (
    <section
      id="tempat"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface border-t border-outline-variant/30 scroll-mt-20"
      aria-label="Suasana dan Tempat Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container/60 border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-sm">
              deck
            </span>
            <span className="text-on-secondary-container text-xs font-bold uppercase tracking-wider">
              Suasana & Kenyamanan Ruang
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            Desain Ruang Temu Modern, Estetik & Produktif
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Menghadirkan harmoni material kayu alami, pencahayaan lembut, dan zonasi fungsional. Dari ruang WFC hening bercolokan lengkap hingga sudut santai berbincang bersama sahabat.
          </p>
        </div>

        {/* 4 Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteConfig.spaces.map((space) => (
            <div
              key={space.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 overflow-hidden shadow-warm hover:shadow-warm-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative h-64 sm:h-72 w-full bg-surface-container overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
                  
                  {/* Top Badge */}
                  <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary border border-outline-variant/40 shadow-xs">
                    {space.badge}
                  </span>

                  {/* Bottom Info on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider text-primary-fixed font-semibold">
                      {space.capacity}
                    </span>
                    <h3 className="text-xl font-bold leading-snug drop-shadow-sm">
                      {space.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs font-semibold text-primary">
                    {space.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {space.description}
                  </p>

                  {/* Atmosphere badge */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-secondary font-medium">
                    <span className="material-symbols-outlined text-base text-primary">
                      mood
                    </span>
                    <span>Nuansa: <strong>{space.atmosphere}</strong></span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30">
                    {space.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleReserveSpace(space)}
                  className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-primary text-on-surface hover:text-on-primary font-semibold text-xs transition-colors duration-150 cursor-pointer"
                >
                  <span>Reservasi Zona Ini</span>
                  <span className="material-symbols-outlined text-base">
                    event_seat
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Facility Highlights Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-warm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-on-surface">
                Fasilitas Lengkap Gerai Flagship Senopati
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Didesain untuk memastikan setiap kunjungan Anda nyaman, produktif, dan berkesan.
              </p>
            </div>
            <Link
              href="#kontak"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs shadow-sm transition-transform active:scale-95 whitespace-nowrap self-start sm:self-auto"
            >
              <span>Reservasi Meja</span>
              <span className="material-symbols-outlined text-base">event_seat</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-outline-variant/30">
            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                wifi
              </span>
              <p className="text-xs font-semibold text-on-surface">Wi-Fi 200 Mbps</p>
              <p className="text-[11px] text-on-surface-variant">Serat optik cepat</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                power
              </span>
              <p className="text-xs font-semibold text-on-surface">Colokan Tiap Meja</p>
              <p className="text-[11px] text-on-surface-variant">Aman untuk laptop</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                directions_car
              </span>
              <p className="text-xs font-semibold text-on-surface">Valet Parking</p>
              <p className="text-[11px] text-on-surface-variant">Layanan valet gratis</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                mosque
              </span>
              <p className="text-xs font-semibold text-on-surface">Musholla Nyaman</p>
              <p className="text-[11px] text-on-surface-variant">AC & wudhu terpisah</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                smoking_rooms
              </span>
              <p className="text-xs font-semibold text-on-surface">Area Terpisah</p>
              <p className="text-[11px] text-on-surface-variant">Smoking & Non-Smoking</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-center space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                chair
              </span>
              <p className="text-xs font-semibold text-on-surface">Kursi Ergonomis</p>
              <p className="text-[11px] text-on-surface-variant">Nyaman berjam-jam</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

