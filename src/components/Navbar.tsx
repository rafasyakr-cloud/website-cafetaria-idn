"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        // Not logged in
      }
    }
    checkAuth();
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/40"
            : "bg-surface/80 backdrop-blur-sm border-b border-outline-variant/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group active:scale-95 transition-transform"
            aria-label={`${siteConfig.name} Beranda`}
          >
            <div className="relative h-10 w-28 sm:w-36 flex items-center">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Central Nav Links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Navigasi Utama"
          >
            {siteConfig.navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors relative py-1 focus-visible:ring-1 focus-visible:ring-primary rounded"
              >
                {item.label}
              </Link>
            ))}

            {/* Menu Pesanan Anda jika sudah login */}
            {user && (
              <Link
                href="/pesanan"
                className="text-primary hover:text-primary-hover font-semibold text-sm transition-colors flex items-center gap-1.5 py-1"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>Pesanan Anda</span>
              </Link>
            )}
          </nav>

          {/* Trailing Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Interactive Cart Button */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container border border-outline-variant/60 hover:bg-surface-container-high text-on-surface transition-all active:scale-95 duration-150 shadow-xs"
              aria-label="Buka Keranjang Pesanan"
            >
              <span className="material-symbols-outlined text-primary text-xl">shopping_bag</span>
              <span className="font-semibold text-xs hidden sm:inline">Pesanan</span>
              {itemCount > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs px-4 py-2 rounded-full transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    <span>Dashboard</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Keluar Akun"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-red-700 transition-colors"
                  aria-label="Keluar dari akun"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs px-5 py-2 rounded-full transition-all shadow-sm active:scale-95 duration-150"
              >
                <span>Masuk</span>
                <span className="material-symbols-outlined text-base">login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden fixed inset-x-0 top-20 bg-surface border-b border-outline-variant/60 shadow-xl px-6 py-6 transition-all duration-200"
          >
            <nav className="flex flex-col space-y-4" aria-label="Menu Mobile">
              {siteConfig.navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-on-surface hover:text-primary font-medium text-base py-2 border-b border-outline-variant/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <Link
                  href="/pesanan"
                  className="text-primary font-semibold text-base py-2 border-b border-outline-variant/20 transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                  <span>Pesanan Anda</span>
                </Link>
              )}

              <div className="pt-2">
                {user ? (
                  <div className="space-y-2">
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard"
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm py-3 rounded-full shadow-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                        <span>Buka Dashboard Admin</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-outline-variant hover:bg-surface-container text-red-700 font-medium text-sm py-2.5 rounded-full"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-medium text-sm py-3 rounded-full shadow-sm active:scale-95"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Masuk ke Akun</span>
                    <span className="material-symbols-outlined text-base">login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
