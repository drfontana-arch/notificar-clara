'use client'
import { useEffect, useState, useCallback } from 'react'

const CLASIFICACION = {
  urgente:       { label: 'Urgente',       bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-l-red-400' },
  informativo:   { label: 'Informativo',   bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-l-blue-400' },
  sin_categoria: { label: 'Sin categoría', bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-l-gray-300' },
}

const ESTADO = {
  pendiente: { label: 'Pendiente', bg: 'bg-amber-100', text: 'text-amber-700' },
  atendido:  { label: 'Atendido',  bg: 'bg-green-100', text: 'text-green-700' },
}

function iniciales(tel) {
  const d = (tel || '').slice(-4)
  return d || '??'
}

function formatFecha(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const hoy = new Date()
  const ayer = new Date(); ayer.setDate(ayer.getDate() - 1)
  const pad = (n) => String(n).padStart(2, '0')
  const hora = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (d.toDateString() === hoy.toDateString()) return hora
  if (d.toDateString() === ayer.toDateString()) return `ayer ${hora}`
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${hora}`
}

function BadgeClasificacion({ c }) {
  const cfg = CLASIFICACION[c] || CLASIFICACION.sin_categoria
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

function BadgeEstado({ e }) {
  const cfg = ESTADO[e] || ESTADO.pendiente
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

function FilaMensaje({ msg, seleccionado, onClick }) {
  const cfg = CLASIFICACION[msg.clasificacion] || CLASIFICACION.sin_categoria
  const opacidad = msg.estado === 'atendido' ? 'opacity-50' : ''
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-5 py-4 border-b border-gray-100 cursor-pointer transition-colors border-l-4 ${cfg.border} ${seleccionado ? 'bg-blue-50' : 'hover:bg-gray-50'} ${opacidad}`}
    >
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
        {iniciales(msg.telefono_origen)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-gray-400 font-mono">
            {msg.numero_causa ? `Causa ${msg.numero_causa}` : msg.telefono_origen}
          </span>
          {msg.tipo_acto && <span className="text-xs text-gray-400">· {msg.tipo_acto}</span>}
        </div>
        <p className="text-sm font-medium text-gray-800 truncate">{msg.texto}</p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="text-xs text-gray-400">{formatFecha(msg.recibido_en)}</p>
        <BadgeClasificacion c={msg.clasificacion} />
      </div>
    </div>
  )
}

function PanelDetalle({ msg, onActualizar }) {
  const [nota, setNota] = useState(msg.nota_empleado || '')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    setNota(msg.nota_empleado || '')
  }, [msg.id])

  const marcar = async (nuevoEstado) => {
    setGuardando(true)
    await fetch('/api/operador/mensajes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: msg.id, estado: nuevoEstado }),
    })
    setGuardando(false)
    onActualizar()
  }

  const guardarNota = async () => {
    setGuardando(true)
    await fetch('/api/operador/mensajes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: msg.id, nota_empleado: nota }),
    })
    setGuardando(false)
    onActualizar()
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <BadgeClasificacion c={msg.clasificacion} />
        <BadgeEstado e={msg.estado} />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Teléfono</p>
          <p className="font-medium text-gray-800">{msg.telefono_origen}</p>
        </div>
        {msg.numero_causa && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Causa</p>
            <p className="font-medium text-gray-800">N° {msg.numero_causa}</p>
          </div>
        )}
        {msg.tipo_acto && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Tipo de acto</p>
            <p className="font-medium text-gray-800">{msg.tipo_acto}</p>
          </div>
        )}
        {msg.organo_emisor && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Órgano</p>
            <p className="font-medium text-gray-800">{msg.organo_emisor}</p>
          </div>
        )}
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Recibido</p>
          <p className="font-medium text-gray-800">{formatFecha(msg.recibido_en)}</p>
        </div>
        {!msg.notificacion_id && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              ⚠️ Sin expediente asignado — el número no coincide con ninguna notificación registrada.
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Mensaje del ciudadano</p>
        <div className="bg-green-50 rounded-xl p-4 text-sm text-green-900 leading-relaxed">
          "{msg.texto}"
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nota interna</p>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          rows={2}
          placeholder="Agregar nota de seguimiento..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <button
          onClick={guardarNota}
          disabled={guardando}
          className="mt-1 text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Guardar nota
        </button>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        {msg.estado === 'pendiente' ? (
          <button
            onClick={() => marcar('atendido')}
            disabled={guardando}
            className="flex-1 bg-[#003366] hover:bg-[#004080] disabled:bg-gray-300 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            ✓ Marcar como atendido
          </button>
        ) : (
          <button
            onClick={() => marcar('pendiente')}
            disabled={guardando}
            className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            ↩ Reabrir
          </button>
        )}
        {msg.notificacion_id && (
          <a
            href={`/n/${msg.notificacion_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Ver notificación →
          </a>
        )}
      </div>
    </div>
  )
}

export default function PanelMensajes() {
  const [mensajes, setMensajes] = useState([])
  const [total, setTotal] = useState(0)
  const [filtro, setFiltro] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [seleccionado, setSeleccionado] = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch(`/api/operador/mensajes?estado=${filtro}`)
      const data = await res.json()
      setMensajes(data.mensajes || [])
      setTotal(data.total || 0)
    } catch {}
    setCargando(false)
  }, [filtro])

  useEffect(() => { cargar() }, [cargar])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(cargar, 30000)
    return () => clearInterval(interval)
  }, [cargar])

  const pendientes = mensajes.filter((m) => m.estado === 'pendiente').length
  const urgentes   = mensajes.filter((m) => m.clasificacion === 'urgente' && m.estado === 'pendiente').length
  const msgSeleccionado = mensajes.find((m) => m.id === seleccionado)

  const tabs = [
    { key: 'todos',     label: 'Todos' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'atendido',  label: 'Atendidos' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-[#003366] text-white px-6 py-3 shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00C2C2] flex items-center justify-center font-bold text-white text-sm">C</div>
          <div>
            <p className="font-bold text-sm leading-tight">NotificAR Clara</p>
            <p className="text-[#00C2C2] text-xs font-mono">MENSAJES WHATSAPP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {urgentes > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {urgentes} urgente{urgentes > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={cargar}
            className="text-xs text-blue-200 hover:text-white transition-colors"
          >
            ↻ Actualizar
          </button>
          <a href="/" className="text-xs text-blue-300 hover:text-white transition-colors">← Panel</a>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setFiltro(t.key); setSeleccionado(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              filtro === t.key
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.key === 'todos' && total > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{total}</span>
            )}
            {t.key === 'pendiente' && pendientes > 0 && (
              <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pendientes}</span>
            )}
          </button>
        ))}
      </div>

      {/* Cuerpo — lista + detalle */}
      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">

        {/* Lista */}
        <div className="w-full lg:w-2/5 bg-white border-r border-gray-200 overflow-y-auto">
          {cargando ? (
            <p className="text-center text-gray-400 text-sm py-12 animate-pulse">Cargando mensajes...</p>
          ) : mensajes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">No hay mensajes en esta categoría.</p>
            </div>
          ) : (
            mensajes.map((m) => (
              <FilaMensaje
                key={m.id}
                msg={m}
                seleccionado={seleccionado === m.id}
                onClick={() => setSeleccionado(m.id)}
              />
            ))
          )}
        </div>

        {/* Detalle */}
        <div className="hidden lg:block flex-1 bg-white overflow-y-auto">
          {msgSeleccionado ? (
            <PanelDetalle
              key={msgSeleccionado.id}
              msg={msgSeleccionado}
              onActualizar={cargar}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm">
              Seleccioná un mensaje para ver el detalle
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
