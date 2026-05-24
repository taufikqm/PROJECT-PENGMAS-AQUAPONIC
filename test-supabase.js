import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log("Mengecek tabel fish_types...");
  const { data, error } = await supabase.from('fish_types').select('*');
  
  if (error) {
    console.error("Error mengambil data:", error);
  } else {
    console.log("Data ikan yang ditemukan di Supabase:", data);
  }
}

testSupabase();
