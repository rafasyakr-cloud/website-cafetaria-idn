# Panduan Setup Lengkap - IDN Cafetaria

Dokumen ini menjelaskan cara menjalankan aplikasi secara lokal dan menghubungkannya dengan backend **Google Apps Script & Google Spreadsheet** sebagai database.

---

## 1. Prasyarat Sistem
- **Node.js**: Versi 18 ke atas (Direkomendasikan v20+)
- **npm** atau package manager yang kompatibel
- **Akun Google** (untuk Google Drive, Google Sheets, dan Google Apps Script)

---

## 2. Instalasi dan Menjalankan Proyek Lokal

```bash
# 1. Pindah ke direktori proyek
cd "cafetaria IDN"

# 2. Instal seluruh paket dependensi
npm install

# 3. Buat file .env.local dari .env.example
cp .env.example .env.local

# 4. Jalankan server development
npm run dev
```

Buka peramban (browser) di alamat:
- **Beranda Landing Page:** `http://localhost:3000`
- **Halaman Menu:** `http://localhost:3000/menu`
- **Halaman Suasana Ruang:** `http://localhost:3000/tempat`
- **Halaman Masuk (Login):** `http://localhost:3000/login`
- **Halaman Pendaftaran (Register):** `http://localhost:3000/register`
- **Dashboard Admin:** `http://localhost:3000/dashboard`

> **Catatan Pengujian Cepat:**  
> Jika variabel `APPS_SCRIPT_URL` belum diisi di `.env.local`, sistem secara otomatis menggunakan mesin database lokal (`.data/db.json`). Anda dapat langsung login menggunakan:
> - **Email:** `admin@gmail.com`
> - **Password:** `123456`

---

## 3. Menghubungkan Google Spreadsheet sebagai Database

Untuk menghubungkan database live ke Google Spreadsheet, ikuti langkah mudah berikut:

### Langkah A: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama file spreadsheet, misalnya: **`Database Cafetaria IDN`**.

### Langkah B: Pasang Kode Apps Script
1. Di menu Google Sheets, klik **Extensions > Apps Script** (Ekstensi > Apps Script).
2. Anda akan melihat editor kode Apps Script.
3. Ganti nama file default `Code.gs` atau buat file baru bernama **`code.gs`**:
   - Buka file `code.gs` yang ada di root direktori proyek ini.
   - Salin seluruh kodenya dan tempelkan ke editor Apps Script.
4. Buat file script kedua dengan klik tanda `+` di samping Files > pilih **Script**, beri nama **`setup.gs`**:
   - Buka file `setup.gs` di root direktori proyek ini.
   - Salin seluruh kodenya dan tempelkan ke file `setup.gs` di editor Apps Script.
5. Klik ikon simpan (Save project / `Ctrl+S` / `Cmd+S`).

### Langkah C: Inisiasi Tabel Otomatis (`initTables`)
1. Pada dropdown daftar fungsi di bagian atas editor Apps Script, pilih fungsi **`initTables`**.
2. Klik tombol **Run** (Jalankan).
3. Jika Google meminta izin otorisasi akses (*Review Permissions*):
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) lalu klik **Go to Cafetaria IDN Backend (unsafe)** / Buka.
   - Klik **Allow** (Izinkan).
4. Fungsi `initTables` akan otomatis membuat 4 sheet lengkap dengan header dan data awal:
   - `Roles` (Sudah terisi role `admin` & `user`)
   - `Users` (Sudah terisi admin default `admin@gmail.com`)
   - `News` (Sudah terisi 3 artikel jurnal artisan)
   - `Orders` (Disiapkan untuk sistem pemesanan)
5. **Idempoten:** Anda dapat menjalankan fungsi `initTables` kapan saja tanpa khawatir data yang sudah ada terhapus atau duplikat.

### Langkah D: Atur Script Properties (Token Rahasia)
1. Di bilah menu sebelah kiri editor Apps Script, klik **Project Settings** (ikon roda gigi ⚙️).
2. Gulir ke bawah hingga bagian **Script Properties**, lalu klik **Add script property**.
3. Masukkan:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** Buat string rahasia yang kuat (misal: `cafetaria-super-secure-token-2026-xyz`).
4. Klik **Save script properties**.

### Langkah E: Publikasikan sebagai Web App
1. Di pojok kanan atas, klik tombol biru **Deploy** > pilih **New deployment**.
2. Klik ikon gerigi di samping *Select type* > pilih **Web app**.
3. Isi konfigurasi deployment:
   - **Description:** `Cafetaria IDN Production Backend v1`
   - **Execute as:** `Me (akun google Anda)`
   - **Who has access:** `Anyone` (Siapa saja, agar server Next.js dapat mengirim request).
4. Klik **Deploy**.
5. Salin **Web app URL** yang dihasilkan (format: `https://script.google.com/macros/s/AKfycb.../exec`).

### Langkah F: Hubungkan ke File `.env.local`
Buka file `.env.local` di folder proyek Anda, lalu masukkan:
```env
# URL Web App Google Apps Script
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec

# Token rahasia yang sama persis dengan di Script Properties
APPS_SCRIPT_SECRET=cafetaria-super-secure-token-2026-xyz

# Kunci penandatangan sesi JWT Next.js
AUTH_SECRET=cafetaria-session-secret-jwt-key-2026

# URL Domain Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
Restart server development (`npm run dev`), dan seluruh operasi dashboard admin sekarang akan langsung membaca dan menulis data ke Google Spreadsheet!

---

## 4. Cara Memperbarui Kode Apps Script Nanti
Jika sewaktu-waktu ada pembaruan pada `code.gs`:
1. Buka kembali editor Apps Script.
2. Perbarui kode yang relevan.
3. Klik **Deploy > Manage deployments**.
4. Klik ikon pensil (Edit) pada deployment aktif.
5. Pada pilihan *Version*, pilih **New version** (Versi baru).
6. Klik **Deploy**. (URL Web App akan tetap sama sehingga Anda tidak perlu mengubah `.env.local`).

---

## 5. Catatan Penting Mengenai Media (File Gambar)
- **Lingkungan Lokal (Development):** Gambar thumbnail yang diunggah dari dashboard tersimpan rapi di direktori `public/uploads/` komputer Anda.
- **Lingkungan Produksi (Vercel):** Karena disk penyimpanan serverless Vercel bersifat sementara (*ephemeral & read-only*), file yang diunggah saat website berjalan di Vercel tidak disimpan permanen di disk lokal. Di Step 4, modul penyimpanan `src/lib/storage.ts` telah disiapkan agar dapat dialihkan dengan mudah ke layanan cloud storage permanen (seperti **Vercel Blob**, **Cloudinary**, atau **Google Drive**) tanpa merombak logika dashboard.
