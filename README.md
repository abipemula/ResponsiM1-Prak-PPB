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

---

## 2. Struktur Data & Skema Database

Database menggunakan PostgreSQL yang di-host di Supabase. Skema lengkap dapat dilihat pada file [`supabase_schema.sql`](supabase_schema.sql).

### Relasi Tabel
- Satu anggota (`members`) dapat memiliki banyak transaksi peminjaman (`loans`).
- Satu buku (`books`) dapat dipinjam di banyak transaksi peminjaman (`loans`).

### Rincian Kolom

#### A. Tabel `members`
Menyimpan data anggota perpustakaan:
- `id` (UUID, Primary Key, default: `gen_random_uuid()`)
- `member_code` (TEXT, Unique, Not Null) - contoh: `MBR-001`
- `name` (TEXT, Not Null)
- `email` (TEXT, Unique, Not Null)
- `phone` (TEXT)
- `address` (TEXT)
- `created_at` (TIMESTAMPTZ, default: `now()`)

#### B. Tabel `books`
Menyimpan katalog buku perpustakaan:
- `id` (UUID, Primary Key, default: `gen_random_uuid()`)
- `isbn` (TEXT, Unique, Not Null) - contoh: `978-602-03-8599-0`
- `title` (TEXT, Not Null)
- `author` (TEXT, Not Null)
- `publisher` (TEXT)
- `year` (INTEGER)
- `stock` (INTEGER, default: `1`)
- `created_at` (TIMESTAMPTZ, default: `now()`)

#### C. Tabel `loans`
Menyimpan transaksi peminjaman buku:
- `id` (UUID, Primary Key, default: `gen_random_uuid()`)
- `loan_code` (TEXT, Unique, Not Null) - contoh: `LOAN-2026-001`
- `member_id` (UUID, FK -> `members.id`, ON DELETE CASCADE)
- `book_id` (UUID, FK -> `books.id`, ON DELETE CASCADE)
- `loan_date` (DATE, default: `CURRENT_DATE`)
- `due_date` (DATE, Not Null)
- `return_date` (DATE, Nullable)
- `status` (TEXT, Not Null, CHECK: `'Dipinjam'`, `'Dikembalikan'`, `'Terlambat'`)
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ, default: `now()`)

---

## 3. Struktur Direktori

Kode aplikasi disusun dengan memisahkan fungsi model, controller, dan router agar rapi dan mudah dirawat:

```plaintext
ResponsiM1/
├── src/
│   ├── config/
│   │   └── supabaseClient.js       # Inisialisasi koneksi Supabase
│   ├── controllers/
│   │   ├── bookController.js       # Logika request/response data buku
│   │   ├── loanController.js       # Logika request/response transaksi peminjaman & filter
│   │   └── memberController.js     # Logika request/response data anggota
│   ├── models/
│   │   ├── bookModel.js            # Interaksi tabel 'books'
│   │   ├── loanModel.js            # Interaksi tabel 'loans' (CRUD & query filter)
│   │   └── memberModel.js          # Interaksi tabel 'members'
│   ├── routes/
│   │   ├── bookRoutes.js           # Route untuk /api/books
│   │   ├── loanRoutes.js           # Route untuk /api/loans
│   │   └── memberRoutes.js         # Route untuk /api/members
│   └── index.js                    # Inisialisasi Express & konfigurasi serverless
├── .env.example                    # Template variabel lingkungan
├── package.json                    # Dependensi dan script
├── PPB_API_Postman_Collection.json # File koleksi testing Postman
├── PPB_API_Postman_Environment.json# File environment Postman
├── supabase_schema.sql             # Script SQL DDL & seed data
├── vercel.json                     # Konfigurasi build Vercel
└── README.md                       # Dokumentasi proyek
```

---

## 4. Daftar Endpoint API

