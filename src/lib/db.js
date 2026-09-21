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
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      const dbBlob = blobs.find(b => b.pathname === 'data.json');
      if (dbBlob) {
        const response = await fetch(dbBlob.url, { cache: 'no-store' });
        return await response.json();
      }
      return defaultData;
    } catch (e) {
      console.error("Vercel Blob GET error:", e);
      return defaultData;
    }
  } else {
    // Fallback para localhost si no hay token (opcional, pero ayuda al desarrollo)
    const dataFile = path.join(process.cwd(), 'data.json');
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
}

export async function saveDb(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put('data.json', JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false, // Ensures we overwrite the exact file 'data.json'
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch (e) {
      console.error("Vercel Blob PUT error:", e);
    }
  } else {
    const dataFile = path.join(process.cwd(), 'data.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}
