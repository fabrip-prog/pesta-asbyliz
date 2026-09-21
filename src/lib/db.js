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
  const cloneDefault = () => JSON.parse(JSON.stringify(defaultData));
  
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      // Find the most recent db-data file (in case of multiples, though we try to keep only 1)
      const dbBlobs = blobs.filter(b => b.pathname.startsWith('db-data'));
      if (dbBlobs.length > 0) {
        // Sort by uploadedAt descending to get the newest
        dbBlobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        const latestBlob = dbBlobs[0];
        const response = await fetch(latestBlob.url, { cache: 'no-store' });
        return await response.json();
      }
      return cloneDefault();
    } catch (e) {
      console.error("Vercel Blob GET error:", e);
      return cloneDefault();
    }
  } else {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn("Falta BLOB_READ_WRITE_TOKEN en Vercel. Devolviendo datos por defecto.");
      return cloneDefault();
    }
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
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      const oldBlobs = blobs.filter(b => b.pathname.startsWith('db-data'));
      
      // Save new file first with a random suffix (addRandomSuffix: true by default)
      // This guarantees a completely new URL, bypassing any CDN cache!
      await put('db-data.json', JSON.stringify(data), {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      // Delete old files to clean up storage
      if (oldBlobs.length > 0) {
        // Need to import del dynamically since it's not imported at the top
        const { del } = await import('@vercel/blob');
        await del(oldBlobs.map(b => b.url), { token: process.env.BLOB_READ_WRITE_TOKEN });
      }
    } catch (e) {
      console.error("Vercel Blob PUT error:", e);
    }
  } else {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn("Intento de guardar sin BLOB_READ_WRITE_TOKEN en producción. Ignorado para evitar crash.");
      return;
    }
    const dataFile = path.join(process.cwd(), 'data.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}
