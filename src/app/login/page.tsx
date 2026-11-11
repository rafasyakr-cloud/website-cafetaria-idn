"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali email dan password.");
      }

      if (data.user.role === "admin") {
        window.location.href = callbackUrl || "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat masuk.");
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
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs text-on-surface-variant">
            Akses dashboard admin atau kelola akun pelanggan Anda
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 bg-surface-container-lowest py-8 px-6 shadow-warm rounded-2xl border border-outline-variant/50 sm:px-10 space-y-6">
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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-on-surface"
              >
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <span className="material-symbols-outlined text-base">login</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Daftar Akun Baru
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

