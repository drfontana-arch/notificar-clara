import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Precio estimado Haiku 4.5 (USD por token)
const PRECIO_ENTRADA  = 0.80  / 1_000_000
const PRECIO_SALIDA   = 4.00  / 1_000_000

export async function GET() {
  try {
    const db = supabaseAdmin()

    // ── Notificaciones ──────────────────────────────────────
    const { count: totalNotif } = await db
      .from('notificaciones')
      .select('*', { count: 'exact', head: true })

    const { data: ultimas } = await db
      .from('notificaciones')
      .select('id, tipo_acto, creado_en, datos_procesados')
      .order('creado_en', { ascending: false })
      .limit(50)

    const { data: todasNotif } = await db
      .from('notificaciones')
      .select('tipo_acto, datos_procesados, tokens_entrada, tokens_salida')

    const porTipoActo    = {}
    const porDestinatario = {}
    const porUrgencia    = {}
    const porDiscapacidad = {}
    let sumTokensEntrada  = 0
    let sumTokensSalida   = 0

    for (const n of todasNotif || []) {
      const d = n.datos_procesados || {}
      porTipoActo[n.tipo_acto] = (porTipoActo[n.tipo_acto] || 0) + 1
      const dest = d.tipo_destinatario || 'desconocido'
      porDestinatario[dest] = (porDestinatario[dest] || 0) + 1
      const urg = d.nivel_urgencia || 'sin_dato'
      porUrgencia[urg] = (porUrgencia[urg] || 0) + 1
      const disc = d.tipo_discapacidad || 'ninguna'
      porDiscapacidad[disc] = (porDiscapacidad[disc] || 0) + 1
      sumTokensEntrada += n.tokens_entrada || 0
      sumTokensSalida  += n.tokens_salida  || 0
    }

    const costoEstimadoUSD = sumTokensEntrada * PRECIO_ENTRADA + sumTokensSalida * PRECIO_SALIDA

    // ── Eventos ────────────────────────────────────────────
    const { count: totalEventos } = await db
      .from('eventos')
      .select('*', { count: 'exact', head: true })

    const { data: todosEventos } = await db
      .from('eventos')
      .select('tipo_evento, dispositivo, sistema_operativo, created_at, ciudad, provincia, pais')

    const porTipoEvento  = {}
    const porDispositivo = {}
    const porSO          = {}
    const porCiudad      = {}
    const porPais        = {}
    const scansPorDia    = {}  // { 'YYYY-MM-DD': count }

    // Ventana de 60 días para el timeline
    const hace60 = new Date()
    hace60.setDate(hace60.getDate() - 60)

    for (const e of todosEventos || []) {
      porTipoEvento[e.tipo_evento] = (porTipoEvento[e.tipo_evento] || 0) + 1
      porDispositivo[e.dispositivo || 'desconocido'] = (porDispositivo[e.dispositivo || 'desconocido'] || 0) + 1
      porSO[e.sistema_operativo || 'desconocido'] = (porSO[e.sistema_operativo || 'desconocido'] || 0) + 1

      if (e.tipo_evento === 'qr_scan') {
        const ciudad = e.ciudad || 'Sin dato'
        const pais   = e.pais   || 'Sin dato'
        porCiudad[ciudad] = (porCiudad[ciudad] || 0) + 1
        porPais[pais]     = (porPais[pais]     || 0) + 1

        if (e.created_at) {
          const fecha = new Date(e.created_at)
          if (fecha >= hace60) {
            const dia = fecha.toISOString().slice(0, 10) // YYYY-MM-DD
            scansPorDia[dia] = (scansPorDia[dia] || 0) + 1
          }
        }
      }
    }

    // Completar días vacíos en el timeline (últimos 60 días)
    const timeline = []
    for (let i = 59; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      timeline.push({ fecha: key, scans: scansPorDia[key] || 0 })
    }

    return NextResponse.json({
      total_notificaciones: totalNotif || 0,
      por_tipo_acto:    Object.entries(porTipoActo).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_destinatario: Object.entries(porDestinatario).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_urgencia:     Object.entries(porUrgencia).map(([k, v]) => ({ label: k, count: v })),
      por_discapacidad: Object.entries(porDiscapacidad).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      total_eventos:    totalEventos || 0,
      por_tipo_evento:  Object.entries(porTipoEvento).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_dispositivo:  Object.entries(porDispositivo).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      por_so:           Object.entries(porSO).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      // Nuevos
      timeline,
      por_ciudad: Object.entries(porCiudad).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count).slice(0, 15),
      por_pais:   Object.entries(porPais).map(([k, v]) => ({ label: k, count: v })).sort((a, b) => b.count - a.count),
      tokens: {
        total_entrada:       sumTokensEntrada,
        total_salida:        sumTokensSalida,
        total:               sumTokensEntrada + sumTokensSalida,
        costo_estimado_usd:  Math.round(costoEstimadoUSD * 10000) / 10000,
      },
      ultimas: (ultimas || []).map(n => ({
        id:          n.id,
        tipo_acto:   n.tipo_acto,
        creado_en:   n.creado_en,
        destinatario: n.datos_procesados?.tipo_destinatario || '—',
        urgencia:    n.datos_procesados?.nivel_urgencia || '—',
        discapacidad: n.datos_procesados?.tipo_discapacidad || null,
        titulo:      n.datos_procesados?.titulo_explicacion || '—',
        numero_causa: n.datos_procesados?.datos_clave?.numero_causa || null,
      })),
    })
  } catch (err) {
    console.error('Error en /api/admin/stats:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
