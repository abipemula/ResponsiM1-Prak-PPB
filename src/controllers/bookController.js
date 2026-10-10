import { BookModel } from "../models/bookModel.js";

export const BookController = {
  async getAll(req, res) {
    try {
      const books = await BookModel.getAll();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const book = await BookModel.getById(req.params.id);
      res.json(book);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { isbn, title, author } = req.body;
      if (!isbn || !title || !author) {
        return res.status(400).json({ error: "Field 'isbn', 'title', dan 'author' wajib diisi." });
      }

      const book = await BookModel.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const book = await BookModel.update(req.params.id, req.body);
      res.json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await BookModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
