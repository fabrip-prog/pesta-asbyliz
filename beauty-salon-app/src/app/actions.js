"use server";

import { getDb, saveDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getServices() {
  const db = getDb();
  return db.services;
}

export async function updateService(id, data) {
  const db = getDb();
  const index = db.services.findIndex(s => s.id === id);
  if (index !== -1) {
    db.services[index] = { ...db.services[index], ...data };
    saveDb(db);
    revalidatePath("/admin/dashboard");
    revalidatePath("/reserva");
    return true;
  }
  return false;
}

export async function getAppointments() {
  const db = getDb();
  return db.appointments;
}

export async function createAppointment(data) {
  const db = getDb();
  const newAppointment = {
    id: Date.now(),
    ...data,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  db.appointments.push(newAppointment);
  saveDb(db);
  revalidatePath("/admin/dashboard");
  return newAppointment;
}
