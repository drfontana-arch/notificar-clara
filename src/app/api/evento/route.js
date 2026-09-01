import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Geolocalizar IP usando ipwho.is (HTTPS, gratuito, sin API key)
async function geolocalizarIP(ip) {
  if (!ip || ip === 'desconocida' || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {}
  }
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(2500) })
    if (!res.ok) return {}
    const data = await res.json()
    if (!data.success) return {}
    return {
      ciudad:   data.city       || null,
      provincia: data.region    || null,
      pais:     data.country    || null,
      latitud:  data.latitude   || null,
      longitud: data.longitude  || null,
    }
  } catch {
    return {}
  }
}

export async function POST(request) {
  try {
    const { notificacion_id, tipo_evento, dispositivo, sistema_operativo } = await request.json()

    if (!tipo_evento) return NextResponse.json({ error: 'Falta tipo_evento' }, { status: 400 })

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           || request.headers.get('x-real-ip')
           || 'desconocida'

    // Geolocalización silenciosa (no bloquea si falla)
    const geo = await geolocalizarIP(ip)

    const db = supabaseAdmin()
    await db.from('eventos').insert({
      notificacion_id,
      tipo_evento,
      dispositivo,
      sistema_operativo,
      ip,
      ...geo,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
