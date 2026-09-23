"use server";

import {
  getServices as dbGetServices,
  createService as dbCreateService,
  updateService as dbUpdateService,
  deleteService as dbDeleteService,
  getAppointments as dbGetAppointments,
  createAppointment as dbCreateAppointment,
  getGallery as dbGetGallery,
  addGalleryItem as dbAddGalleryItem,
  getAvailableSlots as dbGetAvailableSlots,
  saveAvailableSlots as dbSaveAvailableSlots,
  deleteAvailableSlot as dbDeleteAvailableSlot,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── SERVICES ───────────────────────────────────────────────

export async function getServices() {
  const services = await dbGetServices();
  // Mapear de snake_case (DB) a camelCase (frontend) — la DB ya usa las mismas keys
  return services;
}

export async function createService(data) {
  const newService = await dbCreateService(data);
  revalidatePath("/admin/dashboard");
  revalidatePath("/reserva");
  return newService;
}

export async function updateService(id, data) {
  const updated = await dbUpdateService(id, data);
  revalidatePath("/admin/dashboard");
  revalidatePath("/reserva");
  return !!updated;
}

export async function deleteService(id) {
  const result = await dbDeleteService(id);
  revalidatePath("/admin/dashboard");
  revalidatePath("/reserva");
  return result;
}

// ─── APPOINTMENTS ───────────────────────────────────────────

export async function getAppointments() {
  const appointments = await dbGetAppointments();
  // Mapear campos de snake_case a camelCase para el frontend
  return appointments.map((a) => ({
    id: a.id,
    clientName: a.client_name,
    clientPhone: a.client_phone,
    clientEmail: a.client_email,
    serviceId: a.service_id,
    serviceName: a.service_name,
    date: a.date,
    startTime: a.time,
    depositAmount: a.deposit_amount,
    status: a.status,
    notes: a.notes,
    createdAt: a.created_at,
    // Mantener compatibilidad con el frontend que usa appt.service?.name
    service: { name: a.service_name },
  }));
}

export async function createAppointment(data) {
  const newAppt = await dbCreateAppointment({
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    clientEmail: data.clientEmail,
    serviceId: data.serviceId || data.service?.id,
    serviceName: data.serviceName || data.service?.name,
    date: data.date,
    time: data.startTime || data.time,
    depositAmount: data.depositAmount || data.service?.deposit || 0,
    notes: data.notes,
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  // Devolver en formato camelCase con compatibilidad
  if (newAppt) {
    return {
      id: newAppt.id,
      clientName: newAppt.client_name,
      clientPhone: newAppt.client_phone,
      date: newAppt.date,
      startTime: newAppt.time,
      service: { name: newAppt.service_name },
      status: newAppt.status,
      createdAt: newAppt.created_at,
    };
  }
  return null;
}

// ─── GALLERY ────────────────────────────────────────────────

export async function getGallery() {
  const items = await dbGetGallery();
  // Mapear image_url → image para compatibilidad con el frontend
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image_url,
    category: item.category,
    createdAt: item.created_at,
  }));
}

export async function addGalleryWork(data) {
  const newItem = await dbAddGalleryItem({
    title: data.title,
    description: data.description,
    imageUrl: data.image || data.imageUrl,
    category: data.category,
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  if (newItem) {
    return {
      id: newItem.id,
      title: newItem.title,
      description: newItem.description,
      image: newItem.image_url,
      category: newItem.category,
      createdAt: newItem.created_at,
    };
  }
  return null;
}

// ─── AVAILABLE SLOTS ────────────────────────────────────────

export async function getAvailableSlots() {
  const slots = await dbGetAvailableSlots();
  return slots;
}

export async function saveAvailableSlots(date, times) {
  await dbSaveAvailableSlots(date, times);
  revalidatePath("/reserva");
  revalidatePath("/admin/dashboard");
  return true;
}

export async function deleteAvailableSlot(date) {
  await dbDeleteAvailableSlot(date);
  revalidatePath("/reserva");
  revalidatePath("/admin/dashboard");
  return true;
}

// ─── DB STATUS ──────────────────────────────────────────────

export async function checkDbStatus() {
  // Ahora verificamos que las variables de Supabase estén presentes
  return {
    hasToken: !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  };
}
