// Módulo de base de datos usando Supabase
// Las tablas deben existir en Supabase (ver supabase-schema.sql)

import { supabase, isSupabaseReady } from './supabase';

// ─── SERVICES ───────────────────────────────────────────────

export async function getServices() {
  if (!isSupabaseReady()) return [];

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
  return data;
}

export async function createService(serviceData) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('services')
    .insert({
      name: serviceData.name,
      category: serviceData.category,
      price: Number(serviceData.price),
      deposit: Number(serviceData.deposit),
      duration: serviceData.duration,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando servicio:', error);
    return null;
  }
  return data;
}

export async function updateService(id, updates) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando servicio:', error);
    return null;
  }
  return data;
}

export async function deleteService(id) {
  if (!isSupabaseReady()) return false;

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando servicio:', error);
    return false;
  }
  return true;
}

// ─── APPOINTMENTS ───────────────────────────────────────────

export async function getAppointments() {
  if (!isSupabaseReady()) return [];

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo turnos:', error);
    return [];
  }
  return data;
}

export async function createAppointment(appointmentData) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      client_name: appointmentData.clientName,
      client_phone: appointmentData.clientPhone,
      client_email: appointmentData.clientEmail || null,
      service_id: appointmentData.serviceId,
      service_name: appointmentData.serviceName,
      date: appointmentData.date,
      time: appointmentData.time,
      deposit_amount: appointmentData.depositAmount || 0,
      status: 'PENDING',
      notes: appointmentData.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando turno:', error);
    return null;
  }
  return data;
}

export async function updateAppointment(id, updates) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando turno:', error);
    return null;
  }
  return data;
}

export async function deleteAppointment(id) {
  if (!isSupabaseReady()) return false;

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando turno:', error);
    return false;
  }
  return true;
}

// ─── GALLERY ────────────────────────────────────────────────

export async function getGallery() {
  if (!isSupabaseReady()) return [];

  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo galería:', error);
    return [];
  }
  return data;
}

export async function addGalleryItem(itemData) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('gallery')
    .insert({
      title: itemData.title || null,
      description: itemData.description || null,
      image_url: itemData.imageUrl,
      category: itemData.category || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error agregando a galería:', error);
    return null;
  }
  return data;
}

export async function deleteGalleryItem(id) {
  if (!isSupabaseReady()) return false;

  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando de galería:', error);
    return false;
  }
  return true;
}

// ─── AVAILABLE SLOTS ────────────────────────────────────────

export async function getAvailableSlots() {
  if (!isSupabaseReady()) return [];

  const { data, error } = await supabase
    .from('available_slots')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error obteniendo horarios:', error);
    return [];
  }
  return data;
}

export async function saveAvailableSlots(date, times) {
  if (!isSupabaseReady()) return null;

  // Upsert: si ya existe una fila para esa fecha, la actualiza; si no, la crea
  const { data, error } = await supabase
    .from('available_slots')
    .upsert(
      { date, times },
      { onConflict: 'date' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error guardando horarios:', error);
    return null;
  }
  return data;
}

export async function deleteAvailableSlot(date) {
  if (!isSupabaseReady()) return false;

  const { error } = await supabase
    .from('available_slots')
    .delete()
    .eq('date', date);

  if (error) {
    console.error('Error eliminando horario:', error);
    return false;
  }
  return true;
}

// ─── AVAILABILITY CONFIG ────────────────────────────────────

export async function getAvailability() {
  if (!isSupabaseReady()) {
    return {
      start_hour: '09:00',
      end_hour: '20:00',
      slot_duration: 60,
      blocked_days: [0],
      blocked_dates: [],
    };
  }

  const { data, error } = await supabase
    .from('availability_config')
    .select('*')
    .single();

  if (error) {
    console.error('Error obteniendo configuración de disponibilidad:', error);
    return {
      start_hour: '09:00',
      end_hour: '20:00',
      slot_duration: 60,
      blocked_days: [0],
      blocked_dates: [],
    };
  }
  return data;
}

export async function saveAvailability(config) {
  if (!isSupabaseReady()) return null;

  const { data, error } = await supabase
    .from('availability_config')
    .upsert({
      id: 1,
      start_hour: config.startHour || config.start_hour,
      end_hour: config.endHour || config.end_hour,
      slot_duration: config.slotDuration || config.slot_duration,
      blocked_days: config.blockedDays || config.blocked_days,
      blocked_dates: config.blockedDates || config.blocked_dates,
    })
    .select()
    .single();

  if (error) {
    console.error('Error guardando configuración de disponibilidad:', error);
    return null;
  }
  return data;
}
