'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const VIDEO_URL = 'https://drive.google.com/file/d/1izDkfcYIj9WzttgWZG7PTHjNvvpMx8EM/view'

function SplashVideo({ onSkip }) {
  return (
    <div className="fixed inset-0 z-50 bg-blue-950 flex flex-col items-center justify-center px-6">
      <img
        src="/clara-avatar.jpg"
        alt="Clara"
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-6"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      <h1 className="text-white text-2xl font-bold text-center mb-2">Hola, soy Clara</h1>
      <p className="text-blue-200 text-sm text-center mb-8">
        Estoy aquí para explicarle en palabras simples la notificación judicial que recibió.
      </p>
      <a
        href={VIDEO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSkip}
        className="w-full max-w-xs bg-white text-blue-900 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg mb-4"
      >
        <span className="text-3xl">▶</span> Ver introducción en video
      </a>
      <button
        onClick={onSkip}
        className="text-blue-300 text-sm underline py-2"
      >
        Saltar introducción →
      </button>
    </div>
  )
}

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

function urgenciaLabel(nivel) {
  if (nivel === 'rojo') return '🔴 URGENTE'
  if (nivel === 'amarillo') return '🟡 IMPORTANTE'
  return '🟢 Sin urgencia inmediata'
}

function ContactoButtons({ datos }) {
  const buildWALink = (numero, mensaje) => {
    const num = numero.replace(/\D/g, '')
    return `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`
  }
  const etiqueta = urgenciaLabel(datos.nivel_urgencia)

  return (
    <div className="mt-2 space-y-3">
      <h3 className="font-bold text-gray-700 text-base mb-1">¿Necesita hablar con una persona?</h3>
      {datos.organo_whatsapp && (
        <a
          href={buildWALink(datos.organo_whatsapp, `${etiqueta} — Causa N° ${datos.datos_clave?.numero_causa || '(sin número)'} - Resolución del ${datos.datos_clave?.fecha || '(sin fecha)'}. Recibí una notificación de ${datos.organo_emisor} y tengo una consulta sobre su contenido.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 font-semibold transition-colors shadow"
        >
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-base font-bold">Escribir por WhatsApp</p>
            <p className="text-green-100 text-xs font-normal">al {datos.organo_emisor || 'órgano emisor'}</p>
          </div>
        </a>
      )}
      {datos.abogado_whatsapp && (
        <a
          href={buildWALink(datos.abogado_whatsapp, `${etiqueta} — Causa N° ${datos.datos_clave?.numero_causa || '(sin número)'} - Resolución del ${datos.datos_clave?.fecha || '(sin fecha)'}. Hola ${datos.abogado_nombre || ''}, recibí una notificación y quisiera consultarle sobre su contenido.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl px-5 py-4 font-semibold transition-colors shadow"
        >
          <span className="text-3xl">⚖️</span>
          <div>
            <p className="text-base font-bold">Escribir a mi abogado/a</p>
            <p className="text-blue-200 text-xs font-normal">{datos.abogado_nombre || 'por WhatsApp'}</p>
          </div>
        </a>
      )}
    </div>
  )
}

function EscucharBoton({ texto }) {
  const [hablando, setHablando] = useState(false)
  const hablar = () => {
    if (hablando) {
      window.speechSynthesis.cancel()
      setHablando(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-AR'
    utterance.rate = 0.9
    utterance.onend = () => setHablando(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setHablando(true)
  }
  return (
    <button
      onClick={hablar}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow transition-colors ${hablando ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'}`}
    >
      <span className="text-xl">{hablando ? '⏹' : '🔊'}</span>
      {hablando ? 'Detener audio' : 'Escuchar en voz alta'}
    </button>
  )
}

function FAQSection({ preguntas, notifId }) {
  const [preguntaLibre, setPreguntaLibre] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [abierta, setAbierta] = useState(null)
  const [escuchando, setEscuchando] = useState(false)

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

  const handleVoz = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Su navegador no soporta reconocimiento de voz. Pruebe con Chrome.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'es-AR'
    setEscuchando(true)
    recognition.onresult = (e) => {
      setPreguntaLibre(e.results[0][0].transcript)
      setEscuchando(false)
    }
    recognition.onerror = () => setEscuchando(false)
    recognition.onend = () => setEscuchando(false)
    recognition.start()
  }

  return (
    <div className="mt-4">
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

      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">¿Tiene otra pregunta sobre esta notificación?</p>
        <textarea
          value={preguntaLibre}
          onChange={(e) => setPreguntaLibre(e.target.value)}
          rows={3}
          placeholder="Escriba su pregunta aquí..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Botón de voz grande */}
        <button
          onClick={handleVoz}
          disabled={escuchando}
          className={`mt-3 w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-semibold text-base shadow transition-colors ${escuchando ? 'bg-red-100 text-red-700 border-2 border-red-400 animate-pulse' : 'bg-purple-100 text-purple-800 border-2 border-purple-300 hover:bg-purple-200'}`}
        >
          <span className="text-2xl">🎤</span>
          {escuchando ? 'Escuchando... hable ahora' : 'Hacer pregunta por voz'}
        </button>

        {/* Botón preguntar */}
        <button
          onClick={handlePreguntaLibre}
          disabled={cargando || !preguntaLibre.trim()}
          className="mt-2 w-full flex items-center justify-center gap-3 bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-2xl font-semibold text-base shadow transition-colors"
        >
          <span className="text-2xl">💬</span>
          {cargando ? 'Buscando respuesta...' : 'Preguntar a Clara'}
        </button>

        {respuesta && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-800">
            <p className="font-semibold text-blue-800 mb-2">Clara responde:</p>
            <p className="mb-3">{respuesta}</p>
            <EscucharBoton texto={respuesta} />
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
  const [mostrarSplash, setMostrarSplash] = useState(true)

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
  const esProfesional = d.tipo_destinatario === 'letrado' || d.tipo_destinatario === 'perito'

  // Vista simplificada para letrados y peritos (solo triage)
  if (esProfesional) return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="px-5 py-4 bg-blue-900 shadow">
        <h1 className="text-white font-bold text-base">NotificAR Clara — Triage</h1>
        <p className="text-blue-200 text-xs">Notificación dirigida a profesional</p>
      </header>
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-xs font-semibold uppercase text-blue-600 mb-1">{d.tipo_acto}</p>
          <h2 className="text-lg font-bold text-blue-900 mb-3">{d.titulo_explicacion}</h2>
          {d.nivel_urgencia && (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
              d.nivel_urgencia === 'rojo' ? 'bg-red-100 text-red-700' :
              d.nivel_urgencia === 'amarillo' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {urgenciaLabel(d.nivel_urgencia)}
              {d.motivo_urgencia && <span className="font-normal ml-1">— {d.motivo_urgencia}</span>}
            </div>
          )}
          {d.datos_clave && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {d.datos_clave.fecha && <div><span className="font-semibold">Fecha: </span>{d.datos_clave.fecha}</div>}
              {d.datos_clave.numero_causa && <div><span className="font-semibold">Causa: </span>{d.datos_clave.numero_causa}</div>}
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-400">NotificAR Clara — Provincia de Buenos Aires</p>
      </div>
    </main>
  )

  return (
    <main className={`min-h-screen pb-16 ${altoContraste ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>

      {/* Splash de bienvenida con video */}
      {mostrarSplash && <SplashVideo onSkip={() => setMostrarSplash(false)} />}

      <header className={`px-5 py-4 flex items-center justify-between shadow ${altoContraste ? 'bg-gray-900' : 'bg-blue-900'}`}>
        <div>
          <h1 className="text-white font-bold text-base">NotificAR Clara</h1>
          <p className="text-blue-200 text-xs">Explicación en lenguaje claro</p>
        </div>
        {/* Alto contraste — botón grande y visible */}
        <button
          onClick={() => setAltoContraste(!altoContraste)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm border-2 transition-colors ${altoContraste ? 'bg-white text-black border-white' : 'bg-blue-800 text-white border-blue-300 hover:bg-blue-700'}`}
        >
          <span className="text-lg">{altoContraste ? '☀️' : '🌑'}</span>
          <span className="hidden sm:inline">{altoContraste ? 'Modo normal' : 'Alto contraste'}</span>
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6">

        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-blue-600">{d.tipo_acto}</p>
          <h2 className={`text-lg font-bold ${altoContraste ? 'text-white' : 'text-blue-900'}`}>{d.titulo_explicacion}</h2>
          {d.nivel_urgencia && (
            <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              d.nivel_urgencia === 'rojo' ? 'bg-red-100 text-red-700' :
              d.nivel_urgencia === 'amarillo' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {urgenciaLabel(d.nivel_urgencia)}
              {d.motivo_urgencia && <span className="font-normal">— {d.motivo_urgencia}</span>}
            </div>
          )}
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
          <p className="text-xs font-bold uppercase text-blue-600 mb-3">¿Qué significa esta notificación?</p>
          <div className="text-sm leading-relaxed space-y-2 mb-4">
            {d.explicacion_principal?.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {/* Botón escuchar — grande y visible */}
          <EscucharBoton texto={d.explicacion_principal} />
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
