import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { enviarAlertaEmpleado } from '@/lib/email'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Normaliza número a solo dígitos
function normalizarTelefono(tel) {
  return (tel || '').replace(/\D/g, '')
}

// Extrae { telefono, texto } del payload del BSP
// Soporta formato YCloud y 360dialog / Meta Cloud API
function parsearPayload(body) {
  // ── Formato Meta Cloud API / 360dialog ──
  if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    const msg = body.entry[0].changes[0].value.messages[0]
    if (msg.type !== 'text') return null
    return {
      telefono: normalizarTelefono(msg.from),
      texto: msg.text?.body || '',
    }
  }

  // ── Formato YCloud ──
  if (body?.type === 'message' && body?.payload) {
    const p = body.payload
    if (p.type !== 'text') return null
    return {
      telefono: normalizarTelefono(p.from),
      texto: p.text?.body || p.text || '',
    }
  }

  // ── Formato genérico de fallback ──
  if (body?.from && body?.text) {
    return {
      telefono: normalizarTelefono(body.from),
      texto: body.text?.body || body.text || '',
    }
  }

  return null
}

// Clasifica el mensaje con Haiku
async function clasificarMensaje(texto) {
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      system: `Clasificá mensajes de ciudadanos que responden a notificaciones judiciales.
Devolvé SOLO una de estas tres palabras:
- urgente: confusión, no entiende, no sabe qué hacer, no puede ir, pide ayuda inmediata, expresa angustia
- informativo: confirma acciones realizadas, agradece, informa algo concreto
- sin_categoria: todo lo demás`,
      messages: [{ role: 'user', content: texto }],
    })
    const r = response.content[0].text.trim().toLowerCase()
    if (['urgente', 'informativo', 'sin_categoria'].includes(r)) return r
    return 'sin_categoria'
  } catch {
    return 'sin_categoria'
  }
}

// GET — verificación del webhook (algunos BSPs hacen un GET con hub.challenge)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('hub.challenge')
  const token = searchParams.get('hub.verify_token')

  if (token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Unauthorized', { status: 403 })
}

// POST — mensaje entrante del BSP
export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = parsearPayload(body)

    // Ignorar mensajes que no son de texto o formato desconocido
    if (!parsed || !parsed.texto) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { telefono, texto } = parsed
    const db = supabaseAdmin()

    // Buscar notificación por teléfono del ciudadano
    const { data: notifs } = await db
      .from('notificaciones')
      .select('id, datos_procesados')
      .filter('datos_procesados->>telefono_ciudadano', 'eq', telefono)
      .order('creado_en', { ascending: false })
      .limit(1)

    const notificacion_id = notifs?.[0]?.id || null
    const datosCausa = notifs?.[0]?.datos_procesados || null

    // Clasificar con Haiku
    const clasificacion = await clasificarMensaje(texto)

    // Guardar mensaje
    const { error } = await db.from('mensajes_whatsapp').insert({
      notificacion_id,
      telefono_origen: telefono,
      texto,
      clasificacion,
      estado: 'pendiente',
      recibido_en: new Date().toISOString(),
    })

    if (error) {
      console.error('[webhook] Error al guardar mensaje:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notificar al empleado responsable si hay match de causa y tiene email
    if (notificacion_id && datosCausa?.empleado_email) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notificar-clara.vercel.app'
      await enviarAlertaEmpleado({
        to: datosCausa.empleado_email,
        clasificacion,
        texto,
        telefono,
        numero_causa: datosCausa?.datos_clave?.numero_causa || null,
        tipo_acto: datosCausa?.tipo_acto || null,
        urlPanel: `${baseUrl}/operador/mensajes`,
        urlNotif: `${baseUrl}/n/${notificacion_id}`,
      })
    }

    return NextResponse.json({ ok: true, clasificacion, matched: !!notificacion_id })
  } catch (err) {
    console.error('[webhook] Error inesperado:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
