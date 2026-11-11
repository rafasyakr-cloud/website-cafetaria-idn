"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    reservation,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    setReservation,
    clearCart,
    itemCount,
    fnbTotal,
    reservationTotal,
    totalAmount,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"fnb" | "reservation">("fnb");
  const [showReserveModal, setShowReserveModal] = useState(false);

  // Quick reservation form state
  const [reserveZone, setReserveZone] = useState(siteConfig.spaces[0]?.name || "Roastery Sanctuary & Bar Utama");
  const [reserveDate, setReserveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [reserveTime, setReserveTime] = useState("14:00 - 16:00");
  const [reserveGuests, setReserveGuests] = useState(2);
  const [reserveNotes, setReserveNotes] = useState("");

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservation({
      zoneName: reserveZone,
      date: reserveDate,
      timeSlot: reserveTime,
      guestCount: reserveGuests,
      specialRequest: reserveNotes,
      downPayment: 50000, // Rp 50.000 commitment deposit
    });
    setShowReserveModal(false);
  };

  const handleProceedCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                shopping_bag
              </span>
              <div>
                <h3 id="cart-title" className="font-bold text-lg text-on-surface">
                  Pesanan Anda
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {itemCount} {itemCount === 1 ? "item" : "items"} dipilih
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Tutup keranjang"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Subheader Tabs */}
          <div className="flex border-b border-outline-variant/40 bg-surface px-6 pt-3 gap-6 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("fnb")}
              className={`pb-3 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "fnb"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">local_cafe</span>
              <span>Menu F&B ({items.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reservation")}
              className={`pb-3 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "reservation"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">chair</span>
              <span>Reservasi Ruang ({reservation ? "1" : "0"})</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "fnb" ? (
              items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-on-surface">Belum ada menu yang dipilih</p>
                    <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                      Jelajahi sajian kopi specialty nusantara dan artisan pastry kami.
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-sm transition-transform active:scale-95"
                  >
                    <span>Buka Katalog Menu</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-surface border border-outline-variant/60 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-semibold text-sm text-on-surface truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-primary">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                        <p className="text-[11px] text-outline">
                          @ Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-xs font-bold hover:bg-surface-container-high transition-colors"
                          aria-label="Kurangi jumlah"
                        >
                          -
                        </button>
                        <span className="font-semibold text-xs min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-xs font-bold hover:bg-surface-container-high transition-colors"
                          aria-label="Tambah jumlah"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors ml-1"
                          title="Hapus"
                          aria-label="Hapus item"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Tab Reservasi */
              <div className="space-y-4">
                {reservation ? (
                  <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                        <span className="material-symbols-outlined text-lg">event_seat</span>
                        <span>{reservation.zoneName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReservation(null)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Batalkan
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                      <div>
                        <span className="block text-[10px] text-outline uppercase font-semibold">Tanggal</span>
                        <span className="font-medium text-on-surface">{reservation.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-outline uppercase font-semibold">Sesi Waktu</span>
                        <span className="font-medium text-on-surface">{reservation.timeSlot}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-outline uppercase font-semibold">Jumlah Tamu</span>
                        <span className="font-medium text-on-surface">{reservation.guestCount} Orang</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-outline uppercase font-semibold">Biaya Komitmen</span>
                        <span className="font-bold text-primary">Rp {reservation.downPayment.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    {reservation.specialRequest && (
                      <p className="text-xs text-on-surface-variant italic">
                        Catatan: &ldquo;{reservation.specialRequest}&rdquo;
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-3xl">meeting_room</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-on-surface">Belum ada reservasi tempat</p>
                      <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                        Pesan meja WFC Lounge atau Private Mezzanine untuk kenyamanan kerja dan pertemuan Anda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReserveModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-semibold hover:opacity-90 shadow-sm transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Buat Reservasi Ruang</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Reservation Modal Sheet */}
          {showReserveModal && (
            <div className="p-6 border-t border-outline-variant bg-surface space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-on-surface">Form Reservasi Meja / Ruang</h4>
                <button
                  type="button"
                  onClick={() => setShowReserveModal(false)}
                  className="text-xs text-outline hover:text-on-surface"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleSaveReservation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">Pilih Zona Ruang</label>
                  <select
                    value={reserveZone}
                    onChange={(e) => setReserveZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  >
                    {siteConfig.spaces.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={reserveDate}
                      onChange={(e) => setReserveDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Sesi Waktu</label>
                    <select
                      value={reserveTime}
                      onChange={(e) => setReserveTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    >
                      <option value="09:00 - 11:00">09:00 - 11:00 (Pagi)</option>
                      <option value="11:30 - 13:30">11:30 - 13:30 (Siang)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Sore WFC)</option>
                      <option value="16:30 - 18:30">16:30 - 18:30 (Senja)</option>
                      <option value="19:00 - 21:00">19:00 - 21:00 (Malam)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Jumlah Tamu</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={reserveGuests}
                      onChange={(e) => setReserveGuests(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface font-semibold mb-1">Deposit Komitmen</label>
                    <input
                      type="text"
                      readOnly
                      value="Rp 50.000"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 font-bold text-primary text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">Permintaan Khusus (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dekat colokan listrik, smoking area, dll."
                    value={reserveNotes}
                    onChange={(e) => setReserveNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs shadow-sm transition-all"
                >
                  Simpan Reservasi ke Pesanan
                </button>
              </form>
            </div>
          )}

          {/* Footer & Checkout Trigger */}
          <div className="p-6 border-t border-outline-variant/60 bg-surface-container-low/70 space-y-4">
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              {items.length > 0 && (
                <div className="flex justify-between">
                  <span>Subtotal Menu ({items.length} macam)</span>
                  <span className="font-semibold text-on-surface">
                    Rp {fnbTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {reservation && (
                <div className="flex justify-between">
                  <span>Komitmen Reservasi Meja</span>
                  <span className="font-semibold text-on-surface">
                    Rp {reservationTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-outline-variant/40 text-sm font-bold text-on-surface">
                <span>Total Pembayaran</span>
                <span className="text-primary text-base font-extrabold">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                disabled={itemCount === 0}
                onClick={handleProceedCheckout}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                <span>Lanjut ke Pembayaran QRIS</span>
              </button>

              {itemCount > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-2 text-center text-xs text-outline hover:text-red-600 transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
