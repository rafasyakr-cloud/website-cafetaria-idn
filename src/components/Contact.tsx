"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Reservasi Tempat & Meja",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "Reservasi Tempat & Meja",
        message: "",
      });
    }, 4000);
  };

  return (
    <section
      id="kontak"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface-container-low border-t border-outline-variant/30"
      aria-label="Kontak dan Lokasi Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-surface border border-outline-variant text-xs text-primary uppercase font-bold tracking-wider">
            Terhubung Dengan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
            Kunjungi Kami atau Kirimkan Pesan
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Pintu kami selalu terbuka untuk secangkir kopi hangat, diskusi kemitraan, maupun reservasi ruang personal Anda.
          </p>
        </div>

        {/* Two-column Bento Grid: Left Form & Details, Right Maps Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Info & Interactive Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Detail Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-warm flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5" aria-hidden="true">
                  location_on
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface">{siteConfig.contact.branchName}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-warm flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5" aria-hidden="true">
                  call
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface">Telepon / WhatsApp</p>
                  <p className="text-xs text-on-surface-variant">
                    {siteConfig.contact.whatsappFormatted}
                    <br />
                    {siteConfig.contact.phone}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-warm flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5" aria-hidden="true">
                  mail
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface">Email Resmi</p>
                  <p className="text-xs text-on-surface-variant">
                    {siteConfig.contact.email}
                    <br />
                    {siteConfig.contact.corporateEmail}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-warm flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5" aria-hidden="true">
                  schedule
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface">Jam Operasional</p>
                  <p className="text-xs text-on-surface-variant">
                    {siteConfig.contact.operatingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-warm space-y-6">
              <h3 className="text-xl font-bold text-on-surface">
                Kirimkan Pesan atau Pertanyaan
              </h3>

              {formSubmitted ? (
                <div
                  role="status"
                  className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn"
                >
                  <span className="material-symbols-outlined text-2xl text-emerald-600">
                    check_circle
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Pesan Anda berhasil terkirim!</p>
                    <p className="text-xs text-emerald-700">
                      Tim Cafetaria IDN akan segera menghubungi Anda melalui WhatsApp atau Email.
                    </p>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-on-surface">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Dimas Setiawan"
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-on-surface">
                        Alamat Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="dimas@perusahaan.co.id"
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="block text-xs font-semibold text-on-surface">
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-category" className="block text-xs font-semibold text-on-surface">
                        Kategori Kebutuhan
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option>Reservasi Tempat & Meja</option>
                        <option>Corporate & Event Catering</option>
                        <option>Sewa Ruang Private / Workshop</option>
                        <option>Wholesale Biji Kopi / Roastery</option>
                        <option>Kritik & Saran Pengunjung</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-on-surface">
                      Detail Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ceritakan detail rencana acara, tanggal reservasi, atau pertanyaan Anda..."
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-8 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Map Preview Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface-container-lowest shadow-warm flex-1 flex flex-col">
              {/* Google Maps Iframe */}
              <div className="relative h-72 lg:h-96 w-full bg-surface-container overflow-hidden">
                <iframe
                  title="Peta Lokasi Cafetaria IDN di Google Maps"
                  src="https://maps.google.com/maps?q=Jl.+Senopati+No.+42+Kebayoran+Baru+Jakarta+Selatan&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map Metadata & Actions */}
              <div className="p-6 space-y-5 bg-surface-container-lowest">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-on-surface">
                      {siteConfig.contact.branchName}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      Buka Sekarang
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Akses strategis jalan raya utama, berjarak 5 menit dari stasiun MRT ASEAN & kawasan SCBD Jakarta Selatan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/40">
                  <div className="flex items-center gap-2 text-secondary text-xs">
                    <span className="material-symbols-outlined text-primary text-base">local_parking</span>
                    <span>Tersedia Parkir Luas</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary text-xs">
                    <span className="material-symbols-outlined text-primary text-base">directions_car</span>
                    <span>Layanan Valet Gratis</span>
                  </div>
                </div>

                <a
                  href={siteConfig.contact.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary font-semibold text-sm transition-all active:scale-95 duration-150"
                >
                  <span className="material-symbols-outlined text-lg">navigation</span>
                  <span>Buka Rute di Google Maps</span>
                </a>
              </div>
            </div>

            {/* Additional Mini Branch Card */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">store</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface leading-tight">
                    Mencari Gerai Terdekat Lainnya?
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Kunjungi gerai Menteng Heritage & BSD Foresta
                  </p>
                </div>
              </div>
              <a
                href="#layanan"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Lokasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

