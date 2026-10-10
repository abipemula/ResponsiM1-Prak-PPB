import { LoanModel } from "../models/loanModel.js";

export const LoanController = {
  /**
   * GET /loans atau GET /api/loans
   * Mendukung query filter: ?status=Terlambat / ?status=Dipinjam / ?status=Dikembalikan
   */
  async getAll(req, res) {
    try {
      const { status, member_id, book_id } = req.query;
      const loans = await LoanModel.getAll({ status, member_id, book_id });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /loans/:id atau GET /api/loans/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const loan = await LoanModel.getById(id);
      res.json(loan);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  /**
   * POST /loans atau POST /api/loans
   */
  async create(req, res) {
    try {
      const { member_id, book_id, due_date } = req.body;
      if (!member_id || !book_id || !due_date) {
        return res.status(400).json({
          error: "Field 'member_id', 'book_id', dan 'due_date' wajib diisi.",
        });
      }

      const newLoan = await LoanModel.create(req.body);
      res.status(201).json(newLoan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * PUT /loans/:id atau PUT /api/loans/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedLoan = await LoanModel.update(id, req.body);
      res.json(updatedLoan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  /**
   * DELETE /loans/:id atau DELETE /api/loans/:id
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      const result = await LoanModel.remove(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
