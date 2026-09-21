import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const defaultData = {
  services: [
    { id: 1, name: "Extensiones Clásicas", category: "pestanas", price: 15000, deposit: 5000, duration: "90 min" },
    { id: 2, name: "Volumen Ruso", category: "pestanas", price: 18000, deposit: 5000, duration: "120 min" },
    { id: 3, name: "Perfilado y Laminado", category: "cejas", price: 8000, deposit: 3000, duration: "45 min" },
    { id: 4, name: "Limpieza Facial Profunda", category: "cosmetologia", price: 12000, deposit: 4000, duration: "60 min" }
  ],
  appointments: [],
  gallery: [],
  availableSlots: [],
  availability: {
    startHour: "09:00",
    endHour: "20:00",
    slotDuration: 60,
    blockedDays: [0],
    blockedDates: []
  }
};

export async function getDb() {
  // Always clone defaultData to avoid mutating the global object across requests
  const cloneDefault = () => JSON.parse(JSON.stringify(defaultData));
  
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      const dbBlob = blobs.find(b => b.pathname === 'data.json');
      if (dbBlob) {
        const response = await fetch(dbBlob.url, { cache: 'no-store' });
        return await response.json();
      }
      return cloneDefault();
    } catch (e) {
      console.error("Vercel Blob GET error:", e);
      return cloneDefault();
    }
  } else {
    // Si estamos en Vercel pero olvidaron el token, no intentemos usar 'fs' porque romperá la app (500 Error)
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn("Falta BLOB_READ_WRITE_TOKEN en Vercel. Devolviendo datos por defecto.");
      return cloneDefault();
    }
    
    // Fallback para desarrollo local (localhost)
    const dataFile = path.join(process.cwd(), 'data.json');
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
      return cloneDefault();
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
}

export async function saveDb(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put('data.json', JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch (e) {
      console.error("Vercel Blob PUT error:", e);
    }
  } else {
    // Si estamos en Vercel sin token, ignoramos el guardado para evitar crashear con fs.writeFileSync
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn("Intento de guardar sin BLOB_READ_WRITE_TOKEN en producción. Ignorado para evitar crash.");
      return;
    }
    
    const dataFile = path.join(process.cwd(), 'data.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}
