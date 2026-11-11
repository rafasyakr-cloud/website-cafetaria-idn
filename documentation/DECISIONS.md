# Keputusan Desain & Arsitektur - IDN Cafetaria

## 1. Stack Teknologi
- **Framework:** Next.js 14/15 (App Router, React Server Components & Client Components seperlunya).
- **Styling:** Tailwind CSS + CSS Variables berdasarkan design tokens "Warm Artisanal Hospitality".
- **Icons:** Material Symbols Outlined (sesuai design reference).
- **Font:** Plus Jakarta Sans (Google Fonts fallback sans-serif).
- **Target Deployment:** Vercel.

---

## 2. Design System Tokens (Warm Artisanal Hospitality)
- **Primary:** `#845000` (Amber Crema `#C27803` aksen)
- **Secondary:** `#73584e` / `#2B1810` (Deep Espresso)
- **Background / Surface:** `#fcf9f4` / `#FAF7F2` (Cream Froth)
- **Cards / Containers:** `#FFFFFF` dengan border halus `#E5E0D8` dan ambient sun-cast warm shadows.
- **Border Radius:** Pill (`9999px`) untuk tombol dan badge; `1rem` (16px) untuk kartu bento; `0.5rem` (8px) untuk input/chip.
- **Tipografi:** Plus Jakarta Sans dengan rhythm hierarki judul tight letter spacing (`-0.01em` hingga `-0.02em`) dan body text bernapas lega (`1.5` - `1.6` line-height).

---

## 3. Struktur Konten Terpusat
- Seluruh teks, link, jam buka, kontak, dan konfigurasi umum disimpan di `src/config/site.ts` agar mudah dikelola dan dimodifikasi tanpa mengubah kode tampilan.

---

## 4. Keputusan Arsitektur Step 2 (Database & Autentikasi)

### A. Pola Arsitektur Database Google Spreadsheet
- **Lapisan Keamanan Proksi:** Browser klien **tidak pernah** memanggil Google Apps Script secara langsung. Semua komunikasi disalurkan melalui rute API server Next.js (`/api/admin/*` dan `/api/auth/*`) menggunakan token rahasia bersama (`APPS_SCRIPT_SECRET`).
- **Pola Hybrid Adapter (`src/lib/db.ts`):** 
  - Jika environment variable `APPS_SCRIPT_URL` terpasang, sistem melakukan transmisi data ke Web App Apps Script.
  - Jika belum terpasang (misal saat pengujian lokal atau internet terbatas), sistem beralih otomatis ke *local persistent JSON store* di `.data/db.json`. Hal ini memastikan pengembangan dan pengujian tetap 100% lancar tanpa hambatan setup eksternal.

### B. Autentikasi & Keamanan Sesi
- **Hashing Kata Sandi:** Menggunakan `bcryptjs` dengan *salt rounds* 10 sebelum disimpan. Password tidak pernah disimpan dalam format teks polos baik di lokal maupun di Google Spreadsheet.
- **Sesi Pengguna:** Menggunakan token JWT bertanda tangan (`jose`) yang disimpan dalam cookie `cafetaria_session` dengan atribut `httpOnly`, `sameSite: lax`, dan `secure` pada mode produksi. Ini memitigasi risiko pencurian sesi melalui XSS.
- **Middleware Proteksi:** `src/middleware.ts` memverifikasi token dan hak peran (role `admin`) sebelum memberikan akses ke halaman `/dashboard` atau endpoint `/api/admin/*`. Akses tidak sah akan dialihkan secara otomatis ke `/login`.

### C. Manajemen Peran & Integritas Pengguna
- **Peran Bawaan (`is_system = true`):** Role `admin` dan `user` dilindungi dari penghapusan demi menjaga integritas sistem.
- **Perlindungan Akun Admin Terakhir:** Sistem mencegah admin menghapus akunnya sendiri atau menghapus admin terakhir yang aktif untuk mencegah *lockout*.

### D. Penanganan Media & Unggahan File
- **Abstraksi Modul (`src/lib/storage.ts`):** File disimpan ke folder `public/uploads/` dengan batas ukuran 5MB dan validasi MIME type (JPEG, PNG, WebP).
- **Kesiapan Cloud Storage (Step 4):** Karena disk Vercel bersifat *ephemeral*, antarmuka penyimpanan dirancang abstrak sehingga migrasi ke Vercel Blob atau Cloudinary di masa mendatang cukup dilakukan pada satu file modul saja.

---

## 5. Keputusan Arsitektur Step 3 (Sistem Pemesanan & Pembayaran QRIS)

### A. Alur Pemesanan Terpadu (F&B + Reservasi Meja)
- **Desain Keranjang Terpusat (`src/context/CartContext.tsx`):**
  Menggunakan React Context API yang di-persistensikan ke `localStorage` (`cafetaria_cart_v1`). Hal ini mencegah item keranjang belanja atau detail reservasi hilang saat pengguna dialihkan untuk login atau melakukan *refresh* browser.
- **Dukungan Dua Jenis Kebutuhan:**
  Pelanggan dapat memesan makanan & minuman saja, reservasi ruang saja, ataupun mengombinasikan keduanya dalam satu nomor tiket invoice.

### B. Pembayaran Digital QRIS Standar Nasional
- **Desain Template QRIS Modular (`public/images/qris.svg`):**
  Dibuat menggunakan format SVG vector tajam berstandar QRIS Indonesia (NMID Cafetaria IDN Senopati, logo GPN, instruksi scan lintas bank). Pengguna dapat dengan mudah mengganti berkas ini dengan QRIS resmi bank tanpa perlu mengubah kode komponen.
- **Sistem Tiket Pesanan (`OrderRecord`):**
  Setiap pesanan menghasilkan kode tiket unik ramah baca (misal: `IDN-20261111-8492`) dan langsung tersimpan dengan status awal `menunggu_konfirmasi`.

### C. Keamanan & Pembatasan Akses Tiket
- **Pemeriksaan Hak Milik Tiket di Sisi Server:**
  Endpoint `/api/orders/my-orders` menyaring tiket hanya berdasarkan `user_id === session.id` yang diekstrak langsung dari token JWT server (bukan dari parameter URL klien), sehingga pengguna tidak dapat mengintip pesanan orang lain.
- **Middleware Proteksi Rute Pemesanan:**
  Rute `/pesanan` dan `/checkout` dilindungi oleh `src/middleware.ts`. Pengguna yang belum terautentikasi otomatis diarahkan ke halaman login dengan parameter `callbackUrl` yang mengembalikan mereka ke form pemesanan secara mulus setelah login.
- **Eksklusivitas Perubahan Status:**
  Hanya akun dengan peran `admin` yang berhak memanggil rute `/api/admin/orders/[id]` untuk mengonfirmasi pembayaran, menyelesaikan pesanan, atau membatalkan pesanan.
