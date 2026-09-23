-- =============================================
-- Pestañas By Liz - Schema para Supabase
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. SERVICIOS
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'pestanas',
  price NUMERIC NOT NULL DEFAULT 0,
  deposit NUMERIC NOT NULL DEFAULT 0,
  duration TEXT DEFAULT '60 min',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TURNOS / CITAS
CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  service_id BIGINT,
  service_name TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  deposit_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GALERÍA DE TRABAJOS
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HORARIOS DISPONIBLES POR DÍA
CREATE TABLE IF NOT EXISTS available_slots (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  times JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONFIGURACIÓN DE DISPONIBILIDAD (una sola fila)
CREATE TABLE IF NOT EXISTS availability_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  start_hour TEXT DEFAULT '09:00',
  end_hour TEXT DEFAULT '20:00',
  slot_duration INTEGER DEFAULT 60,
  blocked_days JSONB DEFAULT '[0]',
  blocked_dates JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DATOS INICIALES (los mismos que tenías)
-- =============================================

INSERT INTO services (name, category, price, deposit, duration) VALUES
  ('Extensiones Clásicas', 'pestanas', 15000, 5000, '90 min'),
  ('Volumen Ruso', 'pestanas', 18000, 5000, '120 min'),
  ('Perfilado y Laminado', 'cejas', 8000, 3000, '45 min'),
  ('Limpieza Facial Profunda', 'cosmetologia', 12000, 4000, '60 min')
ON CONFLICT DO NOTHING;

INSERT INTO availability_config (id, start_hour, end_hour, slot_duration, blocked_days, blocked_dates)
VALUES (1, '09:00', '20:00', 60, '[0]', '[]')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Permitir lectura pública y escritura pública
-- (en producción podés restringir escritura)
-- =============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_config ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Lectura pública de servicios" ON services FOR SELECT USING (true);
CREATE POLICY "Lectura pública de turnos" ON appointments FOR SELECT USING (true);
CREATE POLICY "Lectura pública de galería" ON gallery FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON available_slots FOR SELECT USING (true);
CREATE POLICY "Lectura pública de config" ON availability_config FOR SELECT USING (true);

-- Políticas de escritura pública (para que el anon key pueda insertar/actualizar)
CREATE POLICY "Escritura pública de servicios" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escritura pública de turnos" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escritura pública de galería" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escritura pública de horarios" ON available_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escritura pública de config" ON availability_config FOR ALL USING (true) WITH CHECK (true);
