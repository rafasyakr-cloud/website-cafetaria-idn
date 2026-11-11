# Progres Proyek - IDN Cafetaria

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **Proyek Selesai 100% & Resmi Berjalan di Vercel — Beralih ke Mode Pemeliharaan (Maintenance)**

---

## Data Usaha
- **Nama Usaha:** IDN Cafetaria (Cafetaria IDN)
- **Pemilik / Founder:** Raffasya
- **Bidang:** Cafe Shop & Artisan Roastery
- **Konsep & Visi:** Tempat yang *aesthetic*, elegan, profesional, dan ramah Gen Z. Menggabungkan kenikmatan rasa biji kopi nusantara dengan kenyamanan ruang inspiratif untuk WFC, kumpul komunitas, dan pertemuan profesional.
- **Lokasi Maps:** [Google Maps Pin](https://maps.app.goo.gl/u6UETqg1WQm4dqPY9) (Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan)
- **Desain & Aset:** Mengadopsi sistem token dari `/design-reference` ("Warm Artisanal Hospitality").

---

## Checklist Progres

- [x] Inisiasi (data usaha & rancangan desain terintegrasi)
- [x] **STEP 1 - Landing Page & Navigasi Multi-Halaman**
  - [x] Preloader Animasi: Steaming coffee cup SVG, progress bar persentase (0%-100%), copy status puitis, dan transisi fade-out halus.
  - [x] Aset Gambar Lokal: Seluruh menu dan suasana tempat tersimpan di `public/images/menu/` dan `public/images/spaces/`.
  - [x] Hero (Headline kuat, 2 tombol CTA, social proof 4.9/5, bento cards, floating badges).
  - [x] Katalog Menu Interaktif (Kategori tabs, live search, filter tag, kartu harga, notifikasi pesan).
  - [x] Showcase Ruang & Fasilitas (4 zona aesthetic + 6 fasilitas penunjang WFC/komunitas).
  - [x] Halaman Khusus `/menu` & Halaman Khusus `/tempat`.
  - [x] About (Kisah petani nusantara, quote Raffasya sang founder & head roaster, 3 pilar).
  - [x] Services (4 kartu layanan: Dine-in, Catering, Sewa Ruang, Wholesale + banner konsultasi B2B).
  - [x] Contact + Google Maps (Info kontak, interactive contact form, iframe Google Maps Senopati).
  - [x] Responsif & aksesibilitas (Mobile 375px, Tablet 768px, Desktop 1280px, keyboard focus, ARIA tags, semantic HTML).
  - [x] Build produksi terverifikasi tanpa error (`npm run build`).
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 1 disetujui).

- [x] **STEP 2 - User Management, Role Access Control, Admin Dashboard & Database**
  - [x] File Apps Script: `code.gs` & `setup.gs` (Inisiasi otomatis 4 tabel: `Roles`, `Users`, `News`, `Orders`).
  - [x] Keamanan & Token: `.gitignore`, `APPS_SCRIPT_SECRET`, cookie sesi JWT `jose` httpOnly.
  - [x] Mesin Database Hybrid: Mendukung Google Spreadsheet dan local persistent store (`.data/db.json`).
  - [x] Autentikasi: Login, Register, Role-Based Access Control (`admin` & `user`).
  - [x] Dashboard Admin: Tab Overview, Manajemen User, Manajemen Role, CRUD Berita, Ganti Password.
  - [x] Upload Media Lokal (`public/uploads/`).
  - [x] Berita Live terhubung ke Landing Page dengan modal baca artikel interaktif.
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 2 disetujui).

- [x] **STEP 3 - Sistem Pemesanan & Pembayaran QRIS (Alur Terpadu Menu F&B & Reservasi Ruang)**
  - [x] Keranjang Belanja Interaktif (Cart Drawer `CartDrawer.tsx` & `CartContext.tsx`) dengan penyimpanan persisten di `localStorage`.
  - [x] Integrasi tombol pemesanan F&B di katalog menu dan reservasi ruang di showcase tempat.
  - [x] Template Barcode QRIS Resmi Standar Nasional (`public/images/qris.svg`).
  - [x] Halaman Checkout & Pembayaran QRIS (`/checkout`) dengan panduan m-Banking/e-Wallet & upload struk.
  - [x] Halaman & Menu "Pesanan Anda" (`/pesanan`) khusus pengguna terautentikasi (dilindungi server & middleware).
  - [x] Tab "Manajemen Pesanan" di Dashboard Admin (`/dashboard`) dengan filter, verifikasi kasir, tolak pesanan dengan alasan, selesaikan pesanan, dan pintasan chat WhatsApp pemesan (`wa.me`).
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 3 disetujui).

