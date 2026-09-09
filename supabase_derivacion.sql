-- Agregar columnas de derivación a mensajes_whatsapp
alter table mensajes_whatsapp
  add column if not exists derivado_a_email text,
  add column if not exists derivado_a_nombre text,
  add column if not exists derivado_en timestamptz;
