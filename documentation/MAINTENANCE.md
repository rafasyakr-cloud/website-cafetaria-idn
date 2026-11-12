# Maintenance Log - Cafetaria IDN

Dokumen ini mencatat rencana fitur mendatang (backlog), catatan isu/bug, dan riwayat pembaruan sistem Cafetaria IDN.

---

## 1. Backlog Fitur (Rencana Lanjutan)

- [ ] **Payment Gateway Otomatis (Midtrans / Xendit):**
  - Mengintegrasikan pembayaran otomatis (Virtual Account, QRIS otomatis dengan webhook notifikasi langsung tanpa perlu konfirmasi manual).
- [ ] **Notifikasi Otomatis WhatsApp / Email:**
  - Integrasi WhatsApp Cloud API / Fonnte / Resend untuk mengirim invoice dan status pesanan otomatis ke WhatsApp pembeli saat status diubah menjadi *dikonfirmasi*.
- [ ] **Migrasi Penyimpanan Media ke Cloud:**
  - Menghubungkan modul `src/lib/storage.ts` ke Vercel Blob atau Cloudinary agar file upload thumbnail berita dan struk transfer tetap tersimpan permanen di serverless Vercel.
- [ ] **Cetak Struk Kasir / Thermal Printer:**
  - Fitur cetak pesanan format thermal 58mm/80mm langsung dari dashboard admin untuk meja barista & dapur.

---

## 2. Bug Diketahui & Status Penanganan

- [x] **[10 Nov 2026] Miskomunikasi Role ID saat Login Admin:**
  - *Deskripsi:* Akun default `admin@gmail.com` sempat membaca role sebagai `user` karena perbedaan identifier role, menyebabkan pengguna terlempar kembali ke beranda web.
  - *Status:* **Telah diperbaiki 100%** di rute `api/auth/login` dan database local/remote.
- [x] **[11 Nov 2026] Type error 'tag' pada SpaceItem di CartDrawer:**
  - *Deskripsi:* Panggilan `s.tag` diganti menjadi `s.badge` sesuai interface `SpaceItem` di `site.ts`.
  - *Status:* **Telah diperbaiki 100%** dan terverifikasi di build produksi.
- [x] **[11 Nov 2026] Client-side exception saat membuka tab Manajemen Pemesanan di Dashboard:**
  - *Deskripsi:* Tipe data WhatsApp dari Google Spreadsheet terbaca sebagai angka (`typeof whatsapp === "number"`), sehingga fungsi `.replace()` dan `.includes()` memicu `TypeError: not a function` yang merusak render komponen di browser.
  - *Status:* **Telah diperbaiki 100%** dengan helper `safeStr()`, `parseOrderItems()`, dan `safeFormatOrderDate()`.
- [x] **[11 Nov 2026] Berita baru dari admin tidak muncul di website publik:**
  - *Deskripsi:* Rute `/api/news` ter-cache statis oleh Next.js/Vercel saat proses build, sehingga artikel baru yang disimpan ke Google Spreadsheet tidak langsung terbaca di halaman depan.
  - *Status:* **Telah diperbaiki 100%** dengan menyetel `dynamic = "force-dynamic"`, `revalidate = 0`, header `Cache-Control: no-store`, serta parameter timestamp di sisi klien.

---

## 3. Riwayat Perubahan (Changelog)

- **11 November 2026 - PEMBARUAN SISTEM: Login Klien Tanpa Password, Live News Sync & Update Kontak WA**
  - **Nomor Kontak Resmi:** Mengubah seluruh tautan dan nomor WhatsApp bantuan/kasir ke **`087864081772`** (`wa.me/6287864081772`) di `site.ts`, `Contact.tsx`, `pesanan/page.tsx`, `checkout/page.tsx`, dan `dashboard/page.tsx`.
  - **Login Klien Tanpa Kata Sandi:** Pengunjung kini dapat masuk sebagai akun klien cukup dengan nama dan nomor WhatsApp tanpa perlu membuat atau mengingat kata sandi. Menyediakan opsi masuk cepat (1-klik tamu). Tab terpisah untuk staf Administrator.
  - **Perbaikan Manajemen Pesanan Dashboard:** Menghapus potensi crash exception pada tab pesanan saat memproses baris Google Spreadsheet.
  - **Sinkronisasi Berita Live:** Memastikan artikel jurnal/berita yang diterbitkan dari admin langsung tampil secara instan dan responsif di beranda utama website.

- **11 November 2026 - PELUNCURAN PRODUKSI: Resmi Online di Vercel**
  - Website Cafetaria IDN berhasil dideploy ke infrastruktur serverless Vercel.
  - Seluruh sistem (Landing Page, Menu, Tempat, Autentikasi, Cart Drawer, Checkout QRIS, Tiket Pelanggan, dan Dashboard Admin) aktif dan dapat diakses publik.
  - Memulai fase pemeliharaan (Mode Maintenance).

- **11 November 2026 - STEP 4: Persiapan Rilis & Deploy ke Vercel**
  - Menambahkan halaman 404 Kustom bertema kopi artisanal ([`src/app/not-found.tsx`](file:///Users/macbookpro/Documents/cafetaria%20IDN%20/src/app/not-found.tsx)).
  - Menambahkan generator dynamic SEO `robots.ts` dan `sitemap.ts`.
  - Memverifikasi checklist keamanan dan panduan deploy Vercel di `documentation/SETUP.md`.
  - Membuat dokumen `documentation/MAINTENANCE.md`.

- **11 November 2026 - STEP 3: Sistem Pemesanan & Pembayaran QRIS**
  - Membangun `CartContext` dan `CartDrawer` interaktif yang persisten di `localStorage`.
  - Integrasi tombol pemesanan F&B di katalog menu dan reservasi ruang di showcase tempat.
  - Membuat template barcode QRIS vektor standar nasional (`public/images/qris.svg`).
  - Membangun halaman checkout QRIS (`/checkout`) dengan upload bukti transfer.
  - Membangun halaman tiket pelanggan (`/pesanan`) dengan proteksi sesi server.
  - Membangun tab Manajemen Pesanan di Dashboard Admin (`/dashboard`) dengan filter, verifikasi kasir, tolak pesanan dengan alasan, dan pintasan chat WhatsApp pemesan (`wa.me`).

- **10 November 2026 - STEP 2: User Management & Dashboard Google Spreadsheet**
  - Implementasi Google Apps Script (`code.gs` & `setup.gs`) dengan fungsi idempoten `initTables()`.
  - Arsitektur database hybrid (`src/lib/db.ts`) dengan fallback persistent local JSON store (`.data/db.json`).
  - Sistem autentikasi kata sandi ter-hash bcrypt dan cookie sesi JWT `jose` httpOnly.
  - Dashboard admin: Ringkasan, Manajemen User, Manajemen Role, CRUD Berita live, Ganti Password.

- **10 November 2026 - STEP 1: Landing Page & Multi-Halaman**
  - Ekstraksi design token "Warm Artisanal Hospitality" ke Tailwind CSS & CSS Variables.
  - Preloader animasi seduh kopi, Hero section, Menu interaktif, Showcase Ruang & Fasilitas, Kisah Petani & Raffasya, Layanan, Kontak & Peta Senopati.
  - Dedicated multi-page: `/menu` dan `/tempat`.

