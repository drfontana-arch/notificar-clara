import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { responderPreguntaLibre } from '@/lib/anthropic'

// GET /api/notificacion?id=xxx  → devuelve los datos de una notificación
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('notificaciones')
      .select('id, tipo_acto, datos_procesados, creado_en')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/notificacion  → responde una pregunta libre sobre la notificación
export async function POST(request) {
  try {
    const { id, pregunta } = await request.json()
    if (!id || !pregunta) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('notificaciones')
      .select('datos_procesados')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    const respuesta = await responderPreguntaLibre(pregunta, data.datos_procesados)
    return NextResponse.json({ respuesta })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
