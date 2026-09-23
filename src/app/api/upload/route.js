import { NextResponse } from 'next/server';
import { supabase, isSupabaseReady } from '@/lib/supabase';

export async function POST(request) {
  if (!isSupabaseReady()) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${timestamp}.${ext}`;

    // Convertir el File a ArrayBuffer para Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo a Supabase Storage:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('gallery')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
