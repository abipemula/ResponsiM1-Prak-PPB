# Responsi Modul 1 - REST API Layanan Peminjaman Buku Perpustakaan

Repository ini berisi pengerjaan tugas responsi Praktikum Pemrograman Berbasis Platform (PPB) Modul 1. Proyek ini mengimplementasikan RESTful API untuk layanan pencatatan transaksi peminjaman buku perpustakaan menggunakan stack Node.js, Express.js, dan database Supabase (PostgreSQL), serta dikonfigurasi untuk deployment ke Vercel.

- **Repository GitHub:** [https://github.com/abipemula/ResponsiM1-Prak-PPB](https://github.com/abipemula/ResponsiM1-Prak-PPB)
- **Deployment URL (Vercel):** `https://responsi-m1-prak-ppb.vercel.app` *(update tautan ini setelah proses deploy selesai)*

---

## 1. Deskripsi & Tujuan Proyek

Tujuan dari proyek ini adalah membangun backend service sederhana yang mencatat siklus peminjaman buku oleh anggota perpustakaan. API ini mengelola data anggota (*members*), katalog buku (*books*), dan transaksi peminjaman (*loans*), dengan pemisahan struktur kode menggunakan arsitektur MVC-like (Config, Model, Controller, Router).

### Fitur Utama & Perbedaan Dibanding Latihan Modul 1

Pada latihan terbimbing Modul 1, studi kasus yang dikerjakan adalah **Sales API** (`categories`, `customers`, `products`) dengan operasi CRUD standar. Untuk memenuhi ketentuan tugas responsi, dilakukan beberapa perubahan dan penambahan fitur:

| Aspek | Latihan Modul 1 (Sales API) | Tugas Responsi (Library Loan API) |
| :--- | :--- | :--- |
| **Domain Kasus** | Penjualan produk e-commerce | Layanan peminjaman buku perpustakaan |
| **Entitas Data** | `categories`, `customers`, `products` | `members` (anggota), `books` (buku), `loans` (transaksi peminjaman) |
| **Filter Query** | Tidak ada (hanya `select("*")` semua data) | **Ditambahkan fitur filter query status**, misalnya `GET /api/loans?status=Terlambat`, `Dipinjam`, atau `Dikembalikan` |
| **Relational Query** | Query relasi dasar pada detail produk | Relasi bertingkat pada transaksi peminjaman yang menggabungkan informasi peminjam (`members`) dan buku (`books`) secara otomatis |
| **Logika Bisnis** | Pencatatan master data biasa | Pencatatan transaksi dengan tanggal pinjam, batas waktu kembali (*due date*), tanggal riil kembali, status keterlambatan, dan catatan/denda |
| **Deployment** | Panduan deploy dasar ke Vercel | Konfigurasi serverless production-ready via `vercel.json` dan routing alias |

## 2. Panduan Menjalankan Secara Lokal

### Prasyarat
- Node.js (versi 18+)
- Akun Supabase

### Langkah Instalasi
1. Clone repository:
   ```bash
   git clone https://github.com/abipemula/ResponsiM1-Prak-PPB.git
   cd ResponsiM1-Prak-PPB
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Setup database Supabase:
   - Masuk ke dashboard Supabase, buat project baru.
   - Buka menu **SQL Editor**, buka file [`supabase_schema.sql`](supabase_schema.sql), lalu paste isinya dan klik **Run**.
   - Skema tabel `members`, `books`, `loans` beserta seed data awal akan otomatis dibuat.

4. Konfigurasi Environment:
   - Salin file `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   - Isi kredensial dari menu **Project Settings -> Data API** di Supabase:
     ```env
     PORT=3000
     SUPABASE_URL=https://<project-id>.supabase.co
     SUPABASE_KEY=<anon-public-key>
     ```

5. Jalankan server:
   - Mode development (dengan reload otomatis):
     ```bash
     npm run dev
     ```
   - Mode production:
     ```bash
     npm start
     ```
   Akses API di `http://localhost:3000`.

---

## 3. Pengujian dengan Postman

Tersedia berkas koleksi dan environment Postman di dalam repository:
- Koleksi: [`PPB_API_Postman_Collection.json`](PPB_API_Postman_Collection.json)
- Environment: [`PPB_API_Postman_Environment.json`](PPB_API_Postman_Environment.json)

Tinggal import kedua berkas tersebut ke Postman untuk langsung mencoba semua endpoint baik di server lokal (`localhost:3000`) maupun di Vercel setelah di-deploy.

---

## 4. Panduan Deployment ke Vercel

1. Buka [vercel.com](https://vercel.com/) dan login menggunakan akun GitHub.
2. Klik **Add New...** -> **Project**, lalu pilih repository `abipemula/ResponsiM1-Prak-PPB`.
3. Pada bagian **Environment Variables**, tambahkan:
   - `SUPABASE_URL` = `<URL Supabase Anda>`
   - `SUPABASE_KEY` = `<Anon Key Supabase Anda>`
4. Klik **Deploy** dan tunggu proses build selesai.
5. Uji endpoint pada domain yang diberikan oleh Vercel.
