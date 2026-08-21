-- Tabla de eventos de analítica
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS eventos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notificacion_id  UUID REFERENCES notificaciones(id) ON DELETE CASCADE,
  tipo_evento      TEXT NOT NULL,
  dispositivo      TEXT,
  sistema_operativo TEXT,
  ip               TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS eventos_notificacion_id_idx ON eventos (notificacion_id);
CREATE INDEX IF NOT EXISTS eventos_tipo_evento_idx     ON eventos (tipo_evento);
CREATE INDEX IF NOT EXISTS eventos_created_at_idx      ON eventos (created_at DESC);

-- RLS: escritura pública (anon puede insertar), lectura solo service_role
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_eventos" ON eventos
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "read_eventos_admin" ON eventos
  FOR SELECT TO service_role
  USING (true);

-- Comentario con los tipos de evento registrados
COMMENT ON TABLE eventos IS
'Eventos de analítica de NotificAR Clara.
Tipos: qr_scan, video_completado, video_saltado, escuchar_notificacion,
escuchar_respuesta_clara, lectura_completa, click_whatsapp_organo,
click_whatsapp_abogado, click_pdf, click_maps, click_ajuste_razonable,
click_apelar_organo, click_apelar_abogado, pregunta_libre';
