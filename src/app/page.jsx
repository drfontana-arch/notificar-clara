'use client'
import { useState } from 'react'
import { TIPOS_ACTO, TIPOS_DESTINATARIO, TIPOS_DISCAPACIDAD } from '@/lib/prompts/index.js'

const URGENCIA = {
  rojo:    { bg: 'bg-red-50',    border: 'border-red-400',    badge: 'bg-red-100 text-red-700',    emoji: '🔴', label: 'URGENTE' },
  amarillo:{ bg: 'bg-yellow-50', border: 'border-yellow-400', badge: 'bg-yellow-100 text-yellow-700', emoji: '🟡', label: 'IMPORTANTE' },
  verde:   { bg: 'bg-emerald-50',border: 'border-emerald-400',badge: 'bg-emerald-100 text-emerald-700',emoji: '🟢', label: 'Sin urgencia inmediata' },
}

function Paso({ numero, titulo, children }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#003366] text-white text-xs font-bold flex items-center justify-center shrink-0">
          {numero}
        </div>
        <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide">{titulo}</h3>
      </div>
      <div className="pl-10 space-y-3">{children}</div>
    </div>
  )
}

function Campo({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2C2] bg-white transition"

export default function PanelOperador() {
  const [form, setForm] = useState({
    texto_original: '',
    tipo_acto: 'testimonial',
    tipo_destinatario: 'actor',
    organo_emisor: '',
    organo_whatsapp: '',
    abogado_nombre: '',
    abogado_whatsapp: '',
    es_primera_notificacion: false,
    tiene_discapacidad: false,
    tipo_discapacidad: '',
    transporte_publico: '',
    acceso_accesible: '',
    referente_nombre: '',
    referente_cargo: '',
    pdf_url: '',
  })
  const [estado, setEstado] = useState('idle')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [urgenciaOverride, setUrgenciaOverride] = useState(null)
  const [guardandoUrgencia, setGuardandoUrgencia] = useState(false)

  const cambiarUrgencia = async (nuevo) => {
    if (!resultado?.id) return
    setGuardandoUrgencia(true)
    try {
      await fetch('/api/notificacion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resultado.id, nivel_urgencia: nuevo }),
      })
      setUrgenciaOverride(nuevo)
    } catch {}
    setGuardandoUrgencia(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEstado('cargando')
    setError('')
    setResultado(null)
    setUrgenciaOverride(null)
    try {
      const payload = {
        ...form,
        tipo_discapacidad: form.tiene_discapacidad ? (form.tipo_discapacidad || null) : null,
        transporte_publico: form.tiene_discapacidad ? form.transporte_publico : '',
        acceso_accesible: form.tiene_discapacidad ? form.acceso_accesible : '',
        referente_nombre: form.tiene_discapacidad ? form.referente_nombre : '',
        referente_cargo: form.tiene_discapacidad ? form.referente_cargo : '',
      }
      const res = await fetch('/api/procesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultado(data)
      setEstado('listo')
    } catch (err) {
      setError(err.message)
      setEstado('error')
    }
  }

  const urgenciaActual = urgenciaOverride || resultado?.datos?.nivel_urgencia
  const urg = URGENCIA[urgenciaActual] || URGENCIA.verde

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-[#003366] text-white px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00C2C2] flex items-center justify-center font-bold text-white text-base">C</div>
          <div>
            <p className="font-bold text-base leading-tight">NotificAR Clara</p>
            <p className="text-[#00C2C2] text-xs font-mono">PANEL DEL OPERADOR JUDICIAL</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-300 hidden sm:block">Provincia de Buenos Aires</span>
          <a
            href="/admin/estadisticas"
            className="flex items-center gap-1.5 bg-[#00C2C2] hover:bg-teal-400 text-[#003366] text-xs font-bold px-3 py-2 rounded-lg transition-colors"
          >
            📊 Estadísticas
          </a>
        </div>
      </header>

      {/* ── Cuerpo — layout de dos columnas en desktop ── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── COLUMNA IZQUIERDA: Formulario ──────────── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

            <Paso numero="1" titulo="Tipo de acto y destinatario">
              <Campo label="Tipo de acto procesal *">
                <select name="tipo_acto" value={form.tipo_acto} onChange={handleChange} className={inputClass}>
                  {TIPOS_ACTO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Campo>
              <Campo label="Destinatario de la notificación *">
                <select name="tipo_destinatario" value={form.tipo_destinatario} onChange={handleChange} className={inputClass}>
                  {TIPOS_DESTINATARIO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {(form.tipo_destinatario === 'letrado' || form.tipo_destinatario === 'perito') && (
                  <p className="text-xs text-amber-600 mt-1 bg-amber-50 rounded-lg px-2 py-1.5">
                    ⚠️ Para este destinatario se genera solo el triage de urgencia.
                  </p>
                )}
              </Campo>
            </Paso>

            <div className="border-t border-dashed border-gray-100" />

            <Paso numero="2" titulo="Texto de la notificación">
              <Campo label="Pegá el texto completo de la cédula o resolución *">
                <textarea
                  name="texto_original"
                  value={form.texto_original}
                  onChange={handleChange}
                  rows={7}
                  placeholder="JUZGADO... / Causa N°... / RESOLUCIÓN..."
                  className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
                  required
                />
              </Campo>
            </Paso>

            <div className="border-t border-dashed border-gray-100" />

            <Paso numero="3" titulo="Datos de contacto">
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Órgano emisor">
                  <input type="text" name="organo_emisor" value={form.organo_emisor} onChange={handleChange}
                    placeholder="Juzgado / Fiscalía..." className={inputClass} />
                </Campo>
                <Campo label="WhatsApp del órgano">
                  <input type="text" name="organo_whatsapp" value={form.organo_whatsapp} onChange={handleChange}
                    placeholder="5492214XXXXXX" className={inputClass} />
                </Campo>
                <Campo label="Abogado/a (si tiene)">
                  <input type="text" name="abogado_nombre" value={form.abogado_nombre} onChange={handleChange}
                    placeholder="Nombre y apellido" className={inputClass} />
                </Campo>
                <Campo label="WhatsApp del abogado/a">
                  <input type="text" name="abogado_whatsapp" value={form.abogado_whatsapp} onChange={handleChange}
                    placeholder="5492215XXXXXX" className={inputClass} />
                </Campo>
              </div>
              <Campo label="Link a la notificación formal (PDF)" hint="El ciudadano podrá abrirlo o enviárselo a su abogado/a">
                <input type="url" name="pdf_url" value={form.pdf_url} onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/..." className={inputClass} />
              </Campo>
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <input type="checkbox" name="es_primera_notificacion" checked={form.es_primera_notificacion} onChange={handleChange} className="rounded mt-0.5" />
                <span>Primera notificación como imputado/a o demandado/a (sin defensa designada)</span>
              </label>
            </Paso>
          </div>

          {/* Card ajuste razonable */}
          <div className={`rounded-2xl border-2 p-5 transition-colors ${form.tiene_discapacidad ? 'bg-blue-50 border-[#00C2C2]' : 'bg-white border-gray-100 shadow-sm'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="tiene_discapacidad" checked={form.tiene_discapacidad} onChange={handleChange} className="rounded w-4 h-4 accent-[#003366]" />
              <div>
                <p className="font-bold text-[#003366] text-sm">🔵 Ajuste razonable (Reglas de Brasilia)</p>
                <p className="text-xs text-gray-500">Activar si la persona destinataria tiene una discapacidad declarada</p>
              </div>
            </label>

            {form.tiene_discapacidad && (
              <div className="mt-4 space-y-3 pt-4 border-t border-blue-200">
                <Campo label="Tipo de discapacidad *">
                  <select name="tipo_discapacidad" value={form.tipo_discapacidad} onChange={handleChange} className={inputClass}>
                    <option value="">— Seleccionar —</option>
                    {TIPOS_DISCAPACIDAD.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Campo>
                {form.tipo_discapacidad === 'intelectual' && (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-800">
                    ⚠️ Se recomienda notificador/a con formación especializada o apoyo del equipo técnico interdisciplinario.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Transporte público">
                    <input type="text" name="transporte_publico" value={form.transporte_publico} onChange={handleChange}
                      placeholder="Línea 202 ramal A..." className={inputClass} />
                  </Campo>
                  <Campo label="Acceso accesible">
                    <input type="text" name="acceso_accesible" value={form.acceso_accesible} onChange={handleChange}
                      placeholder="Rampa en entrada lateral..." className={inputClass} />
                  </Campo>
                  <Campo label="Referente — nombre">
                    <input type="text" name="referente_nombre" value={form.referente_nombre} onChange={handleChange}
                      placeholder="Ej: María González" className={inputClass} />
                  </Campo>
                  <Campo label="Referente — cargo">
                    <input type="text" name="referente_cargo" value={form.referente_cargo} onChange={handleChange}
                      placeholder="Trabajadora social" className={inputClass} />
                  </Campo>
                </div>
              </div>
            )}
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={estado === 'cargando'}
            className="w-full bg-[#003366] hover:bg-[#004080] disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-lg flex items-center justify-center gap-3"
          >
            {estado === 'cargando' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Procesando con IA...
              </>
            ) : (
              <>✨ Generar explicación y QR</>
            )}
          </button>

          {estado === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}
        </form>

        {/* ── COLUMNA DERECHA: Resultado / Estado vacío ── */}
        <div className="lg:sticky lg:top-6 space-y-4">

          {/* Estado vacío */}
          {estado === 'idle' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-semibold text-gray-500 mb-1">El QR y la explicación aparecerán aquí</p>
              <p className="text-xs">Completá el formulario y hacé clic en "Generar"</p>
            </div>
          )}

          {/* Loading */}
          {estado === 'cargando' && (
            <div className="bg-white rounded-2xl border border-[#00C2C2] shadow-sm p-10 text-center">
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-12 w-12 text-[#003366]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
              <p className="font-bold text-[#003366] text-base mb-1">Clara está leyendo la notificación...</p>
              <p className="text-xs text-gray-400">Analizando el texto y generando la explicación en lenguaje claro</p>
              <div className="mt-4 flex justify-center gap-1">
                {['Identificando tipo de acto', 'Adaptando al destinatario', 'Verificando urgencia', 'Generando QR'].map((paso, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#00C2C2] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Resultado */}
          {estado === 'listo' && resultado && (
            <div className="space-y-4">

              {/* Badge de urgencia */}
              <div className={`rounded-2xl border-l-4 p-4 ${urg.bg} ${urg.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${urg.badge}`}>
                    {urg.emoji} {urg.label}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{resultado.datos?.tipo_acto}</span>
                </div>
                <h2 className="font-bold text-[#003366] text-base leading-snug">
                  {resultado.datos?.titulo_explicacion}
                </h2>
                {resultado.datos?.motivo_urgencia && (
                  <p className="text-xs text-gray-600 mt-1">{resultado.datos.motivo_urgencia}</p>
                )}
                {/* Selector manual de urgencia */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">
                    {guardandoUrgencia ? 'Guardando...' : 'Ajustar urgencia manualmente:'}
                  </p>
                  <div className="flex gap-2">
                    {[
                      { value: 'rojo',    emoji: '🔴', label: 'Urgente' },
                      { value: 'amarillo',emoji: '🟡', label: 'Importante' },
                      { value: 'verde',   emoji: '🟢', label: 'Sin urgencia' },
                    ].map(({ value, emoji, label }) => (
                      <button
                        key={value}
                        onClick={() => cambiarUrgencia(value)}
                        disabled={guardandoUrgencia}
                        className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border-2 transition-colors ${
                          urgenciaActual === value
                            ? 'border-[#003366] bg-[#003366] text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-xs font-bold text-[#003366] uppercase tracking-wide mb-4 text-center">Código QR generado</p>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-white border-2 border-[#003366] rounded-2xl shadow">
                    <img src={resultado.qr} alt="Código QR" className="w-44 h-44" />
                  </div>
                  <div className="flex gap-2 w-full">
                    <a
                      href={resultado.qr}
                      download="notificar-clara-qr.png"
                      className="flex-1 text-center bg-[#003366] hover:bg-[#004080] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      ⬇ Descargar QR
                    </a>
                    <a
                      href={resultado.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#00C2C2] hover:bg-teal-400 text-[#003366] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                      ↗ Abrir vista ciudadano
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all text-center">{resultado.url}</p>
                </div>
              </div>

              {/* Preview explicación */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Vista previa — explicación generada</p>
                <p className="text-sm text-gray-700 leading-relaxed">{resultado.datos?.explicacion_principal}</p>
                {resultado.datos?.que_debe_hacer?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-green-700 uppercase mb-2">Qué debe hacer</p>
                    <ul className="space-y-1">
                      {resultado.datos.que_debe_hacer.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-green-500 mt-0.5">✓</span><span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Generar otra */}
              <button
                onClick={() => { setEstado('idle'); setResultado(null) }}
                className="w-full text-center text-sm text-[#003366] hover:text-[#00C2C2] font-semibold py-2 transition-colors"
              >
                ← Generar otra notificación
              </button>
            </div>
          )}

          {/* Pie de marca */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-300 font-mono">Red Marea D+I · NotificAR Clara · Provincia de Buenos Aires</p>
          </div>
        </div>
      </div>
    </div>
  )
}
