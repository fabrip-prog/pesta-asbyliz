import { supabase, isSupabaseReady } from '@/lib/supabase';

export default async function DebugPage() {
  let output = {};
  
  if (isSupabaseReady()) {
    try {
      // Test de lectura - servicios
      const { data: services, error: svcErr } = await supabase
        .from('services')
        .select('*')
        .limit(5);
      
      // Test de lectura - appointments
      const { data: appointments, error: apptErr } = await supabase
        .from('appointments')
        .select('*')
        .limit(5);
      
      // Test de lectura - gallery
      const { data: gallery, error: galErr } = await supabase
        .from('gallery')
        .select('*')
        .limit(5);

      // Test de lectura - available_slots
      const { data: slots, error: slotsErr } = await supabase
        .from('available_slots')
        .select('*')
        .limit(5);

      output = {
        status: "Supabase conectado ✅",
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        tables: {
          services: svcErr ? { error: svcErr.message } : { count: services?.length, sample: services },
          appointments: apptErr ? { error: apptErr.message } : { count: appointments?.length, sample: appointments },
          gallery: galErr ? { error: galErr.message } : { count: gallery?.length, sample: gallery },
          available_slots: slotsErr ? { error: slotsErr.message } : { count: slots?.length, sample: slots },
        }
      };
    } catch (e) {
      output = { status: "Error conectando con Supabase ❌", error: e.message };
    }
  } else {
    output = { 
      status: "Supabase NO configurado ❌",
      message: "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
    };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Diagnóstico - Supabase</h1>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}
export const dynamic = 'force-dynamic';
