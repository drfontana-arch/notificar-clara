-- Migración 003: Geolocalización en eventos + tracking de tokens
-- Ejecutar en Supabase SQL Editor

-- Geolocalización en eventos (se llena al insertar via ip-api)
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS ciudad     TEXT;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS provincia  TEXT;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS pais       TEXT;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS latitud    DECIMAL(9,6);
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS longitud   DECIMAL(9,6);

-- Token tracking en notificaciones (se llena al generar)
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS tokens_entrada INTEGER DEFAULT 0;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS tokens_salida  INTEGER DEFAULT 0;

-- Índice para consultas geográficas
CREATE INDEX IF NOT EXISTS eventos_ciudad_idx ON eventos (ciudad);
CREATE INDEX IF NOT EXISTS eventos_pais_idx   ON eventos (pais);
