"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, reservation, totalAmount, fnbTotal, reservationTotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway" | "reservasi">("dine_in");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPath, setProofPath] = useState<string>("");
  const [uploadingProof, setUploadingProof] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check login status
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login?callbackUrl=/checkout");
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setCustomerName(data.user.name || "");
        } else {
          router.push("/login?callbackUrl=/checkout");
        }
      } catch (e) {
        router.push("/login?callbackUrl=/checkout");
      } finally {
        setCheckingAuth(false);
      }
    }
    checkUser();
  }, [router]);

  // Adjust default orderType if reservation exists
  useEffect(() => {
    if (reservation) {
      setOrderType("reservasi");
    }
  }, [reservation]);

  // Upload proof of payment if user selects a file
  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofFile(file);
    setUploadingProof(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah bukti pembayaran.");
      }
      setProofPath(data.filePath);
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah bukti transfer.");
      setProofFile(null);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanWa = whatsapp.replace(/[^0-9]/g, "");
      if (cleanWa.length < 9) {
        throw new Error("Silakan masukkan nomor WhatsApp yang valid (minimal 9 digit).");
      }

      const orderPayload = {
        customer_name: customerName,
        whatsapp: cleanWa,
        order_type: reservation && items.length > 0 ? "kombinasi" : reservation ? "reservasi" : orderType,
        items_json: JSON.stringify({
          fnbItems: items,
          reservationDetails: reservation,
        }),
        total_amount: totalAmount,
        notes,
        payment_proof_path: proofPath,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      // Clear cart state and navigate to order confirmation page
      clearCart();
      router.push(`/pesanan?success=true&code=${data.order.order_code}`);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-on-surface-variant font-medium">
            Memeriksa autentikasi sesi pesanan Anda...
          </p>
        </div>
      </div>
    );
  }

  const isCartEmpty = items.length === 0 && !reservation;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Kembali ke Menu</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Pembayaran QRIS & Konfirmasi Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Selesaikan pembayaran digital via QRIS standar nasional untuk memproses hidangan kopi atau reservasi meja Anda.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3 animate-shake"
            >
              <span className="material-symbols-outlined text-red-600 text-xl">error</span>
              <span>{error}</span>
            </div>
          )}

          {isCartEmpty ? (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-12 text-center space-y-5 shadow-warm">
              <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-on-surface">Keranjang Anda Kosong</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                  Anda belum memilih menu minuman, pastry, ataupun reservasi ruang temu Cafetaria IDN.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-sm transition-transform active:scale-95"
              >
                <span>Buka Katalog Menu Kopi</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Data Pemesan */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-warm space-y-5">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <span>Informasi Pemesan & Kontak</span>
                  </h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="space-y-1.5">
                      <label htmlFor="customerName" className="block font-semibold text-on-surface">
                        Nama Lengkap Pemesan *
                      </label>
                      <input
                        id="customerName"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Raffasya Putra"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="whatsapp" className="block font-semibold text-on-surface">
                        Nomor WhatsApp Aktif *
                      </label>
                      <input
                        id="whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                      />
                      <span className="text-[11px] text-outline block">
                        Kasir akan mengirimkan status konfirmasi pesanan melalui nomor ini.
                      </span>
                    </div>

                    {!reservation && (
                      <div className="space-y-1.5">
                        <label className="block font-semibold text-on-surface">
                          Tipe Pesanan
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              orderType === "dine_in"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-outline-variant bg-surface text-on-surface"
                            }`}
                          >
                            <input
                              type="radio"
                              name="orderType"
                              value="dine_in"
                              checked={orderType === "dine_in"}
                              onChange={() => setOrderType("dine_in")}
                              className="sr-only"
                            />
                            <span className="material-symbols-outlined text-lg">restaurant</span>
                            <span className="text-xs">Dine-in (Di Meja Gerai)</span>
                          </label>

                          <label
                            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              orderType === "takeaway"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-outline-variant bg-surface text-on-surface"
                            }`}
                          >
                            <input
                              type="radio"
                              name="orderType"
                              value="takeaway"
                              checked={orderType === "takeaway"}
                              onChange={() => setOrderType("takeaway")}
                              className="sr-only"
                            />
                            <span className="material-symbols-outlined text-lg">shopping_bag</span>
                            <span className="text-xs">Takeaway (Bungkus)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label htmlFor="notes" className="block font-semibold text-on-surface">
                        Catatan Tambahan untuk Barista / Dapur
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Es dipisah, less sweet untuk es kopi aren, meja dekat jendela."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Bukti Pembayaran */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-warm space-y-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">receipt</span>
                    <span>Unggah Bukti Transfer / Struk (Opsional)</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Jika Anda sudah melakukan scan QRIS, Anda dapat melampirkan screenshot atau foto struk pembayaran untuk verifikasi lebih cepat oleh kasir.
                  </p>

                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-sm">cloud_upload</span>
                      <span>{uploadingProof ? "Mengunggah..." : proofFile ? "Ganti File Struk" : "Pilih File Bukti"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleProofChange}
                        className="sr-only"
                        disabled={uploadingProof}
                      />
                    </label>

                    {proofPath && (
                      <span className="text-xs text-green-700 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Struk terunggah</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rincian Pesanan & Barcode QRIS */}
              <div className="lg:col-span-5 space-y-6">
                {/* QRIS Card */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-warm space-y-5 text-center">
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-200">
                      Metode Pembayaran Resmi
                    </span>
                    <h3 className="text-xl font-bold text-on-surface">Scan QRIS Nasional</h3>
                    <p className="text-xs text-on-surface-variant">
                      Dapat di-scan dengan seluruh aplikasi mobile banking & dompet digital Indonesia
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative mx-auto w-64 h-88 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-outline-variant/60 shadow-md bg-white p-2">
                    <Image
                      src="/images/qris.svg"
                      alt="QRIS Cafetaria IDN"
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 text-left space-y-2 text-xs">
                    <span className="font-bold text-on-surface block">Langkah Pembayaran:</span>
                    <ol className="list-decimal list-inside space-y-1 text-on-surface-variant text-[11px] leading-relaxed">
                      <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, ShopeePay, DANA).</li>
                      <li>Pindai (*scan*) kode QRIS di atas.</li>
                      <li>Masukkan nominal tepat sebesar: <strong className="text-primary font-bold">Rp {totalAmount.toLocaleString("id-ID")}</strong>.</li>
                      <li>Konfirmasi pembayaran lalu klik tombol di bawah ini.</li>
                    </ol>
                  </div>
                </div>

                {/* Ringkasan Biaya */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 shadow-warm space-y-4">
                  <h4 className="font-bold text-base text-on-surface border-b border-outline-variant/30 pb-3">
                    Rincian Tagihan
                  </h4>

                  <div className="space-y-3 max-h-48 overflow-y-auto text-xs">
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center text-on-surface-variant">
                        <span className="truncate pr-2">
                          {it.name} <strong className="text-on-surface font-semibold">x{it.quantity}</strong>
                        </span>
                        <span className="font-semibold text-on-surface shrink-0">
                          Rp {(it.price * it.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}

                    {reservation && (
                      <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-on-surface-variant">
                        <div>
                          <span className="font-semibold text-primary block">
                            Reservasi: {reservation.zoneName}
                          </span>
                          <span className="text-[10px] text-outline">
                            {reservation.date} • {reservation.timeSlot} • {reservation.guestCount} Tamu
                          </span>
                        </div>
                        <span className="font-semibold text-on-surface shrink-0">
                          Rp {reservationTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-outline-variant/40 flex justify-between items-center text-base font-bold text-on-surface">
                    <span>Total Tagihan:</span>
                    <span className="text-primary text-xl font-extrabold">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || uploadingProof}
                    className="w-full py-4 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menerbitkan Tiket Pesanan...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">task_alt</span>
                        <span>Saya Sudah Bayar via QRIS</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-outline">
                    Tiket pesanan akan diterbitkan otomatis dengan status <em>Menunggu Konfirmasi</em>.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

