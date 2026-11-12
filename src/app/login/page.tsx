"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  // Mode: "client" (default tanpa password) vs "admin" (dengan password)
  const [authMode, setAuthMode] = useState<"client" | "admin">("client");

  // Client form states
  const [clientName, setClientName] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");

  // Admin form states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit Handler Akun Klien (Tanpa Password)
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          whatsapp: clientWhatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk sebagai akun klien.");
      }

      // Berhasil masuk, arahkan ke target callbackUrl atau beranda
      window.location.href = callbackUrl || "/";
    } catch (err: any) {
      setError(err.message || "Terjadi kendala saat menghubungkan akun klien.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Guest Login
  const handleQuickGuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const res = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Pelanggan #${randomId}`,
          whatsapp: `0878${randomId}1234`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk mode tamu.");
      }

      window.location.href = callbackUrl || "/";
    } catch (err: any) {
      setError(err.message || "Terjadi kendala saat masuk mode tamu.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler Administrator (Dengan Password)
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Email atau kata sandi admin salah.");
      }

      if (data.user.role === "admin") {
        window.location.href = callbackUrl || "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat masuk akun admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block relative h-12 w-44">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            {authMode === "client" ? "Masuk Akun Klien" : "Masuk Administrator"}
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            {authMode === "client"
              ? "Akses pemesanan kopi & tiket pesanan Anda secara praktis tanpa kata sandi."
              : "Khusus pengelola gerai dan staf admin Cafetaria IDN."}
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 bg-surface-container-lowest py-8 px-6 shadow-warm rounded-3xl border border-outline-variant/50 sm:px-10 space-y-6">
          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface-container border border-outline-variant/40 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("client");
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === "client"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              <span>Akun Klien</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("admin");
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === "admin"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 animate-shake"
            >
              <span className="material-symbols-outlined text-red-600 text-xl shrink-0">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM 1: AKUN KLIEN / PENGUNJUNG (TANPA PASSWORD) */}
          {authMode === "client" ? (
            <form className="space-y-4" onSubmit={handleClientSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="client-name" className="block text-xs font-semibold text-on-surface">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                    badge
                  </span>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Raffasya Putra"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="client-wa" className="block text-xs font-semibold text-on-surface">
                  Nomor WhatsApp / HP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                    call
                  </span>
                  <input
                    id="client-wa"
                    type="tel"
                    required
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    placeholder="Contoh: 087864081772"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <span className="text-[11px] text-outline block">
                  Cukup nama & nomor WA, tanpa perlu membuat atau mengingat kata sandi.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk sebagai Klien</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleQuickGuest}
                  className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Atau Masuk Cepat sebagai Tamu (1-Klik)</span>
                </button>
              </div>
            </form>
          ) : (
            /* FORM 2: ADMINISTRATOR (DENGAN PASSWORD) */
            <form className="space-y-4" onSubmit={handleAdminSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="block text-xs font-semibold text-on-surface">
                  Email Administrator <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                    mail
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="block text-xs font-semibold text-on-surface">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    <span>Memverifikasi Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Dashboard Admin</span>
                    <span className="material-symbols-outlined text-base">login</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
