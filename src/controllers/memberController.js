import { MemberModel } from "../models/memberModel.js";

export const MemberController = {
  async getAll(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      res.json(member);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { member_code, name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Field 'name' dan 'email' wajib diisi." });
      }

      const payload = {
        ...req.body,
        member_code: member_code || `MBR-${Date.now().toString().slice(-4)}`,
      };

      const member = await MemberModel.create(payload);
      res.status(201).json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const member = await MemberModel.update(req.params.id, req.body);
      res.json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await MemberModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
