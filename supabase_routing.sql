-- ─────────────────────────────────────────────────────────────
-- MÓDULO DE ROUTING Y AGENDA — NotificAR Clara
-- Correr en Supabase SQL Editor (sin RLS para el piloto)
-- ─────────────────────────────────────────────────────────────

-- 1. UNIDADES FUNCIONALES
-- Ej: Defensoría de Juicio Nº1, Secretaría de Ejecución, Mesa de Entradas
create table if not exists unidades (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  tipo        text not null, -- 'defensoria' | 'secretaria_ejecucion' | 'mesa_entradas' | 'otro'
  email       text,          -- email de contacto general de la unidad (fallback)
  creado_en   timestamptz not null default now()
);

-- 2. LETRADOS / EMPLEADOS
create table if not exists letrados (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  email       text not null unique,
  rol         text not null, -- 'defensor' | 'secretario' | 'mesa_entradas' | 'otro'
  unidad_id   uuid references unidades(id) on delete set null,
  activo      boolean not null default true,
  creado_en   timestamptz not null default now()
);

-- 3. ASIGNACIÓN LETRADO ↔ CAUSA
-- Una causa puede tener defensor Y secretario
create table if not exists causas_letrados (
  id              uuid primary key default gen_random_uuid(),
  numero_causa    text not null,           -- ej: "12450/2026"
  letrado_id      uuid not null references letrados(id) on delete cascade,
  rol_en_causa    text not null,           -- 'defensor' | 'secretario'
  instancia       text not null,           -- 'ipp_sin_imputado' | 'ipp_con_imputado' | 'juicio' | 'ejecucion'
  activo          boolean not null default true,
  creado_en       timestamptz not null default now(),
  unique (numero_causa, rol_en_causa)      -- un solo defensor y un solo secretario por causa
);

create index if not exists idx_causas_letrados_numero on causas_letrados(numero_causa);

-- 4. REGLAS DE ROUTING
-- Define a qué rol derivar según instancia + clasificación del mensaje
create table if not exists reglas_routing (
  id              uuid primary key default gen_random_uuid(),
  instancia       text not null,           -- 'ipp_sin_imputado' | 'ipp_con_imputado' | 'juicio' | 'ejecucion'
  clasificacion   text,                    -- 'urgente' | 'informativo' | 'sin_categoria' | NULL = cualquiera
  rol_destino     text not null,           -- 'defensor' | 'secretario' | 'mesa_entradas' | 'secretaria_ejecucion'
  prioridad       integer not null default 10,  -- menor número = se evalúa primero
  activo          boolean not null default true,
  creado_en       timestamptz not null default now()
);

-- Reglas iniciales para fuero penal
insert into reglas_routing (instancia, clasificacion, rol_destino, prioridad) values
  ('ipp_sin_imputado',  null,            'mesa_entradas',          10),
  ('ipp_con_imputado',  null,            'secretario',             10),
  ('juicio',            'urgente',       'defensor',               10),
  ('juicio',            'informativo',   'secretario',             20),
  ('juicio',            'sin_categoria', 'secretario',             20),
  ('ejecucion',         null,            'secretaria_ejecucion',   10);

-- 5. CITAS
create table if not exists citas (
  id              uuid primary key default gen_random_uuid(),
  numero_causa    text not null,
  telefono_ciudadano text not null,
  letrado_id      uuid references letrados(id) on delete set null,
  fecha_hora      timestamptz not null,
  modalidad       text not null default 'telefonica',  -- 'telefonica' | 'presencial' | 'videoconferencia'
  estado          text not null default 'propuesta',   -- 'propuesta' | 'confirmada' | 'cumplida' | 'cancelada'
  nota            text,
  propuesta_por   text,   -- email de quien propuso el turno
  confirmada_por  text,   -- email del letrado que confirmó
  propuesta_en    timestamptz not null default now(),
  confirmada_en   timestamptz,
  notificacion_id uuid references notificaciones(id) on delete set null
);

create index if not exists idx_citas_causa     on citas(numero_causa);
create index if not exists idx_citas_telefono  on citas(telefono_ciudadano);
create index if not exists idx_citas_estado    on citas(estado);
create index if not exists idx_citas_fecha     on citas(fecha_hora);
