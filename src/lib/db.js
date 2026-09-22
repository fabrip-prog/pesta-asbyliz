// Imports are done dynamically inside functions to support both
// Vercel Blob (production) and local filesystem (development)

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
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      // Buscamos nuestro archivo único de base de datos
      const dbBlob = blobs.find(b => b.pathname === 'database.json');
      
      if (dbBlob) {
        const fetchUrl = dbBlob.downloadUrl || dbBlob.url;
        // Blob público: no necesita Authorization, solo evitar caché
        const response = await fetch(fetchUrl, { 
          cache: 'no-store'
        });
        
        if (!response.ok) {
           console.error("Vercel Blob fetch failed:", response.status, await response.text());
           return cloneDefault();
        }
        
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
    const fs = await import('fs');
    const path = await import('path');
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
      const { put } = await import('@vercel/blob');
      // Sobrescribimos siempre el mismo archivo para evitar desincronización
      await put('database.json', JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch (e) {
      console.error("Vercel Blob PUT error:", e);
    }
  } else {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn("Intento de guardar sin BLOB_READ_WRITE_TOKEN en producción. Ignorado para evitar crash.");
      return;
    }
    const fs = await import('fs');
    const path = await import('path');
    const dataFile = path.join(process.cwd(), 'data.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
}
