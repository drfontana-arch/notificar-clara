import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { notificacion_id, tipo_evento, dispositivo, sistema_operativo } = body

    if (!notificacion_id || !tipo_evento) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'desconocida'

    const db = supabaseAdmin()
    const { error } = await db.from('eventos').insert({
      notificacion_id,
      tipo_evento,
      dispositivo: dispositivo || null,
      sistema_operativo: sistema_operativo || null,
      ip,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error en /api/evento:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
