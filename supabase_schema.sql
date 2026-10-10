-- ==========================================================
-- SKEMA DATABASE SUPABASE: SISTEM PEMINJAMAN BUKU PERPUSTAKAAN
-- RESPONSI PRAKTIKUM PEMROGRAMAN BERBASIS PLATFORM (PPB) MODUL 1
-- ==========================================================

-- Hapus tabel lama jika ada (urutan child ke parent)
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- 1. TABEL ANGGOTA PERPUSTAKAAN (MEMBERS)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABEL BUKU (BOOKS)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publisher TEXT,
    year INTEGER,
    stock INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL PEMINJAMAN (LOANS)
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_code TEXT UNIQUE NOT NULL,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT NOT NULL DEFAULT 'Dipinjam' CHECK (status IN ('Dipinjam', 'Dikembalikan', 'Terlambat')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Nonaktifkan RLS agar dapat diakses oleh anon public key dari backend
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;

-- ==========================================================
-- DATA CONTOH (SEED DATA) UNTUK PENGUJIAN LANGSUNG
-- ==========================================================

-- Data Anggota
INSERT INTO members (id, member_code, name, email, phone, address) VALUES
('a0000001-0000-0000-0000-000000000001', 'MBR-001', 'Ahmad Rizky Pratama', 'ahmad.rizky@example.com', '081234567890', 'Jl. Kaliurang KM 5, Sleman'),
('a0000001-0000-0000-0000-000000000002', 'MBR-002', 'Siti Nurhaliza', 'siti.nurhaliza@example.com', '082198765432', 'Jl. Gejayan No. 12, Yogyakarta'),
('a0000001-0000-0000-0000-000000000003', 'MBR-003', 'Budi Santoso', 'budi.santoso@example.com', '085711223344', 'Jl. Malioboro No. 45, Yogyakarta');

-- Data Buku
INSERT INTO books (id, isbn, title, author, publisher, year, stock) VALUES
('b0000001-0000-0000-0000-000000000001', '978-602-03-8599-0', 'Clean Code: Panduan Menulis Kode yang Bersih', 'Robert C. Martin', 'Prentice Hall', 2008, 5),
('b0000001-0000-0000-0000-000000000002', '978-602-04-1234-5', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 3),
('b0000001-0000-0000-0000-000000000003', '978-602-05-6789-1', 'Pemrograman Web Modern dengan Node.js dan Express', 'Eko Kurniawan Khannedy', 'Informatika', 2023, 7),
('b0000001-0000-0000-0000-000000000004', '978-602-06-9999-9', 'Filosofi Teras', 'Henry Manampiring', 'Kompas Gramedia', 2018, 4);

-- Data Peminjaman (Termasuk status Dipinjam, Dikembalikan, dan Terlambat)
INSERT INTO loans (id, loan_code, member_id, book_id, loan_date, due_date, return_date, status, notes) VALUES
('c0000001-0000-0000-0000-000000000001', 'LOAN-2026-001', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '2026-03-01', '2026-03-08', '2026-03-07', 'Dikembalikan', 'Buku dikembalikan dalam kondisi baik'),
('c0000001-0000-0000-0000-000000000002', 'LOAN-2026-002', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', '2026-03-10', '2026-03-17', NULL, 'Dipinjam', 'Peminjaman reguler'),
('c0000001-0000-0000-0000-000000000003', 'LOAN-2026-003', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', '2026-02-15', '2026-02-22', NULL, 'Terlambat', 'Terlambat lebih dari 2 minggu, telah dihubungi via WhatsApp');
