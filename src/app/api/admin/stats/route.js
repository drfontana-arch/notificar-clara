import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAdmin()

    // Total notificaciones
    const { count: totalNotif } = await db
      .from('notificaciones')
      .select('*', { count: 'exact', head: true })

    // Últimas 50 notificaciones con campos clave
    const { data: ultimas } = await db
      .from('notificaciones')
      .select('id, tipo_acto, creado_en, datos_procesados')
      .order('creado_en', { ascending: false })
      .limit(50)

    // Agregados desde datos_procesados
    const { data: todasNotif } = await db
      .from('notificaciones')
      .select('tipo_acto, datos_procesados')

    const porTipoActo = {}
    const porDestinatario = {}
    const porUrgencia = {}
    const porDiscapacidad = {}

    for (const n of todasNotif || []) {
      const d = n.datos_procesados || {}
      porTipoActo[n.tipo_acto] = (porTipoActo[n.tipo_acto] || 0) + 1
      const dest = d.tipo_destinatario || 'desconocido'
      porDestinatario[dest] = (porDestinatario[dest] || 0) + 1
      const urg = d.nivel_urgencia || 'sin_dato'
      porUrgencia[urg] = (porUrgencia[urg] || 0) + 1
      const disc = d.tipo_discapacidad || 'ninguna'
      porDiscapacidad[disc] = (porDiscapacidad[disc] || 0) + 1
    }

    // Eventos
    const { count: totalEventos } = await db
      .from('eventos')
      .select('*', { count: 'exact', head: true })

    const { data: todosEventos } = await db
      .from('eventos')
      .select('tipo_evento, dispositivo, sistema_operativo')

    const porTipoEvento = {}
    const porDispositivo = {}
    const porSO = {}

    for (const e of todosEventos || []) {
      porTipoEvento[e.tipo_evento] = (porTipoEvento[e.tipo_evento] || 0) + 1
      const disp = e.dispositivo || 'desconocido'
      porDispositivo[disp] = (porDispositivo[disp] || 0) + 1
      const so = e.sistema_operativo || 'desconocido'
      porSO[so] = (porSO[so] || 0) + 1
    }

    return NextResponse.json({
      total_notificaciones: totalNotif || 0,
      por_tipo_acto: Object.entries(porTipoActo).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_destinatario: Object.entries(porDestinatario).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_urgencia: Object.entries(porUrgencia).map(([k, v]) => ({ label: k, count: v })),
      por_discapacidad: Object.entries(porDiscapacidad).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      total_eventos: totalEventos || 0,
      por_tipo_evento: Object.entries(porTipoEvento).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_dispositivo: Object.entries(porDispositivo).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_so: Object.entries(porSO).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      ultimas: (ultimas || []).map(n => ({
        id: n.id,
        tipo_acto: n.tipo_acto,
        creado_en: n.creado_en,
        destinatario: n.datos_procesados?.tipo_destinatario || '—',
        urgencia: n.datos_procesados?.nivel_urgencia || '—',
        discapacidad: n.datos_procesados?.tipo_discapacidad || null,
        titulo: n.datos_procesados?.titulo_explicacion || '—',
        numero_causa: n.datos_procesados?.datos_clave?.numero_causa || null,
      })),
    })
  } catch (err) {
    console.error('Error en /api/admin/stats:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
