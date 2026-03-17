import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl?.startsWith("https://") || !supabaseAnonKey) {
  console.error(
    "Recruix: Missing or invalid Supabase env. Add VITE_SUPABASE_URL (e.g. https://xxx.supabase.co) and VITE_SUPABASE_ANON_KEY to frontend/.env"
  );
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");

