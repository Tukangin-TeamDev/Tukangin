import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase URL or Anon Key');
  process.exit(1);
}

// Klien Supabase untuk operasi publik (digunakan di browser, terbatas)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Klien Supabase untuk operasi server-side (akses penuh ke database)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabaseClient; // fallback

export default supabaseAdmin; 