# REST API Layanan Pencatatan Peminjaman Buku Perpustakaan 📚

> **Responsi Praktikum Pemrograman Berbasis Platform (PPB) - Modul 1**  
> Dibuat menggunakan **Node.js**, **Express.js**, dan **Supabase (PostgreSQL)**, serta siap di-deploy ke **Vercel**.

---

## 📌 1. Deskripsi Umum & Tujuan Proyek

Proyek ini merupakan implementasi backend RESTful API untuk layanan sistem informasi perpustakaan, khususnya pengelolaan dan pencatatan transaksi peminjaman buku oleh anggota perpustakaan.

### 🎯 Tujuan Proyek
1. Mengimplementasikan arsitektur RESTful API standar dengan metode HTTP (`GET`, `POST`, `PUT`, `DELETE`).
2. Mengelola transaksi data peminjaman buku oleh anggota perpustakaan dengan operasi **CRUD lengkap**.
3. Menyediakan fitur **filter query string**, seperti penyaringan peminjaman berdasarkan status (`GET /api/loans?status=Terlambat`).
4. Mengintegrasikan aplikasi backend dengan **Database Supabase** sebagai *Backend-as-a-Service* (BaaS).
5. Menerapkan arsitektur kode terstruktur (*Separation of Concerns*) berbasis pola **MVC (Model-Controller-Route)**.
6. Menyiapkan konfigurasi serverless deployment ke **Vercel** agar API dapat diakses secara publik.

---

## 🚀 2. Tautan Hasil Deployment Vercel

* **Production URL (Vercel):** `https://responsi-m1-library-api.vercel.app` *(Silakan perbarui tautan ini setelah menghubungkan repositori ke akun Vercel Anda)*
* **Base URL Lokal:** `http://localhost:3000`

---

## 🛠️ 3. Tech Stack

