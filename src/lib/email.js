/**
 * email.js — envío de emails vía Resend REST API
 * Documentación: https://resend.com/docs/api-reference/emails/send-email
 *
 * Requiere: RESEND_API_KEY en variables de entorno
 * From:     notificaciones@notificar-clara.com (o resend.dev para el piloto)
 */

const RESEND_API_URL = 'https://api.resend.com/emails'

// Dirección remitente — usar onboarding@resend.dev en el piloto (no requiere dominio verificado)
const FROM = process.env.RESEND_FROM || 'NotificAR Clara <onboarding@resend.dev>'

/**
 * Envía un email de alerta al empleado responsable cuando llega un mensaje de un ciudadano.
 *
 * @param {Object} opts
 * @param {string} opts.to             - Email del empleado
 * @param {string} opts.clasificacion  - 'urgente' | 'informativo' | 'sin_categoria'
 * @param {string} opts.texto          - Texto del mensaje del ciudadano
 * @param {string} opts.telefono       - Teléfono del ciudadano (solo dígitos)
 * @param {string|null} opts.numero_causa - Número de causa (si aplica)
 * @param {string|null} opts.tipo_acto    - Tipo de acto procesal
 * @param {string} opts.urlPanel       - URL al panel de mensajes
 * @param {string|null} opts.urlNotif  - URL a la notificación del ciudadano
 */
export async function enviarAlertaEmpleado({
  to,
  clasificacion,
  texto,
  telefono,
  numero_causa,
  tipo_acto,
  urlPanel,
  urlNotif,
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY no configurado — email no enviado')
    return { ok: false, skipped: true }
  }

  const esUrgente = clasificacion === 'urgente'
  const urgenciaLabel = esUrgente ? '🔴 URGENTE' : clasificacion === 'informativo' ? '🟢 Informativo' : '⚪ Sin categoría'
  const causaLabel = numero_causa ? `Causa N° ${numero_causa}${tipo_acto ? ` — ${tipo_acto}` : ''}` : 'Sin expediente asignado'

  const subject = esUrgente
    ? `🔴 Mensaje urgente de ciudadano — ${causaLabel}`
    : `Nuevo mensaje WhatsApp — ${causaLabel}`

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f0f4f8;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:#003366;padding:16px 24px;display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;background:#00C2C2;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;flex-shrink:0;">C</div>
      <div>
        <div style="color:#fff;font-weight:700;font-size:14px;">NotificAR Clara</div>
        <div style="color:#00C2C2;font-size:11px;font-family:monospace;">ALERTA DE MENSAJE WHATSAPP</div>
      </div>
    </div>

    <!-- Urgencia badge -->
    <div style="padding:16px 24px 0;">
      <span style="display:inline-block;background:${esUrgente ? '#fee2e2' : '#dcfce7'};color:${esUrgente ? '#991b1b' : '#166534'};font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;">${urgenciaLabel}</span>
    </div>

    <!-- Causa -->
    <div style="padding:12px 24px 0;">
      <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;">Expediente</div>
      <div style="font-size:14px;font-weight:600;color:#111827;">${causaLabel}</div>
    </div>

    <!-- Teléfono -->
    <div style="padding:8px 24px 0;">
      <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;">Teléfono del ciudadano</div>
      <div style="font-size:13px;color:#374151;">+${telefono}</div>
    </div>

    <!-- Mensaje -->
    <div style="padding:16px 24px;">
      <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">Mensaje recibido</div>
      <div style="background:#f0fdf4;border-radius:0 10px 10px 10px;padding:12px 14px;font-size:13px;color:#065f46;line-height:1.6;border-left:3px solid #22c55e;">
        "${texto}"
      </div>
    </div>

    ${esUrgente ? `
    <div style="margin:0 24px 16px;background:#fef2f2;border-radius:8px;padding:10px 14px;font-size:12px;color:#991b1b;">
      ⚠️ Este mensaje fue clasificado como <strong>urgente</strong>. El ciudadano puede estar confundido o necesitar orientación inmediata.
    </div>` : ''}

    <!-- Botones -->
    <div style="padding:0 24px 24px;display:flex;gap:10px;flex-wrap:wrap;">
      <a href="${urlPanel}" style="display:inline-block;background:#003366;color:#fff;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px;text-decoration:none;">
        Ver en el panel →
      </a>
      ${urlNotif ? `<a href="${urlNotif}" style="display:inline-block;background:#f3f4f6;color:#374151;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px;text-decoration:none;border:1px solid #e5e7eb;">Ver notificación</a>` : ''}
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:12px 24px;font-size:11px;color:#9ca3af;">
      NotificAR Clara · Sistema de notificaciones judiciales en lenguaje claro · Provincia de Buenos Aires
    </div>
  </div>
</body>
</html>`

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Error Resend:', res.status, err)
      return { ok: false, error: err }
    }

    const data = await res.json()
    console.log('[email] Enviado OK:', data.id)
    return { ok: true, id: data.id }
  } catch (err) {
    console.error('[email] Error de red:', err)
    return { ok: false, error: err.message }
  }
}
