import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "placeholder-anon-key";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn(
    "[PERINGATAN] SUPABASE_URL atau SUPABASE_KEY belum diisi di .env! Silakan isi kredensial Supabase Anda."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
