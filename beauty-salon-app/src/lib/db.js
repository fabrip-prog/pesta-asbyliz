import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data.json');

const defaultData = {
  services: [
    { id: 1, name: "Extensiones Clásicas", category: "pestanas", price: 15000, deposit: 5000, duration: "90 min" },
    { id: 2, name: "Volumen Ruso", category: "pestanas", price: 18000, deposit: 5000, duration: "120 min" },
    { id: 3, name: "Perfilado y Laminado", category: "cejas", price: 8000, deposit: 3000, duration: "45 min" },
    { id: 4, name: "Limpieza Facial Profunda", category: "cosmetologia", price: 12000, deposit: 4000, duration: "60 min" }
  ],
  appointments: [],
  availability: {
    startHour: "09:00",
    endHour: "20:00",
    slotDuration: 60, // minutes
    blockedDays: [0], // 0 = Sunday
    blockedDates: [] // specific dates 'YYYY-MM-DD'
  }
};

export function getDb() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

export function saveDb(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
