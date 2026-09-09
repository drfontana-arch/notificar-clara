import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { enviarAlertaEmpleado } from '@/lib/email'

const db = () => supabaseAdmin()

// GET /api/agenda/citas?numero_causa=&letrado_id=&estado=&fecha_desde=&fecha_hasta=
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const numero_causa  = searchParams.get('numero_causa')
    const letrado_id    = searchParams.get('letrado_id')
    const estado        = searchParams.get('estado')
    const fecha_desde   = searchParams.get('fecha_desde')
    const fecha_hasta   = searchParams.get('fecha_hasta')

    let query = db()
      .from('citas')
      .select(`
        id,
        numero_causa,
        telefono_ciudadano,
        fecha_hora,
        modalidad,
        estado,
        nota,
        propuesta_por,
        confirmada_por,
        propuesta_en,
        confirmada_en,
        notificacion_id,
        letrado_id,
        letrados ( nombre, email, rol )
      `)
      .order('fecha_hora', { ascending: true })

    if (numero_causa) query = query.eq('numero_causa', numero_causa)
    if (letrado_id)   query = query.eq('letrado_id', letrado_id)
    if (estado)       query = query.eq('estado', estado)
    if (fecha_desde)  query = query.gte('fecha_hora', fecha_desde)
    if (fecha_hasta)  query = query.lte('fecha_hora', fecha_hasta)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ citas: data || [] })
  } catch (err) {
    console.error('[GET /api/agenda/citas]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/agenda/citas — proponer una nueva cita
export async function POST(request) {
  try {
    const {
      numero_causa,
      telefono_ciudadano,
      letrado_id,
      fecha_hora,
      modalidad = 'telefonica',
      nota,
      propuesta_por,
      notificacion_id,
    } = await request.json()

    if (!numero_causa || !telefono_ciudadano || !letrado_id || !fecha_hora) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const { data: cita, error } = await db()
      .from('citas')
      .insert({
        numero_causa,
        telefono_ciudadano,
        letrado_id,
        fecha_hora,
        modalidad,
        nota,
        propuesta_por,
        notificacion_id: notificacion_id || null,
        estado: 'propuesta',
        propuesta_en: new Date().toISOString(),
      })
      .select('*, letrados(nombre, email)')
      .single()

    if (error) throw error

    // Notificar al letrado para que confirme
    if (cita?.letrados?.email) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notificar-clara.vercel.app'
      const fecha = new Date(fecha_hora).toLocaleString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
      })
      await enviarCitaPropuesta({
        to: cita.letrados.email,
        nombre: cita.letrados.nombre,
        numero_causa,
        fecha,
        modalidad,
        nota,
        urlAgenda: `${baseUrl}/operador/agenda`,
      })
    }

    return NextResponse.json({ cita })
  } catch (err) {
    console.error('[POST /api/agenda/citas]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/agenda/citas — confirmar, modificar o cancelar
export async function PATCH(request) {
  try {
    const { id, estado, fecha_hora, nota, confirmada_por } = await request.json()
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const cambios = {}
    if (estado)      cambios.estado = estado
    if (fecha_hora)  cambios.fecha_hora = fecha_hora
    if (nota !== undefined) cambios.nota = nota

    if (estado === 'confirmada') {
      cambios.confirmada_por = confirmada_por || null
      cambios.confirmada_en  = new Date().toISOString()
    }

    const { data: cita, error } = await db()
      .from('citas')
      .update(cambios)
      .eq('id', id)
      .select('*, letrados(nombre, email)')
      .single()

    if (error) throw error

    return NextResponse.json({ cita })
  } catch (err) {
    console.error('[PATCH /api/agenda/citas]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── Helper email cita propuesta ────────────────────────────────
async function enviarCitaPropuesta({ to, nombre, numero_causa, fecha, modalidad, nota, urlAgenda }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const modalidadLabel = { telefonica: '📞 Telefónica', presencial: '🏛️ Presencial', videoconferencia: '💻 Videoconferencia' }[modalidad] || modalidad

  const html = `
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f0f4f8;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <div style="background:#003366;padding:16px 24px;">
      <div style="color:#fff;font-weight:700;font-size:14px;">NotificAR Clara</div>
      <div style="color:#00C2C2;font-size:11px;font-family:monospace;">NUEVA CITA PROPUESTA — REQUIERE CONFIRMACIÓN</div>
    </div>
    <div style="padding:20px 24px;space-y:12px;">
      <p style="font-size:14px;color:#111827;">Hola <strong>${nombre}</strong>, se propuso una cita para confirmar:</p>
      <table style="width:100%;font-size:13px;border-collapse:collapse;margin:12px 0;">
        <tr><td style="padding:6px 0;color:#6b7280;">Causa</td><td style="padding:6px 0;font-weight:600;">N° ${numero_causa}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Fecha y hora</td><td style="padding:6px 0;font-weight:600;">${fecha}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Modalidad</td><td style="padding:6px 0;">${modalidadLabel}</td></tr>
        ${nota ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Nota</td><td style="padding:6px 0;">${nota}</td></tr>` : ''}
      </table>
      <a href="${urlAgenda}" style="display:inline-block;background:#003366;color:#fff;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px;text-decoration:none;margin-top:8px;">
        Confirmar o modificar →
      </a>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:12px 24px;font-size:11px;color:#9ca3af;">
      NotificAR Clara · Sistema de notificaciones judiciales en lenguaje claro
    </div>
  </div>
</body></html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'NotificAR Clara <onboarding@resend.dev>',
      to: [to],
      subject: `📅 Cita propuesta para confirmar — Causa N° ${numero_causa}`,
      html,
    }),
  })
}
