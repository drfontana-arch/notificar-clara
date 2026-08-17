'use client'
import { useState } from 'react'
import { TIPOS_ACTO, TIPOS_DESTINATARIO, TIPOS_DISCAPACIDAD } from '@/lib/prompts/index.js'

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
  })
  const [estado, setEstado] = useState('idle') // idle | cargando | listo | error
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEstado('cargando')
    setError('')
    try {
      const payload = {
        ...form,
        tipo_discapacidad: form.tiene_discapacidad ? (form.tipo_discapacidad || null) : null,
        transporte_publico: form.tiene_discapacidad ? form.transporte_publico : '',
        acceso_accesible: form.tiene_discapacidad ? form.acceso_accesible : '',
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

  return (
    <main className="min-h-screen bg-judicial-fondo">
      {/* Header */}
      <header className="bg-judicial-azul text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">NotificAR Clara — Panel del Operador Judicial</h1>
        <p className="text-sm text-blue-200 mt-1">Generá el QR explicador para una notificación</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

          {/* Tipo de acto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de acto procesal *
            </label>
            <select
              name="tipo_acto"
              value={form.tipo_acto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
            >
              {TIPOS_ACTO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Tipo de destinatario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Destinatario de la notificación *
            </label>
            <select
              name="tipo_destinatario"
              value={form.tipo_destinatario}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
            >
              {TIPOS_DESTINATARIO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {(form.tipo_destinatario === 'letrado' || form.tipo_destinatario === 'perito') && (
              <p className="text-xs text-amber-600 mt-1">⚠️ Para este destinatario solo se generará el triage de urgencia, sin explicación en lenguaje claro.</p>
            )}
          </div>

          {/* Texto de la notificación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Texto de la notificación *
            </label>
            <textarea
              name="texto_original"
              value={form.texto_original}
              onChange={handleChange}
              rows={8}
              placeholder="Pegá aquí el texto completo de la notificación o resolución judicial..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro resize-y"
              required
            />
          </div>

          {/* Órgano emisor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Órgano emisor
              </label>
              <input
                type="text"
                name="organo_emisor"
                value={form.organo_emisor}
                onChange={handleChange}
                placeholder="Ej: Juzgado Criminal N° 3 de La Plata"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                WhatsApp del órgano
              </label>
              <input
                type="text"
                name="organo_whatsapp"
                value={form.organo_whatsapp}
                onChange={handleChange}
                placeholder="Ej: 5492214XXXXXX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
              />
            </div>
          </div>

          {/* Abogado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Abogado/a designado/a (si tiene)
              </label>
              <input
                type="text"
                name="abogado_nombre"
                value={form.abogado_nombre}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                WhatsApp del abogado/a
              </label>
              <input
                type="text"
                name="abogado_whatsapp"
                value={form.abogado_whatsapp}
                onChange={handleChange}
                placeholder="Ej: 5492215XXXXXX"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-judicial-claro"
              />
            </div>
          </div>

          {/* Primera notificación */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="es_primera_notificacion"
              checked={form.es_primera_notificacion}
              onChange={handleChange}
              className="rounded"
            />
            Es la primera notificación como imputado/a o demandado/a (sin defensa designada)
          </label>

          {/* Ajuste razonable */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-blue-800 cursor-pointer">
              <input
                type="checkbox"
                name="tiene_discapacidad"
                checked={form.tiene_discapacidad}
                onChange={handleChange}
                className="rounded"
              />
              🔵 Esta notificación requiere ajuste razonable
            </label>

            {form.tiene_discapacidad && (
              <div className="space-y-3 pl-2">
                {/* Tipo de discapacidad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo de discapacidad *
                  </label>
                  <select
                    name="tipo_discapacidad"
                    value={form.tipo_discapacidad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">— Seleccionar —</option>
                    {TIPOS_DISCAPACIDAD.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Advertencia para discapacidad intelectual */}
                {form.tipo_discapacidad === 'intelectual' && (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-semibold">⚠️ Ajuste razonable recomendado</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Para personas con discapacidad intelectual se recomienda que la notificación sea realizada por un/a notificador/a con formación especializada o con apoyo del equipo técnico interdisciplinario del organismo. La explicación en lenguaje claro se adaptará automáticamente.
                    </p>
                  </div>
                )}

                {/* Instrucciones para llegar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Transporte público para llegar al organismo
                  </label>
                  <input
                    type="text"
                    name="transporte_publico"
                    value={form.transporte_publico}
                    onChange={handleChange}
                    placeholder="Ej: Colectivo línea 202 ramal A, bajada en Av. 7 y 57"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Acceso accesible (para personas con movilidad reducida)
                  </label>
                  <input
                    type="text"
                    name="acceso_accesible"
                    value={form.acceso_accesible}
                    onChange={handleChange}
                    placeholder="Ej: Rampa en entrada lateral por calle 13, ascensor disponible"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={estado === 'cargando'}
            className="w-full bg-judicial-azul hover:bg-judicial-claro disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {estado === 'cargando' ? 'Procesando con IA...' : 'Generar explicación y QR'}
          </button>

          {estado === 'error' && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
        </form>

        {/* Resultado */}
        {estado === 'listo' && resultado && (
          <div className="mt-8 bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold text-judicial-azul">✅ Notificación procesada</h2>

            <div className="flex flex-col items-center gap-3">
              <img src={resultado.qr} alt="Código QR" className="w-48 h-48" />
              <a
                href={resultado.qr}
                download="notificar-clara-qr.png"
                className="bg-judicial-claro text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Descargar QR
              </a>
              <a
                href={resultado.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-judicial-claro text-sm underline"
              >
                {resultado.url}
              </a>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">Vista previa de la explicación generada:</p>
              <p className="text-sm text-gray-800 italic">{resultado.datos?.explicacion_principal}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
