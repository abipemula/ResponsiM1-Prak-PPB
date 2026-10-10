import { supabase } from "../config/supabaseClient.js";

export const LoanModel = {
  async getAll(filters = {}) {
    let query = supabase.from("loans").select(`
      id,
      loan_code,
      member_id,
      book_id,
      loan_date,
      due_date,
      return_date,
      status,
      notes,
      created_at,
      members ( id, member_code, name, email, phone ),
      books ( id, isbn, title, author, publisher )
    `);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.member_id) {
      query = query.eq("member_id", filters.member_id);
    }

    if (filters.book_id) {
      query = query.eq("book_id", filters.book_id);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select(`
        id,
        loan_code,
        member_id,
        book_id,
        loan_date,
        due_date,
        return_date,
        status,
        notes,
        created_at,
        members ( id, member_code, name, email, phone, address ),
        books ( id, isbn, title, author, publisher, year, stock )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload) {
    const loanPayload = {
      ...payload,
      loan_code: payload.loan_code || `LN-${Date.now().toString().slice(-6)}`,
      status: payload.status || "Dipinjam",
    };

    const { data, error } = await supabase
      .from("loans")
      .insert([loanPayload])
      .select(`
        id,
        loan_code,
        member_id,
        book_id,
        loan_date,
        due_date,
        return_date,
        status,
        notes,
        created_at,
        members ( id, member_code, name ),
        books ( id, title, author )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select(`
        id,
        loan_code,
        member_id,
        book_id,
        loan_date,
        due_date,
        return_date,
        status,
        notes,
        created_at,
        members ( id, member_code, name ),
        books ( id, title, author )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
    return { message: "Data peminjaman buku berhasil dihapus" };
  },
};
