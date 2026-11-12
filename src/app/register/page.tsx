"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mendaftar akun.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran.");
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
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-on-surface-variant">
            Bergabunglah dengan komunitas pecinta kopi Cafetaria IDN
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 bg-surface-container-lowest py-8 px-6 shadow-warm rounded-2xl border border-outline-variant/50 sm:px-10 space-y-6">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-on-surface space-y-2">
            <p className="font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">tips_and_updates</span>
              <span>Masuk Tanpa Password untuk Klien</span>
            </p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Pelanggan kini tidak perlu membuat kata sandi baru. Cukup gunakan nama & nomor WhatsApp di halaman masuk klien untuk langsung memesan!
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs"
            >
              <span>Masuk Akun Klien Tanpa Password →</span>
            </Link>
          </div>
          {error && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 animate-shake"
            >
              <span className="material-symbols-outlined text-red-600 text-xl">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-on-surface"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  person
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Dimas Setiawan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-on-surface"
              >
                Alamat Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dimas@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-on-surface"
              >
                Kata Sandi (Minimal 6 Karakter)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold text-on-surface"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock_reset
                </span>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <span className="material-symbols-outlined text-base">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-primary flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

