import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar que la URL sea una URL HTTPS válida (no un placeholder)
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://');
const isConfigured = isValidUrl && supabaseAnonKey && supabaseAnonKey.length > 20;

if (!isConfigured) {
  console.warn(
    'Supabase no configurado. Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local'
  );
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar si Supabase está disponible
export function isSupabaseReady() {
  return supabase !== null;
}
