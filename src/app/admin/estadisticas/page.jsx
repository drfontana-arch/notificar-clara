'use client'
import { useEffect, useState } from 'react'

const URGENCIA_COLOR = {
  rojo:    'bg-red-100 text-red-700',
  amarillo:'bg-yellow-100 text-yellow-700',
  verde:   'bg-green-100 text-green-700',
  sin_dato:'bg-gray-100 text-gray-500',
}
const URGENCIA_EMOJI = { rojo:'🔴', amarillo:'🟡', verde:'🟢', sin_dato:'⚪' }

function BarChart({ data, colorClass = 'bg-blue-500' }) {
  if (!data?.length) return <p className="text-sm text-gray-400 italic">Sin datos</p>
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="space-y-2">
      {data.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-32 truncate shrink-0">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className={`h-5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}

function TimelineChart({ data }) {
  if (!data?.length) return <p className="text-sm text-gray-400 italic">Sin datos</p>
  const max = Math.max(...data.map(d => d.scans), 1)
  // Mostrar últimos 30 días (más legible)
  const visible = data.slice(-30)
  return (
    <div>
      <div className="flex items-end gap-0.5 h-24 mt-2">
        {visible.map(({ fecha, scans }) => (
          <div key={fecha} className="flex-1 flex flex-col items-center justify-end group relative">
            <div
              className="w-full bg-teal-500 rounded-t transition-all duration-300 hover:bg-teal-400 min-h-[2px]"
              style={{ height: `${(scans / max) * 100}%` }}
            />
            {/* Tooltip */}
            {scans > 0 && (
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {fecha.slice(5)}: {scans} scan{scans !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{visible[0]?.fecha.slice(5)}</span>
        <span>{visible[Math.floor(visible.length / 2)]?.fecha.slice(5)}</span>
        <span>{visible[visible.length - 1]?.fecha.slice(5)}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">Últimos 30 días · pase el mouse sobre las barras</p>
    </div>
  )
}

function Tarjeta({ titulo, valor, sub, color = 'blue' }) {
  const border = { blue:'border-blue-400', green:'border-green-400', red:'border-red-400', purple:'border-purple-400', teal:'border-teal-400' }
  const text   = { blue:'text-blue-700',   green:'text-green-700',   red:'text-red-700',   purple:'text-purple-700',   teal:'text-teal-700' }
  return (
    <div className={`bg-white rounded-xl p-4 shadow border-l-4 ${border[color]}`}>
      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{titulo}</p>
      <p className={`text-3xl font-bold ${text[color]}`}>{valor}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function FooterRedMarea() {
  return (
    <footer className="mt-10 border-t border-gray-200 pt-6 pb-8 text-center space-y-1">
      <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Red Marea D+I</p>
      <p className="text-xs text-gray-400">
        Enzo Fontana ·{' '}
        <a href="mailto:dr.fontana@gmail.com" className="hover:underline">dr.fontana@gmail.com</a>
        {' '}·{' '}
        Laura Bulesevich ·{' '}
        <a href="mailto:bulesevichlaura@gmail.com" className="hover:underline">bulesevichlaura@gmail.com</a>
      </p>
      <p className="text-xs text-gray-300">NotificAR Clara — Provincia de Buenos Aires</p>
    </footer>
  )
}

export default function PanelEstadisticas() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroUrgencia, setFiltroUrgencia] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setStats(data)
      })
      .catch(() => setError('No se pudieron cargar las estadísticas.'))
  }, [])

  const recargar = () => {
    setStats(null)
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setError('Error al recargar.'))
  }

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    </div>
  )

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm animate-pulse">Cargando estadísticas...</p>
    </div>
  )

  const qrScans = stats.por_tipo_evento.find(e => e.label === 'qr_scan')?.count || 0
  const lecturas = stats.por_tipo_evento.find(e => e.label === 'lectura_completa')?.count || 0
  const tasaLectura = qrScans > 0 ? Math.round((lecturas / qrScans) * 100) : 0

  const ultimasFiltradas = (stats.ultimas || []).filter(n => {
    const q = busqueda.toLowerCase()
    const matchBusq = !q || n.titulo.toLowerCase().includes(q) || n.tipo_acto.toLowerCase().includes(q) || (n.numero_causa || '').toLowerCase().includes(q) || n.id.includes(q)
    const matchUrgencia = !filtroUrgencia || n.urgencia === filtroUrgencia
    const matchTipo = !filtroTipo || n.tipo_acto === filtroTipo
    return matchBusq && matchUrgencia && matchTipo
  })

  const tiposActo = [...new Set((stats.ultimas || []).map(n => n.tipo_acto))].sort()

  const { tokens } = stats

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <header className="px-5 py-4 bg-blue-900 shadow flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-base">NotificAR Clara — Estadísticas</h1>
          <p className="text-blue-200 text-xs">Panel de análisis y registro de notificaciones</p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="text-blue-200 text-xs underline">← Volver al panel</a>
          <button onClick={recargar} className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg ml-3">
            ↺ Actualizar
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Tarjetas resumen ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Tarjeta titulo="Notificaciones generadas" valor={stats.total_notificaciones} color="blue" />
          <Tarjeta titulo="QR escaneados" valor={qrScans} color="green" />
          <Tarjeta titulo="Lecturas completas" valor={lecturas} sub={`${tasaLectura}% de los escaneos`} color="purple" />
          <Tarjeta titulo="Total de eventos" valor={stats.total_eventos} color="blue" />
        </div>

        {/* ── Timeline de escaneos QR ── */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Escaneos QR por día</h2>
          <p className="text-xs text-gray-400 mb-3">Permite verificar si el sistema tuvo uso más allá de la ponencia</p>
          <TimelineChart data={stats.timeline} />
        </div>

        {/* ── Geolocalización + Gráficos ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">🌍 Por ciudad (QR scans)</h2>
            <p className="text-xs text-gray-400 mb-3">Solo escaneos con geolocalización disponible</p>
            <BarChart data={stats.por_ciudad} colorClass="bg-teal-500" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Por país</h2>
            <BarChart data={stats.por_pais} colorClass="bg-indigo-400" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Por tipo de acto</h2>
            <BarChart data={stats.por_tipo_acto} colorClass="bg-blue-500" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Por destinatario</h2>
            <BarChart data={stats.por_destinatario} colorClass="bg-teal-500" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Por nivel de urgencia</h2>
            <div className="flex gap-3">
              {stats.por_urgencia.map(({ label, count }) => (
                <div key={label} className={`flex-1 rounded-xl p-3 text-center ${URGENCIA_COLOR[label] || 'bg-gray-100'}`}>
                  <p className="text-2xl">{URGENCIA_EMOJI[label] || '⚪'}</p>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs capitalize">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Por discapacidad declarada</h2>
            <BarChart data={stats.por_discapacidad} colorClass="bg-purple-400" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Eventos por tipo</h2>
            <BarChart data={stats.por_tipo_evento} colorClass="bg-green-500" />
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Dispositivos</h2>
            <BarChart data={stats.por_dispositivo} colorClass="bg-orange-400" />
          </div>
        </div>

        {/* ── Uso de tokens ── */}
        {tokens && (
          <div className="bg-white rounded-xl p-5 shadow">
            <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">🤖 Uso de tokens (Claude Haiku 4.5)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-500 font-semibold uppercase mb-1">Tokens entrada</p>
                <p className="text-2xl font-bold text-blue-800">{tokens.total_entrada.toLocaleString('es-AR')}</p>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-purple-500 font-semibold uppercase mb-1">Tokens salida</p>
                <p className="text-2xl font-bold text-purple-800">{tokens.total_salida.toLocaleString('es-AR')}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total tokens</p>
                <p className="text-2xl font-bold text-gray-800">{tokens.total.toLocaleString('es-AR')}</p>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-3">
                <p className="text-xs text-green-600 font-semibold uppercase mb-1">Costo estimado</p>
                <p className="text-2xl font-bold text-green-800">USD {tokens.costo_estimado_usd.toFixed(4)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Precio estimado: $0,80/M tokens entrada · $4,00/M tokens salida. Solo notificaciones generadas desde la migración 003.
            </p>
          </div>
        )}

        {/* ── Registro de notificaciones ── */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2 items-center">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex-1">
              Registro de notificaciones ({ultimasFiltradas.length})
            </h2>
            <input
              type="text"
              placeholder="Buscar por causa, tipo, título, ID..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={filtroUrgencia}
              onChange={e => setFiltroUrgencia(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Toda urgencia</option>
              <option value="rojo">🔴 Rojo</option>
              <option value="amarillo">🟡 Amarillo</option>
              <option value="verde">🟢 Verde</option>
            </select>
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Todo tipo</option>
              {tiposActo.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Tipo de acto</th>
                  <th className="px-3 py-2 text-left">Destinatario</th>
                  <th className="px-3 py-2 text-left">Urgencia</th>
                  <th className="px-3 py-2 text-left">Discapacidad</th>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">N° Causa</th>
                  <th className="px-3 py-2 text-left">Enlace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ultimasFiltradas.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400 text-sm italic">Sin resultados</td></tr>
                )}
                {ultimasFiltradas.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                      {new Date(n.creado_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' })}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-blue-700">{n.tipo_acto}</td>
                    <td className="px-3 py-2 text-gray-700">{n.destinatario}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${URGENCIA_COLOR[n.urgencia] || 'bg-gray-100 text-gray-500'}`}>
                        {URGENCIA_EMOJI[n.urgencia] || '⚪'} {n.urgencia}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500 text-xs">{n.discapacidad || '—'}</td>
                    <td className="px-3 py-2 text-gray-700 max-w-xs truncate" title={n.titulo}>{n.titulo}</td>
                    <td className="px-3 py-2 text-gray-500 font-mono text-xs">{n.numero_causa || '—'}</td>
                    <td className="px-3 py-2">
                      <a href={`/n/${n.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                        Ver →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <FooterRedMarea />
      </div>
    </main>
  )
}
