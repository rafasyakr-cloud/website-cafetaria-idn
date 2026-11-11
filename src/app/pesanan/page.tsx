"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OrderRecord } from "@/lib/db";

export default function PesananPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justOrderedCode = searchParams.get("code");
  const isSuccess = searchParams.get("success") === "true";

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyOrders() {
      try {
        const res = await fetch("/api/orders/my-orders");
        if (res.status === 401) {
          router.push("/login?callbackUrl=/pesanan");
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal memuat pesanan.");
        }
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Gagal memuat pesanan.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyOrders();
  }, [router]);

  const getStatusBadge = (status: OrderRecord["status"]) => {
    switch (status) {
      case "menunggu_konfirmasi":
        return {
          label: "Menunggu Konfirmasi",
          bgColor: "bg-amber-50 text-amber-800 border-amber-200",
          icon: "hourglass_top",
        };
      case "dikonfirmasi":
        return {
          label: "Pembayaran Dikonfirmasi",
          bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: "check_circle",
        };
      case "selesai":
        return {
          label: "Pesanan Selesai",
          bgColor: "bg-blue-50 text-blue-800 border-blue-200",
          icon: "task_alt",
        };
      case "ditolak":
        return {
          label: "Dibatalkan / Ditolak",
          bgColor: "bg-red-50 text-red-800 border-red-200",
          icon: "cancel",
        };
      default:
        return {
          label: status,
          bgColor: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "info",
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Pesanan & Tiket Anda
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Pantau status verifikasi pembayaran QRIS dan kesiapan sajian kopi atau reservasi meja Anda.
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-sm transition-transform active:scale-95 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Pesan Menu Lain</span>
            </Link>
          </div>

          {/* Success Banner if freshly checked out */}
          {isSuccess && justOrderedCode && (
            <div
              role="alert"
              className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-4 shadow-sm animate-fadeIn"
            >
              <span className="material-symbols-outlined text-emerald-600 text-2xl shrink-0">
                check_circle
              </span>
              <div className="space-y-1">
                <p className="font-bold text-emerald-950">
                  Tiket Pesanan #{justOrderedCode} Berhasil Diterbitkan!
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  Terima kasih! Bukti transfer Anda telah diterima oleh sistem dan sedang diverifikasi kasir Cafetaria IDN. Harap tunggu konfirmasi di bawah ini.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-red-600 text-xl">error</span>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-on-surface-variant font-medium">
                Memuat riwayat pesanan Anda...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-12 text-center space-y-5 shadow-warm">
              <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-on-surface">Belum Ada Pesanan</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                  Anda belum pernah memesan kopi, pastry, atau melakukan reservasi ruang di Cafetaria IDN.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-sm transition-transform active:scale-95"
              >
                <span>Mulai Eksplorasi Menu</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status);
                let parsedItems: any = {};
                try {
                  parsedItems = JSON.parse(order.items_json);
                } catch (e) {
                  parsedItems = {};
                }

                const fnbList = Array.isArray(parsedItems.fnbItems) ? parsedItems.fnbItems : [];
                const resDetail = parsedItems.reservationDetails;

                const dateFormatted = new Date(order.created_at).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <article
                    key={order.id}
                    className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 overflow-hidden shadow-warm transition-all duration-200 hover:shadow-warm-hover"
                  >
                    {/* Top Ticket Header */}
                    <div className="p-6 border-b border-outline-variant/40 bg-surface-container-low/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-outline font-mono">Kode Tiket:</span>
                          <span className="font-mono font-bold text-base text-primary">
                            #{order.order_code}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{dateFormatted}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badge.bgColor}`}
                        >
                          <span className="material-symbols-outlined text-base">{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Notification Callout based on Status */}
                    {order.status === "menunggu_konfirmasi" && (
                      <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-3.5 text-xs text-amber-900 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-amber-700 text-lg">
                          schedule
                        </span>
                        <span>
                          Pesanan Anda sedang dalam antrean verifikasi kasir Cafetaria IDN. Harap tetap di halaman ini atau pantau WhatsApp Anda.
                        </span>
                      </div>
                    )}

                    {order.status === "dikonfirmasi" && (
                      <div className="bg-emerald-50/90 border-b border-emerald-200 px-6 py-4 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
                        <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0">
                          verified
                        </span>
                        <div>
                          <p className="font-bold">Selamat, pembayaran Anda telah dikonfirmasi!</p>
                          <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                            Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp, atau Anda dapat langsung menuju ke Bar / Meja gerai Flagship Senopati dengan menunjukkan kode tiket di atas.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status === "ditolak" && (
                      <div className="bg-red-50 border-b border-red-200 px-6 py-3.5 text-xs text-red-900 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-red-600 text-lg">
                          report_problem
                        </span>
                        <span>
                          Pesanan dibatalkan/ditolak. Alasan:{" "}
                          <strong>{order.rejection_reason || "Kendala teknis ketersediaan atau pembayaran tidak sesuai."}</strong>
                        </span>
                      </div>
                    )}

                    {order.status === "selesai" && (
                      <div className="bg-blue-50/80 border-b border-blue-200 px-6 py-3.5 text-xs text-blue-900 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-blue-600 text-lg">
                          celebration
                        </span>
                        <span>
                          Selesai! Terima kasih atas kunjungan Anda di Cafetaria IDN. Sampai jumpa di cangkir seduhan berikutnya!
                        </span>
                      </div>
                    )}

                    {/* Order Details Body */}
                    <div className="p-6 space-y-4">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-surface p-4 rounded-2xl border border-outline-variant/40">
                        <div>
                          <span className="text-[10px] text-outline uppercase font-semibold block">Pemesan</span>
                          <span className="font-semibold text-on-surface">{order.customer_name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline uppercase font-semibold block">WhatsApp</span>
                          <span className="font-semibold text-on-surface">{order.whatsapp}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline uppercase font-semibold block">Tipe Layanan</span>
                          <span className="font-semibold text-primary capitalize">
                            {order.order_type.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      {fnbList.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider text-outline">
                            Daftar Menu F&B:
                          </h4>
                          <div className="divide-y divide-outline-variant/30 text-xs">
                            {fnbList.map((item: any, idx: number) => (
                              <div key={idx} className="py-2 flex justify-between items-center text-on-surface">
                                <div>
                                  <span className="font-semibold">{item.name}</span>
                                  <span className="text-outline text-[11px] ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-semibold">
                                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reservation Details */}
                      {resDetail && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider text-outline">
                            Detail Reservasi Ruang:
                          </h4>
                          <div className="p-3.5 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 text-xs space-y-1">
                            <p className="font-bold text-secondary">{resDetail.zoneName}</p>
                            <p className="text-on-surface-variant">
                              Jadwal: {resDetail.date} ({resDetail.timeSlot}) • {resDetail.guestCount} Orang Tamu
                            </p>
                            {resDetail.specialRequest && (
                              <p className="text-outline italic text-[11px]">
                                Catatan: &ldquo;{resDetail.specialRequest}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {order.notes && (
                        <p className="text-xs text-on-surface-variant italic bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                          Catatan tambahan: &ldquo;{order.notes}&rdquo;
                        </p>
                      )}

                      {/* Footer Info */}
                      <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {order.payment_proof_path && (
                            <a
                              href={order.payment_proof_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>Lihat Bukti Transfer</span>
                            </a>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-outline block">Total Pembayaran:</span>
                          <span className="text-lg font-extrabold text-primary">
                            Rp {order.total_amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Help Contact Banner */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-on-surface">Butuh bantuan terkait pesanan Anda?</h4>
              <p className="text-xs text-on-surface-variant">
                Tim kasir & barista Cafetaria IDN siap membantu melalui kontak resmi kami.
              </p>
            </div>
            <a
              href="https://wa.me/6281298765432?text=Halo%20Cafetaria%20IDN,%20saya%20ingin%20menanyakan%20status%20pesanan%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm transition-transform active:scale-95 whitespace-nowrap self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>Hubungi Kasir via WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

