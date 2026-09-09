import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// PATCH /api/telefono-ciudadano
// Guarda el teléfono que el ciudadano aporta voluntariamente desde la página del QR
export async function PATCH(request) {
  try {
    const { id, telefono } = await request.json()
    if (!id || !telefono) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    // Normalizar: solo dígitos
    const telNormalizado = telefono.replace(/\D/g, '')
    if (telNormalizado.length < 10) {
      return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { data: notif, error: getErr } = await db
      .from('notificaciones')
      .select('datos_procesados')
      .eq('id', id)
      .single()

    if (getErr || !notif) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    const nuevos_datos = { ...notif.datos_procesados, telefono_ciudadano: telNormalizado }
    const { error: updErr } = await db
      .from('notificaciones')
      .update({ datos_procesados: nuevos_datos })
      .eq('id', id)

    if (updErr) throw updErr
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
