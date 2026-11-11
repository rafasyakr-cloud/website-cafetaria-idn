"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface ArticleItem {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export default function News() {
  const [articles, setArticles] = useState<ArticleItem[]>(siteConfig.articles);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const mapped: ArticleItem[] = data.articles.map((item: any, idx: number) => {
            const dateObj = item.created_at ? new Date(item.created_at) : new Date();
            const formattedDate = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Terbaru";

            const words = (item.content || item.excerpt || "").split(/\s+/).length;
            const readMinutes = Math.max(1, Math.ceil(words / 150));

            return {
              id: item.id || `news-${idx}`,
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt,
              content: item.content,
              category: idx % 3 === 0 ? "Brewing Guide" : idx % 3 === 1 ? "Impact Story" : "Pastry & Menu",
              date: formattedDate,
              readTime: `${readMinutes} min baca`,
              image: item.thumbnail_path || "/images/menu/v60-gayo.jpg",
            };
          });
          setArticles(mapped);
        }
      } catch (err) {
        // Fallback to static articles from siteConfig
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchLiveNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard accessibility for modal (ESC key)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedArticle) {
        setSelectedArticle(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedArticle]);

  return (
    <section
      id="berita"
      className="py-20 lg:py-28 px-6 lg:px-10 bg-surface"
      aria-label="Berita dan Cerita Cafetaria IDN"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-xs text-primary uppercase font-bold tracking-wider">
              Jurnal & Wawasan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Cerita, Wawasan & Kabar Terbaru
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl">
              Eksplorasi dunia kopi specialty, resep bakery artisan, serta kegiatan komunitas Cafetaria IDN yang terhubung langsung ke database live.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Kelola di Dashboard</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/50 shadow-warm hover:shadow-warm-hover transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-primary font-semibold border border-outline-variant/40">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2.5">
                  <span className="text-xs text-outline block">
                    {article.date} • {article.readTime}
                  </span>
                  <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(article);
                    }}
                    className="inline-flex items-center gap-1 text-sm text-primary font-semibold group-hover:gap-2 transition-all cursor-pointer focus:outline-none focus:underline"
                  >
                    <span>Baca Selengkapnya</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center md:hidden pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-outline-variant text-sm font-semibold text-primary bg-surface-container-lowest hover:bg-surface-container"
          >
            <span>Kelola Artikel di Dashboard</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-outline-variant shadow-2xl p-6 sm:p-8 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-xs font-semibold text-primary">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-outline block">
                  {selectedArticle.date} • {selectedArticle.readTime} • Oleh Tim Cafetaria IDN
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Tutup artikel"
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <h3 id="modal-article-title" className="text-2xl sm:text-3xl font-bold text-on-surface leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-surface-container">
              <Image
                src={selectedArticle.image}
                alt={selectedArticle.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>

            <div className="space-y-4 text-on-surface-variant leading-relaxed text-sm sm:text-base">
              <p className="font-medium text-on-surface text-base sm:text-lg italic border-l-4 border-primary pl-4 py-1">
                &ldquo;{selectedArticle.excerpt}&rdquo;
              </p>
              <div className="pt-2 text-justify space-y-3">
                {selectedArticle.content ? (
                  selectedArticle.content.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Tutup Jurnal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
