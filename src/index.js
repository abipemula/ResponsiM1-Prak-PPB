import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import loanRoutes from "./routes/loanRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Informasi API (Root)
app.get("/", (req, res) => {
  res.json({
    message: "Selamat Datang di REST API Layanan Pencatatan Peminjaman Buku Perpustakaan",
    status: "Active",
    version: "1.0.0",
    endpoints: {
      loans: {
        all: "GET /api/loans (Mendukung query: ?status=Terlambat | Dipinjam | Dikembalikan)",
        detail: "GET /api/loans/:id",
        create: "POST /api/loans",
        update: "PUT /api/loans/:id",
        delete: "DELETE /api/loans/:id",
      },
      books: {
        all: "GET /api/books",
        detail: "GET /api/books/:id",
        create: "POST /api/books",
        update: "PUT /api/books/:id",
        delete: "DELETE /api/books/:id",
      },
      members: {
        all: "GET /api/members",
        detail: "GET /api/members/:id",
        create: "POST /api/members",
        update: "PUT /api/members/:id",
        delete: "DELETE /api/members/:id",
      },
    },
  });
});

// Routing API (dengan prefix /api dan alias langsung)
app.use("/api/loans", loanRoutes);
app.use("/loans", loanRoutes);

app.use("/api/books", bookRoutes);
app.use("/books", bookRoutes);

app.use("/api/members", memberRoutes);
app.use("/members", memberRoutes);

// 404 Handler untuk route yang tidak terdaftar
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// Jalankan server jika di lingkungan lokal (bukan serverless Vercel)
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
