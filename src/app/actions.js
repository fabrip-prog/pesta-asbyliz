"use server";

import { getDb, saveDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getServices() {
  const db = await getDb();
  return db.services;
}

export async function updateService(id, data) {
  const db = await getDb();
  const index = db.services.findIndex(s => s.id === id);
  if (index !== -1) {
    db.services[index] = { ...db.services[index], ...data };
    await saveDb(db);
    revalidatePath("/admin/dashboard");
    revalidatePath("/reserva");
    return true;
  }
  return false;
}

export async function createService(data) {
  const db = await getDb();
  const newService = {
    id: Date.now(),
    ...data,
    price: Number(data.price),
    deposit: Number(data.deposit)
  };
  db.services.push(newService);
  await saveDb(db);
  revalidatePath("/admin/dashboard");
  revalidatePath("/reserva");
  return newService;
}

export async function getAppointments() {
  const db = await getDb();
  return db.appointments;
}

export async function createAppointment(data) {
  const db = await getDb();
  const newAppointment = {
    id: Date.now(),
    ...data,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  if(!db.appointments) db.appointments = [];
  db.appointments.push(newAppointment);
  await saveDb(db);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return newAppointment;
}

export async function deleteService(id) {
  const db = await getDb();
  db.services = db.services.filter(s => s.id !== id);
  await saveDb(db);
  revalidatePath("/admin/dashboard");
  revalidatePath("/reserva");
  return true;
}

export async function getGallery() {
  const db = await getDb();
  return db.gallery || [];
}

export async function addGalleryWork(data) {
  const db = await getDb();
  if (!db.gallery) db.gallery = [];
  const newItem = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  };
  db.gallery.push(newItem);
  await saveDb(db);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return newItem;
}

export async function getAvailableSlots() {
  const db = await getDb();
  return db.availableSlots || [];
}

export async function saveAvailableSlots(date, times) {
  const db = await getDb();
  if(!db.availableSlots) db.availableSlots = [];
  const existingIndex = db.availableSlots.findIndex(s => s.date === date);
  if(existingIndex >= 0) {
    db.availableSlots[existingIndex].times = times;
  } else {
    db.availableSlots.push({ date, times });
  }
  await saveDb(db);
  revalidatePath("/reserva");
  revalidatePath("/admin/dashboard");
  return true;
}

export async function deleteAvailableSlot(date) {
  const db = await getDb();
  if(db.availableSlots) {
    db.availableSlots = db.availableSlots.filter(s => s.date !== date);
    await saveDb(db);
  }
  revalidatePath("/reserva");
  revalidatePath("/admin/dashboard");
  return true;
}

export async function checkDbStatus() {
  return {
    hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
  };
}
