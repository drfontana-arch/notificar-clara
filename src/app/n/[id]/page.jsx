'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

function PrimerNotificacionPanel() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
      <h2 className="font-bold text-amber-800 text-base mb-2">⚠️ Esta es su primera notificación — tiene derecho a un abogado/a</h2>
      <p className="text-sm text-amber-900 mb-3">
        Antes de hacer cualquier cosa, sepa que tiene derecho a contar con un abogado o abogada que lo/la represente y asesore.
      </p>
      <ul className="text-sm text-amber-900 space-y-2">
        <li>• <strong>Si ya tiene abogado/a:</strong> comuníquese con él/ella antes de actuar.</li>
        <li>• <strong>Si no tiene abogado/a:</strong> puede solicitar la lista de profesionales matriculados al <strong>Colegio de Abogados</strong> de su localidad.</li>
        <li>• <strong>Si no tiene medios económicos:</strong> tiene derecho a la asistencia gratuita de la <strong>Defensoría Oficial</strong> de su partido judicial.</li>
      </ul>
    </div>
  )
}

function ContactoButtons({ datos }) {
  const buildWALink = (numero, mensaje) => {
    const num = numero.replace(/\D/g, '')
    return `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="font-bold text-gray-700 text-sm">¿Necesita hablar con una persona?</h3>
      {datos.organo_whatsapp && (
        <a
          href={buildWALink(datos.organo_whatsapp, `Hola, recibí una notificación del ${datos.organo_emisor} y tengo una consulta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
        >
          <span className="text-xl">💬</span>
          <span>Contactar al {datos.organo_emisor || 'órgano emisor'} por WhatsApp</span>
        </a>
      )}
      {datos.abogado_whatsapp && (
        <a
          href={buildWALink(datos.abogado_whatsapp, `Hola ${datos.abogado_nombre || ''}, recibí una notificación y quisiera consultarle.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
        >
          <span className="text-xl">⚖️</span>
          <span>Contactar a {datos.abogado_nombre || 'su abogado/a'} por WhatsApp</span>
        </a>
      )}
    </div>
  )
}

function FAQSection({ preguntas, notifId }) {
  const [preguntaLibre, setPreguntaLibre] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [abierta, setAbierta] = useState(null)

  const handlePreguntaLibre = async () => {
    if (!preguntaLibre.trim()) return
    setCargando(true)
    try {
      const res = await fetch('/api/notificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notifId, pregunta: preguntaLibre }),
      })
      const data = await res.json()
      setRespuesta(data.respuesta)
    } catch {
      setRespuesta('Hubo un error. Por favor contacte al órgano emisor.')
    }
    setCargando(false)
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-gray-700 text-base mb-3">Preguntas frecuentes</h3>
      <div className="space-y-2">
        {preguntas?.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setAbierta(abierta === i ? null : i)}
              className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              {faq.pregunta}
              <span>{abierta === i ? '▲' : '▼'}</span>
            </button>
            {abierta === i && (
              <div className="px-4 py-3 text-sm text-gray-700 bg-white">{faq.respuesta}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-gray-700 mb-2">¿Tiene otra pregunta sobre esta notificación?</p>
        <textarea
          value={preguntaLibre}
          onChange={(e) => setPreguntaLibre(e.target.value)}
          rows={3}
          placeholder="Escriba su pregunta aquí..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handlePreguntaLibre}
          disabled={cargando || !preguntaLibre.trim()}
          className="mt-2 bg-blue-800 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {cargando ? 'Buscando respuesta...' : 'Preguntar a Clara'}
        </button>
        {respuesta && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-800">
            <span className="font-semibold text-blue-800">Clara responde: </span>{respuesta}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaginaCiudadano() {
  const { id } = useParams()
  const [notif, setNotif] = useState(null)
  const [error, setError] = useState('')
  const [altoContraste, setAltoContraste] = useState(false)

  useEffect(() => {
    fetch(`/api/notificacion?id=${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) setError(data.error); else setNotif(data) })
      .catch(() => setError('No se pudo cargar la notificación.'))
  }, [id])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-sm text-center">
        <p className="text-red-700 font-semibold">No encontramos esta notificación.</p>
        <p className="text-sm text-gray-600 mt-2">Verifique que el código QR esté completo o consulte al órgano que se lo entregó.</p>
      </div>
    </div>
  )

  if (!notif) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-sm animate-pulse">Cargando su notificación...</p>
    </div>
  )

  const d = notif.datos_procesados

  return (
    <main className={`min-h-screen pb-16 ${altoContraste ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`px-5 py-4 flex items-center justify-between shadow ${altoContraste ? 'bg-gray-900' : 'bg-blue-900'}`}>
        <div>
          <h1 className="text-white font-bold text-base">NotificAR Clara</h1>
          <p className="text-blue-200 text-xs">Explicación en lenguaje claro</p>
        </div>
        <button onClick={() => setAltoContraste(!altoContraste)} className="text-white text-xs border border-white rounded px-2 py-1">
          {altoContraste ? '☀️ Normal' : '🌑 Contraste'}
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-blue-600">{d.tipo_acto}</p>
          <h2 className={`text-lg font-bold ${altoContraste ? 'text-white' : 'text-blue-900'}`}>{d.titulo_explicacion}</h2>
        </div>

        {(d.es_primera_notificacion || d.es_primera_notificacion_imputado) && <PrimerNotificacionPanel />}

        {(d.datos_clave?.fecha || d.datos_clave?.hora || d.datos_clave?.lugar) && (
          <div className={`rounded-xl p-4 mb-4 border-l-4 border-blue-500 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <p className="text-xs font-bold uppercase text-blue-600 mb-2">Datos importantes</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {d.datos_clave?.fecha && <div><span className="font-semibold">Fecha: </span>{d.datos_clave.fecha}</div>}
              {d.datos_clave?.hora && <div><span className="font-semibold">Hora: </span>{d.datos_clave.hora}</div>}
              {d.datos_clave?.lugar && <div className="col-span-2"><span className="font-semibold">Lugar: </span>{d.datos_clave.lugar}</div>}
              {d.datos_clave?.numero_causa && <div className="col-span-2"><span className="font-semibold">N° de causa: </span>{d.datos_clave.numero_causa}</div>}
            </div>
          </div>
        )}

        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <p className="text-xs font-bold uppercase text-blue-600 mb-2">¿Qué significa esta notificación?</p>
          <div className="text-sm leading-relaxed space-y-2">
            {d.explicacion_principal?.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        {d.que_debe_hacer && (
          <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-green-50 shadow'}`}>
            <p className="text-xs font-bold uppercase text-green-700 mb-2">¿Qué debe hacer?</p>
            <ul className="text-sm space-y-1">
              {(Array.isArray(d.que_debe_hacer) ? d.que_debe_hacer : [d.que_debe_hacer]).map((item, i) => (
                <li key={i} className="flex gap-2"><span>✓</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        )}

        {d.que_pasa_si_no_actua && (
          <div className={`rounded-xl p-4 mb-4 border-l-4 border-red-400 ${altoContraste ? 'bg-gray-800' : 'bg-red-50 shadow'}`}>
            <p className="text-xs font-bold uppercase text-red-700 mb-1">Si no actúa a tiempo:</p>
            <p className="text-sm">{d.que_pasa_si_no_actua}</p>
          </div>
        )}

        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <FAQSection preguntas={d.preguntas_frecuentes} notifId={id} />
        </div>

        <div className={`rounded-xl p-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <ContactoButtons datos={d} />
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">NotificAR Clara — Provincia de Buenos Aires</p>
      </div>
    </main>
  )
}
