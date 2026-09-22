import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `gallery/${timestamp}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
