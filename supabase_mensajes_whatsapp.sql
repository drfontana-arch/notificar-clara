-- Ejecutar en Supabase → SQL Editor
-- Tabla de mensajes WhatsApp entrantes

create table if not exists mensajes_whatsapp (
  id            uuid primary key default gen_random_uuid(),
  notificacion_id uuid references notificaciones(id) on delete set null,
  telefono_origen text not null,
  texto         text not null,
  clasificacion text not null default 'sin_categoria',
    -- 'urgente' | 'informativo' | 'sin_categoria'
  estado        text not null default 'pendiente',
    -- 'pendiente' | 'atendido'
  nota_empleado text,
  recibido_en   timestamptz not null default now(),
  atendido_en   timestamptz
);

create index if not exists mensajes_whatsapp_notif_idx  on mensajes_whatsapp (notificacion_id);
create index if not exists mensajes_whatsapp_estado_idx on mensajes_whatsapp (estado);
create index if not exists mensajes_whatsapp_fecha_idx  on mensajes_whatsapp (recibido_en desc);
create index if not exists mensajes_whatsapp_tel_idx    on mensajes_whatsapp (telefono_origen);
