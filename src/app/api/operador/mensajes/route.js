import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/operador/mensajes?estado=pendiente|atendido|todos&limit=50&offset=0
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') || 'todos'
    const limit  = parseInt(searchParams.get('limit')  || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const db = supabaseAdmin()

    let query = db
      .from('mensajes_whatsapp')
      .select(`
        id,
        notificacion_id,
        telefono_origen,
        texto,
        clasificacion,
        estado,
        nota_empleado,
        recibido_en,
        atendido_en,
        notificaciones (
          tipo_acto,
          datos_procesados
        )
      `, { count: 'exact' })
      .order('recibido_en', { ascending: false })
      .range(offset, offset + limit - 1)

    if (estado !== 'todos') {
      query = query.eq('estado', estado)
    }

    const { data, error, count } = await query
    if (error) throw error

    const mensajes = (data || []).map((m) => ({
      id:              m.id,
      notificacion_id: m.notificacion_id,
      telefono_origen: m.telefono_origen,
      texto:           m.texto,
      clasificacion:   m.clasificacion,
      estado:          m.estado,
      nota_empleado:   m.nota_empleado,
      recibido_en:     m.recibido_en,
      atendido_en:     m.atendido_en,
      // Datos de la notificación relacionada (si existe)
      tipo_acto:     m.notificaciones?.tipo_acto || null,
      ciudadano:     m.notificaciones?.datos_procesados?.nombre_ciudadano || null,
      numero_causa:  m.notificaciones?.datos_procesados?.datos_clave?.numero_causa || null,
      organo_emisor: m.notificaciones?.datos_procesados?.organo_emisor || null,
    }))

    return NextResponse.json({ mensajes, total: count || 0 })
  } catch (err) {
    console.error('[/api/operador/mensajes GET]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/operador/mensajes  →  marcar atendido o agregar nota
export async function PATCH(request) {
  try {
    const { id, estado, nota_empleado } = await request.json()
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const db = supabaseAdmin()
    const cambios = {}

    if (estado === 'atendido') {
      cambios.estado      = 'atendido'
      cambios.atendido_en = new Date().toISOString()
    } else if (estado === 'pendiente') {
      cambios.estado      = 'pendiente'
      cambios.atendido_en = null
    }

    if (nota_empleado !== undefined) {
      cambios.nota_empleado = nota_empleado
    }

    if (Object.keys(cambios).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }

    const { error } = await db.from('mensajes_whatsapp').update(cambios).eq('id', id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/operador/mensajes PATCH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
