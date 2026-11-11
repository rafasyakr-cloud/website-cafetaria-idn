"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { siteConfig, MenuItem } from "@/config/site";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>("all");
  const [notification, setNotification] = useState<string | null>(null);

  // Filter logic
  const filteredItems = useMemo(() => {
    return siteConfig.menuItems.filter((item) => {
      // 1. Category Filter
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      // 2. Search Query Filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tastingNotes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // 3. Quick Filter Tags
      let matchesQuick = true;
      if (selectedQuickFilter === "best-seller") {
        matchesQuick = Boolean(item.isBestSeller);
      } else if (selectedQuickFilter === "single-origin") {
        matchesQuick =
          item.category === "manual-brew" ||
          item.badge?.toLowerCase().includes("single origin") ||
          false;
      }

      return matchesCategory && matchesSearch && matchesQuick;
    });
  }, [activeCategory, searchQuery, selectedQuickFilter]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    }, 1);
    setNotification(`Berhasil menambahkan "${item.name}" ke daftar pesanan!`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <section
      id="menu"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface-container-low/60 border-t border-outline-variant/30 scroll-mt-20"
      aria-label="Katalog Menu & Kuliner Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Toast Notification */}
        {notification && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 bg-secondary-espresso text-on-secondary px-5 py-3 rounded-xl shadow-2xl border border-primary-crema/40 flex items-center gap-3 animate-bounce"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              check_circle
            </span>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        )}

        {/* Section Header & Table QR Callout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-sm">
                restaurant_menu
              </span>
              <span className="text-on-secondary-container text-xs font-bold uppercase tracking-wider">
                Katalog Menu Kuliner
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Cita Rasa Otentik & Seduhan Artisan
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Jelajahi kreasi kopi single-origin terbaik nusantara, minuman signature dingin menyegarkan, viennoiserie pastry hangat, dan hidangan khas warisan rasa.
            </p>
          </div>

          {/* Dine-in QR Banner */}
          <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-warm flex items-center gap-4 self-start lg:self-auto">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
              <span className="material-symbols-outlined text-2xl">
                qr_code_scanner
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Sedang di Meja Gerai?</p>
              <p className="text-xs text-on-surface-variant">
                Scan kode QR meja Anda untuk pemesanan cepat
              </p>
            </div>
          </div>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-warm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu favorit, beans, pastry..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-tertiary whitespace-nowrap font-medium">
                Pintasan:
              </span>
              <button
                type="button"
                onClick={() => setSelectedQuickFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedQuickFilter === "all"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedQuickFilter(
                    selectedQuickFilter === "best-seller" ? "all" : "best-seller"
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedQuickFilter === "best-seller"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                ★ Paling Populer
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedQuickFilter(
                    selectedQuickFilter === "single-origin" ? "all" : "single-origin"
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedQuickFilter === "single-origin"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40"
                }`}
              >
                Single Origin Nusantara
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-outline-variant/20 scrollbar-none">
            {siteConfig.menuCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  activeCategory === cat.id
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-8 space-y-3">
            <span className="material-symbols-outlined text-4xl text-outline">
              search_off
            </span>
            <p className="text-base font-bold text-on-surface">Menu tidak ditemukan</p>
            <p className="text-xs text-on-surface-variant">
              Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setSelectedQuickFilter("all");
              }}
              className="mt-2 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Item Image */}
                  <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {item.badge && (
                      <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-primary border border-outline-variant/40 shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <span className="text-sm font-extrabold text-primary shrink-0">
                        {item.formattedPrice}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30 text-[10px] font-medium text-secondary"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2.5 px-4 rounded-full bg-surface-container hover:bg-primary text-on-surface hover:text-on-primary font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-base">
                      add_shopping_cart
                    </span>
                    <span>+ Tambah Pesanan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