* **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
* **Framework Backend:** [Express.js](https://expressjs.com/)
* **Database & BaaS:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Deployment Platform:** [Vercel](https://vercel.com/)
* **API Testing:** [Postman](https://www.postman.com/)

---

## 📁 4. Struktur Direktori Proyek

```plaintext
ResponsiM1/
├── src/
│   ├── config/
│   │   └── supabaseClient.js      # Inisialisasi koneksi client Supabase
│   ├── controllers/
│   │   ├── bookController.js      # Logika HTTP request/response data buku
│   │   ├── loanController.js      # Logika HTTP request/response data peminjaman & filter
│   │   └── memberController.js    # Logika HTTP request/response data anggota
│   ├── models/
│   │   ├── bookModel.js           # Query database tabel 'books'
│   │   ├── loanModel.js           # Query database tabel 'loans' (CRUD & filtering)
│   │   └── memberModel.js         # Query database tabel 'members'
│   ├── routes/
│   │   ├── bookRoutes.js          # Routing endpoint /api/books
│   │   ├── loanRoutes.js          # Routing endpoint /api/loans
│   │   └── memberRoutes.js        # Routing endpoint /api/members
│   └── index.js                   # Server utama Express & konfigurasi middleware
├── .env.example                   # Template variabel lingkungan
├── .gitignore                     # Daftar file/folder yang diabaikan Git
├── package.json                   # Definisi paket, dependensi & script NPM
├── PPB_API_Postman_Collection.json # Koleksi Postman siap pakai
├── PPB_API_Postman_Environment.json# Environment variabel Postman
├── supabase_schema.sql            # Script SQL skema tabel dan seed data
├── vercel.json                    # Konfigurasi deployment serverless Vercel
└── README.md                      # Dokumentasi lengkap proyek
```

---

## 🗄️ 5. Struktur Data & Skema Database (Supabase)

Sistem menggunakan 3 tabel relasional di Supabase:
1. **`members`**: Menyimpan identitas anggota perpustakaan.
2. **`books`**: Menyimpan katalog buku yang tersedia untuk dipinjam.
3. **`loans`**: Menyimpan riwayat transaksi peminjaman buku oleh anggota perpustakaan, terhubung melalui *Foreign Key* ke tabel `members` dan `books`.

### Relasi Antar Tabel
```
members (id) <--- [1:N] --- loans (member_id)
books (id)   <--- [1:N] --- loans (book_id)
```

### Kamus Data / Schema Detail

#### A. Tabel `members` (Anggota)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | Auto-generated UUID default `gen_random_uuid()` |
| `member_code` | `TEXT` (Unique, Not Null) | Kode anggota (contoh: `MBR-001`) |
| `name` | `TEXT` (Not Null) | Nama lengkap anggota |
| `email` | `TEXT` (Unique, Not Null) | Alamat email anggota |
| `phone` | `TEXT` | Nomor telepon/WhatsApp |
| `address` | `TEXT` | Alamat domisili |
| `created_at` | `TIMESTAMPTZ` | Waktu pencatatan akun anggota |

#### B. Tabel `books` (Buku)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | Auto-generated UUID default `gen_random_uuid()` |
| `isbn` | `TEXT` (Unique, Not Null) | Nomor ISBN buku (contoh: `978-602-03-8599-0`) |
| `title` | `TEXT` (Not Null) | Judul buku |
| `author` | `TEXT` (Not Null) | Nama penulis buku |
| `publisher` | `TEXT` | Nama penerbit |
| `year` | `INTEGER` | Tahun terbit buku |
| `stock` | `INTEGER` | Jumlah stok buku tersedia (default: `1`) |
| `created_at` | `TIMESTAMPTZ` | Waktu penambahan buku ke sistem |

#### C. Tabel `loans` (Peminjaman)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | Auto-generated UUID default `gen_random_uuid()` |
| `loan_code` | `TEXT` (Unique, Not Null) | Nomor transaksi peminjaman (contoh: `LOAN-2026-001`) |
| `member_id` | `UUID` (Foreign Key, Not Null) | Relasi ke `members.id` (`ON DELETE CASCADE`) |
| `book_id` | `UUID` (Foreign Key, Not Null) | Relasi ke `books.id` (`ON DELETE CASCADE`) |
| `loan_date` | `DATE` (Not Null) | Tanggal mulai peminjaman (default: `CURRENT_DATE`) |
| `due_date` | `DATE` (Not Null) | Batas waktu pengembalian buku |
| `return_date` | `DATE` | Tanggal riil pengembalian (null jika masih dipinjam) |
| `status` | `TEXT` (Not Null) | Status peminjaman: `'Dipinjam'`, `'Dikembalikan'`, `'Terlambat'` |
| `notes` | `TEXT` | Catatan tambahan kondisi buku atau denda |
| `created_at` | `TIMESTAMPTZ` | Waktu pembuatan transaksi peminjaman |

---

## 📡 6. Daftar Endpoint API

### A. Endpoint Peminjaman (Loans) — *Fitur Utama Responsi*
| Method | Endpoint | Query Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/loans` | *(opsional)* `?status=...` | Mengambil seluruh data peminjaman buku (beserta data relasi member & book). Mendukung filter query: `?status=Terlambat`, `?status=Dipinjam`, `?status=Dikembalikan`. |
| **GET** | `/api/loans/:id` | - | Mengambil detail 1 transaksi peminjaman buku berdasarkan ID. |
| **POST** | `/api/loans` | - | Menambahkan catatan transaksi peminjaman buku baru. |
| **PUT** | `/api/loans/:id` | - | Memperbarui data peminjaman (misal: pengembalian buku, ubah status, isi catatan). |
| **DELETE** | `/api/loans/:id` | - | Menghapus data transaksi peminjaman buku berdasarkan ID. |

*(Tersedia pula alias tanpa prefix `/api/`, misalnya `GET /loans?status=Terlambat`).*

### B. Endpoint Buku (Books)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/books` | Mengambil daftar seluruh buku |
| **GET** | `/api/books/:id` | Mengambil data 1 buku berdasarkan ID |
| **POST** | `/api/books` | Menambahkan buku baru ke katalog |
| **PUT** | `/api/books/:id` | Memperbarui data buku |
| **DELETE** | `/api/books/:id` | Menghapus data buku |

### C. Endpoint Anggota (Members)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/members` | Mengambil daftar seluruh anggota perpustakaan |
| **GET** | `/api/members/:id` | Mengambil data 1 anggota berdasarkan ID |
| **POST** | `/api/members` | Mendaftarkan anggota baru |
| **PUT** | `/api/members/:id` | Memperbarui data profil anggota |
| **DELETE** | `/api/members/:id` | Menghapus data anggota |

---

## 📬 7. Contoh Request dan Response

### 1. Menampilkan Semua Peminjaman dengan Filter Query Status (`GET /api/loans?status=Terlambat`)
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/loans?status=Terlambat`
* **Headers:** `Content-Type: application/json`
* **Response Status:** `200 OK`
* **Response Body:**
```json
[
  {
    "id": "c0000001-0000-0000-0000-000000000003",
    "loan_code": "LOAN-2026-003",
    "member_id": "a0000001-0000-0000-0000-000000000003",
    "book_id": "b0000001-0000-0000-0000-000000000003",
    "loan_date": "2026-02-15",
    "due_date": "2026-02-22",
    "return_date": null,
    "status": "Terlambat",
    "notes": "Terlambat lebih dari 2 minggu, telah dihubungi via WhatsApp",
    "created_at": "2026-10-10T09:11:15.000Z",
    "members": {
      "id": "a0000001-0000-0000-0000-000000000003",
      "member_code": "MBR-003",
      "name": "Budi Santoso",
      "email": "budi.santoso@example.com",
      "phone": "085711223344"
    },
    "books": {
      "id": "b0000001-0000-0000-0000-000000000003",
      "isbn": "978-602-05-6789-1",
      "title": "Pemrograman Web Modern dengan Node.js dan Express",
      "author": "Eko Kurniawan Khannedy",
      "publisher": "Informatika"
    }
  }
]
```

---

### 2. Membuat Catatan Peminjaman Buku Baru (`POST /api/loans`)
* **Method:** `POST`
* **URL:** `http://localhost:3000/api/loans`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "member_id": "a0000001-0000-0000-0000-000000000001",
  "book_id": "b0000001-0000-0000-0000-000000000004",
  "loan_date": "2026-03-15",
  "due_date": "2026-03-22",
  "status": "Dipinjam",
  "notes": "Peminjaman buku Filosofi Teras untuk tugas kuliah"
}
```
* **Response Status:** `201 Created`
* **Response Body:**
```json
{
  "id": "5fa23d10-8b1e-450b-8526-9d3e8e19b88a",
  "loan_code": "LN-981244",
  "member_id": "a0000001-0000-0000-0000-000000000001",
  "book_id": "b0000001-0000-0000-0000-000000000004",
  "loan_date": "2026-03-15",
  "due_date": "2026-03-22",
  "return_date": null,
  "status": "Dipinjam",
  "notes": "Peminjaman buku Filosofi Teras untuk tugas kuliah",
  "created_at": "2026-10-10T09:15:30.123Z",
  "members": {
    "id": "a0000001-0000-0000-0000-000000000001",
    "member_code": "MBR-001",
    "name": "Ahmad Rizky Pratama"
  },
  "books": {
    "id": "b0000001-0000-0000-0000-000000000004",
    "title": "Filosofi Teras",
    "author": "Henry Manampiring"
  }
}
```

---

### 3. Mengambil Detail Peminjaman Berdasarkan ID (`GET /api/loans/:id`)
* **Method:** `GET`
* **URL:** `http://localhost:3000/api/loans/c0000001-0000-0000-0000-000000000002`
* **Response Status:** `200 OK`
* **Response Body:**
```json
{
  "id": "c0000001-0000-0000-0000-000000000002",
  "loan_code": "LOAN-2026-002",
  "member_id": "a0000001-0000-0000-0000-000000000002",
  "book_id": "b0000001-0000-0000-0000-000000000002",
  "loan_date": "2026-03-10",
  "due_date": "2026-03-17",
  "return_date": null,
  "status": "Dipinjam",
  "notes": "Peminjaman reguler",
  "created_at": "2026-10-10T09:11:15.000Z",
  "members": {
    "id": "a0000001-0000-0000-0000-000000000002",
    "member_code": "MBR-002",
    "name": "Siti Nurhaliza",
    "email": "siti.nurhaliza@example.com",
    "phone": "082198765432",
    "address": "Jl. Gejayan No. 12, Yogyakarta"
  },
  "books": {
    "id": "b0000001-0000-0000-0000-000000000002",
    "isbn": "978-602-04-1234-5",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata",
    "publisher": "Bentang Pustaka",
    "year": 2005,
    "stock": 3
  }
}
```

---

### 4. Memperbarui Peminjaman / Pengembalian Buku (`PUT /api/loans/:id`)
* **Method:** `PUT`
* **URL:** `http://localhost:3000/api/loans/c0000001-0000-0000-0000-000000000002`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "status": "Dikembalikan",
  "return_date": "2026-03-16",
  "notes": "Buku dikembalikan tepat waktu dalam kondisi sangat baik"
}
```
* **Response Status:** `200 OK`
* **Response Body:**
```json
{
  "id": "c0000001-0000-0000-0000-000000000002",
  "loan_code": "LOAN-2026-002",
  "member_id": "a0000001-0000-0000-0000-000000000002",
  "book_id": "b0000001-0000-0000-0000-000000000002",
  "loan_date": "2026-03-10",
  "due_date": "2026-03-17",
  "return_date": "2026-03-16",
  "status": "Dikembalikan",
  "notes": "Buku dikembalikan tepat waktu dalam kondisi sangat baik",
  "created_at": "2026-10-10T09:11:15.000Z",
  "members": {
    "id": "a0000001-0000-0000-0000-000000000002",
    "member_code": "MBR-002",
    "name": "Siti Nurhaliza"
  },
  "books": {
    "id": "b0000001-0000-0000-0000-000000000002",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata"
  }
}
```

---

### 5. Menghapus Data Peminjaman (`DELETE /api/loans/:id`)
* **Method:** `DELETE`
* **URL:** `http://localhost:3000/api/loans/c0000001-0000-0000-0000-000000000001`
* **Response Status:** `200 OK`
* **Response Body:**
```json
{
  "message": "Data peminjaman buku berhasil dihapus"
}
```

---

## 💻 8. Panduan Instalasi & Cara Menjalankan Lokal

### Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
* Akun aktif di [Supabase](https://supabase.com/).

### Langkah 1: Kloning / Buka Direktori Proyek
Buka terminal dan arahkan ke direktori proyek:
```bash
cd d:\PPB\ResponsiM1
```

### Langkah 2: Instalasi Dependensi
Jalankan perintah berikut:
```bash
npm install
```

### Langkah 3: Setup Database di Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat proyek baru (misalnya dengan nama `Library-API` atau `PPB-Responsi`).
3. Buka menu **SQL Editor** (ikon `>_` di sidebar kiri).
4. Klik **+ New query**, lalu salin seluruh isi file [`supabase_schema.sql`](supabase_schema.sql) ke editor.
5. Klik tombol **RUN**. Seluruh tabel (`members`, `books`, `loans`) dan data awal (*seed data*) akan otomatis terbentuk.
6. Periksa hasilnya melalui menu **Table Editor** untuk memastikan tabel dan relasi sudah aktif.

### Langkah 4: Konfigurasi Variabel Lingkungan (`.env`)
1. Di dashboard Supabase, buka menu **Project Settings** -> **Data API** (atau **API**).
2. Salin nilai **Project URL** dan **Project API Keys (`anon public`)**.
3. Buat atau perbarui file `.env` di root direktori proyek:
```env
PORT=3000
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-anon-public-key>
```

### Langkah 5: Menjalankan Server Lokal
Untuk mode pengembangan (*hot-reload* menggunakan nodemon):
```bash
npm run dev
```

Atau untuk mode standar (*production mode*):
```bash
npm start
```

Jika berhasil, terminal akan menampilkan pesan:
```plaintext
Server running on port 3000
```
Buka browser pada `http://localhost:3000` untuk melihat status server.

---

## 🧪 9. Panduan Pengujian dengan Postman

Proyek ini telah dilengkapi dengan berkas Postman siap pakai:
* **Koleksi Request:** [`PPB_API_Postman_Collection.json`](PPB_API_Postman_Collection.json)
* **Environment:** [`PPB_API_Postman_Environment.json`](PPB_API_Postman_Environment.json)

### Langkah Import ke Postman:
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** di sudut kiri atas.
3. Seret (*drag & drop*) kedua file tersebut ke Postman.
4. Pilih environment **PPB Modul 1 - Local & Vercel Environment**.
5. Nilai variabel `base_url` secara bawaan adalah `http://localhost:3000`. Jika ingin menguji API yang telah di-deploy ke Vercel, cukup ubah nilai `base_url` di environment Postman menjadi URL Vercel Anda.
6. Anda dapat langsung menjalankan seluruh skenario pengujian CRUD peminjaman, filter `?status=Terlambat`, buku, dan anggota!

---

## 🌐 10. Panduan Deployment ke Vercel

Proyek ini sudah dikonfigurasi dengan file [`vercel.json`](vercel.json) sehingga dapat langsung di-deploy:

1. **Unggah Proyek ke GitHub:**
   Inisialisasi git dan push kode ke repositori GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: setup library loan REST API responsi modul 1"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
2. **Login ke Vercel:**
   Buka [https://vercel.com/](https://vercel.com/) dan masuk menggunakan akun GitHub Anda.
3. **Import Project:**
   * Di dashboard Vercel, klik **Add New...** -> **Project**.
   * Cari repositori GitHub yang baru saja dibuat, lalu klik **Import**.
4. **Pengaturan Framework & Direktori:**
   * Framework Preset: biarkan **Other** atau **Express**.
   * Root Directory: biarkan `./` (default).
5. **Konfigurasi Environment Variables:**
   Sebelum klik deploy, buka bagian **Environment Variables** dan tambahkan dua variabel berikut:
   * **`SUPABASE_URL`**: Masukkan Project URL Supabase Anda.
   * **`SUPABASE_KEY`**: Masukkan anon public key Supabase Anda.
6. **Deploy:**
   Klik tombol **Deploy** dan tunggu proses build selesai dalam beberapa detik.
7. **Verifikasi:**
   Setelah selesai, klik tautan domain yang diberikan Vercel (misal: `https://<nama-project>.vercel.app`).
   Uji akses endpoint `/` atau `/api/loans?status=Terlambat` langsung di browser maupun Postman!

---

## 👨‍💻 Kontributor
* **Nama Praktikan:** Mahasiswa Praktikum PPB
* **Mata Kuliah:** Praktikum Pemrograman Berbasis Platform (PPB)
* **Modul:** Modul 1 - Application Programming Interface (API)