### Peminjaman (`/api/loans`)
| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| **GET** | `/api/loans` | Mendapatkan semua data peminjaman beserta relasi data anggota dan buku |
| **GET** | `/api/loans?status=Terlambat` | **Filter query** status peminjaman (`Terlambat`, `Dipinjam`, atau `Dikembalikan`) |
| **GET** | `/api/loans/:id` | Mendapatkan detail 1 peminjaman berdasarkan ID |
| **POST** | `/api/loans` | Menambahkan data peminjaman baru |
| **PUT** | `/api/loans/:id` | Memperbarui data peminjaman (pengembalian / status) |
| **DELETE** | `/api/loans/:id` | Menghapus data peminjaman berdasarkan ID |

### Master Buku (`/api/books`)
| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| **GET** | `/api/books` | Mengambil semua buku |
| **GET** | `/api/books/:id` | Mengambil buku berdasarkan ID |
| **POST** | `/api/books` | Menambah data buku |
| **PUT** | `/api/books/:id` | Mengupdate data buku |
| **DELETE** | `/api/books/:id` | Menghapus data buku |

### Master Anggota (`/api/members`)
| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| **GET** | `/api/members` | Mengambil semua anggota |
| **GET** | `/api/members/:id` | Mengambil anggota berdasarkan ID |
| **POST** | `/api/members` | Menambah data anggota |
| **PUT** | `/api/members/:id` | Mengupdate data anggota |
| **DELETE** | `/api/members/:id` | Menghapus data anggota |

---

## 5. Contoh Request dan Response

### A. Filter Peminjaman Berdasarkan Status (`GET /api/loans?status=Terlambat`)
**Request:**
```http
GET /api/loans?status=Terlambat HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
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

### B. Tambah Data Peminjaman Baru (`POST /api/loans`)
**Request:**
```http
POST /api/loans HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "member_id": "a0000001-0000-0000-0000-000000000001",
  "book_id": "b0000001-0000-0000-0000-000000000004",
  "loan_date": "2026-03-15",
  "due_date": "2026-03-22",
  "status": "Dipinjam",
  "notes": "Peminjaman buku Filosofi Teras untuk tugas kuliah"
}
```

**Response (201 Created):**
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

### C. Update Status / Pengembalian Buku (`PUT /api/loans/:id`)
**Request:**
```http
PUT /api/loans/c0000001-0000-0000-0000-000000000002 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "status": "Dikembalikan",
  "return_date": "2026-03-16",
  "notes": "Buku telah dikembalikan dalam kondisi baik"
}
```

**Response (200 OK):**
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
  "notes": "Buku telah dikembalikan dalam kondisi baik",
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

### D. Hapus Data Peminjaman (`DELETE /api/loans/:id`)
**Request:**
```http
DELETE /api/loans/c0000001-0000-0000-0000-000000000001 HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
```json
{
  "message": "Data peminjaman buku berhasil dihapus"
}
```

---

## 6. Panduan Menjalankan Secara Lokal

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

## 7. Pengujian dengan Postman

Tersedia berkas koleksi dan environment Postman di dalam repository:
- Koleksi: [`PPB_API_Postman_Collection.json`](PPB_API_Postman_Collection.json)
- Environment: [`PPB_API_Postman_Environment.json`](PPB_API_Postman_Environment.json)

Tinggal import kedua berkas tersebut ke Postman untuk langsung mencoba semua endpoint baik di server lokal (`localhost:3000`) maupun di Vercel setelah di-deploy.

---

## 8. Panduan Deployment ke Vercel

1. Buka [vercel.com](https://vercel.com/) dan login menggunakan akun GitHub.
2. Klik **Add New...** -> **Project**, lalu pilih repository `abipemula/ResponsiM1-Prak-PPB`.
3. Pada bagian **Environment Variables**, tambahkan:
   - `SUPABASE_URL` = `<URL Supabase Anda>`
   - `SUPABASE_KEY` = `<Anon Key Supabase Anda>`
4. Klik **Deploy** dan tunggu proses build selesai.
5. Uji endpoint pada domain yang diberikan oleh Vercel.