- [x] **STEP 4 - Persiapan Rilis, QA Akhir, Panduan Vercel & Maintenance**
  - [x] **Halaman 404 Kustom:** Desain artisanal bertema kopi (`src/app/not-found.tsx`).
  - [x] **SEO Dinamis & Indeksasi:** File `src/app/robots.ts` dan `src/app/sitemap.ts` aktif (melindungi rute dashboard admin dari mesin pencari).
  - [x] **Favicon & Metadata:** Aset favicon di `public/favicon.ico` dan Open Graph card di `src/app/layout.tsx`.
  - [x] **Verifikasi Keamanan Git:** Berkas `.env*`, `code.gs`, `setup.gs`, dan `public/uploads/*` terbukti 100% aman di `.gitignore`.
  - [x] **Build Produksi Final:** `npm run build` sukses 100% dengan 26 rute aktif tanpa error.
  - [x] **Dokumen Maintenance (`documentation/MAINTENANCE.md`):** Backlog fitur, catatan bug, dan riwayat pembaruan sistem.
  - [x] Deploy ke Vercel (Berhasil diluncurkan ke production oleh pengguna).
  - [x] Ganti kata sandi admin default sebelum go-live (Tersedia di tab Keamanan Akun).
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Final disetujui & website online).

---

## Checklist QA Sebelum Rilis
- [x] **Build Produksi Bersih:** `npm run build` berhasil 0 error (26 rute statis & dinamis).
- [x] **Responsif Lintas Perangkat:** Teruji pada viewport 375px (Mobile), 768px (Tablet), dan 1280px+ (Desktop).
- [x] **Aksesibilitas & Kontras:** Semantic heading (`h1`-`h4`), ARIA labels pada drawer/modal, fokus keyboard terlihat, alt text gambar terisi.
- [x] **Keamanan Rute & Database:** Middleware memblokir akses dashboard bagi non-admin; API admin terlindungi; password di-hash dengan bcryptjs.
- [x] **Rahasia Terlindungi:** Kunci token dan file spreadsheet backend ada di `.gitignore`.
- [x] **SEO & 404:** Metadata Open Graph lengkap, robots.txt memblokir crawler ke rute admin, sitemap.xml otomatis.

---

## Panduan Langkah Demi Langkah Deploy ke Vercel

### Langkah 1: Push Kode ke GitHub
1. Buka terminal atau aplikasi GitHub Desktop.
2. Inisiasi git (jika belum) dan lakukan commit:
   ```bash
   git add .
   git commit -m "feat: complete Cafetaria IDN company profile with cart, QRIS orders, and admin dashboard"
   ```
3. Buat repository baru di [github.com](https://github.com/new) (pilih *Private* atau *Public*).
4. Hubungkan dan push kode Anda ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME/cafetaria-idn.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 2: Impor ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login (bisa login langsung menggunakan akun GitHub Anda).
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari repository `cafetaria-idn` yang baru saja Anda push, lalu klik **"Import"**.
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.

### Langkah 3: Masukkan Environment Variables di Vercel
Pada bagian **Environment Variables** sebelum klik Deploy, tambahkan variabel berikut (samakan dengan isi `.env.local` Anda):
- **`APPS_SCRIPT_URL`**: URL Web App Google Apps Script Anda (format `https://script.google.com/macros/s/.../exec`). Jika belum dibuat, biarkan kosong agar sistem otomatis menggunakan local store.
- **`APPS_SCRIPT_SECRET`**: Token rahasia yang sama dengan di Script Properties Google Apps Script.
- **`AUTH_SECRET`**: String rahasia acak untuk penandatanganan sesi JWT (misal: `cafetaria-jwt-secret-produksi-2026-secure-key`).
- **`NEXT_PUBLIC_APP_URL`**: URL domain Vercel Anda (misal `https://cafetaria-idn.vercel.app`).

### Langkah 4: Klik Deploy!
1. Klik tombol **"Deploy"**.
2. Vercel akan otomatis membangun (*build*) aplikasi Anda dalam waktu sekitar 1-2 menit.
3. Setelah selesai, website IDN Cafetaria Anda resmi online dan dapat diakses dari seluruh dunia!

### Langkah 5: Ganti Password Admin
1. Buka URL website yang diberikan Vercel, masuk ke halaman `/login`.
2. Login dengan `admin@gmail.com` dan `123456`.
3. Buka tab **Keamanan Akun** di dashboard dan ubah password menjadi kata sandi yang kuat dan aman.
