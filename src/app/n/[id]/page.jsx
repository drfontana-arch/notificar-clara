'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

const VIDEO_EMBED_URL = 'https://drive.google.com/file/d/1izDkfcYIj9WzttgWZG7PTHjNvvpMx8EM/preview?autoplay=1'
const VIDEO_DURACION_MS = 43000 // duración aprox. del video introductorio

// ── Analytics ──────────────────────────────────────────────────────────────
function detectarDispositivo() {
  const ua = navigator.userAgent
  let dispositivo = 'desktop'
  if (/iPhone|iPod/i.test(ua)) dispositivo = 'iphone'
  else if (/iPad/i.test(ua)) dispositivo = 'ipad'
  else if (/Android/i.test(ua) && /Mobile/i.test(ua)) dispositivo = 'android_mobile'
  else if (/Android/i.test(ua)) dispositivo = 'android_tablet'

  let so = 'desconocido'
  if (/Android/i.test(ua)) so = 'android'
  else if (/iPhone|iPad|iPod/i.test(ua)) so = 'ios'
  else if (/Mac/i.test(ua)) so = 'macos'
  else if (/Windows/i.test(ua)) so = 'windows'
  else if (/Linux/i.test(ua)) so = 'linux'

  return { dispositivo, so }
}

function registrarEvento(notificacion_id, tipo_evento) {
  if (!notificacion_id) return
  const { dispositivo, so } = detectarDispositivo()
  fetch('/api/evento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notificacion_id, tipo_evento, dispositivo, sistema_operativo: so }),
  }).catch(() => {})
}

const SUBTITULOS = [
  "Hola. Recibiste una notificación judicial y es probable que haya cosas que necesites que te expliquen.",
  "Si entendiste todo, no es necesario que sigas leyendo. Si tenés dudas, estoy acá para ayudarte.",
  "A continuación vas a encontrar una explicación simple de qué significa esta notificación, qué tenés que hacer y cuándo.",
  "Si te quedan preguntas, podés hacérmelas al final de la página.",
  "También podés contactar a las personas del organismo que te envió la notificación, o a tu abogado o abogada, usando los botones de más abajo.",
  "Tené en cuenta que las respuestas no son instantáneas — te van a responder cuando sus tareas se lo permitan.",
]

// Tiempos acumulados en ms para cada subtítulo
const TIEMPOS = [0, 7000, 13000, 21000, 26000, 36000]

function SplashVideo({ onSkip, notifId }) {
  const [subtituloActual, setSubtituloActual] = useState(0)

  useEffect(() => {
    const timers = TIEMPOS.map((delay, idx) =>
      setTimeout(() => setSubtituloActual(idx), delay)
    )
    // Mejora H: auto-transición al terminar el video
    const autoSkip = setTimeout(() => {
      registrarEvento(notifId, 'video_completado')
      onSkip()
    }, VIDEO_DURACION_MS)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(autoSkip)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Botón saltar — esquina superior derecha */}
      <button
        onClick={() => {
          registrarEvento(notifId, 'video_saltado')
          onSkip()
        }}
        className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm shadow-lg"
      >
        Saltar →
      </button>

      {/* Video embebido */}
      <div className="flex-1 relative">
        <iframe
          src={VIDEO_EMBED_URL}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Subtítulos */}
      <div className="bg-black px-4 py-3 min-h-20 flex items-center justify-center">
        <p className="text-white text-center text-base font-medium leading-snug max-w-lg transition-all duration-500">
          {SUBTITULOS[subtituloActual]}
        </p>
      </div>
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

function ContactoButtons({ datos, notifId }) {
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
          onClick={() => registrarEvento(notifId, 'click_whatsapp_organo')}
          className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 font-semibold transition-colors shadow"
        >
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-base font-bold">Comunicarse por WhatsApp</p>
            <p className="text-green-100 text-xs font-normal">al {datos.organo_emisor || 'órgano emisor'}</p>
          </div>
        </a>
      )}
      {datos.abogado_whatsapp && (
        <a
          href={buildWALink(datos.abogado_whatsapp, `${etiqueta} — Causa N° ${datos.datos_clave?.numero_causa || '(sin número)'} - Resolución del ${datos.datos_clave?.fecha || '(sin fecha)'}. Hola ${datos.abogado_nombre || ''}, recibí una notificación y quisiera consultarle sobre su contenido.`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => registrarEvento(notifId, 'click_whatsapp_abogado')}
          className="flex items-center gap-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl px-5 py-4 font-semibold transition-colors shadow"
        >
          <span className="text-3xl">⚖️</span>
          <div>
            <p className="text-base font-bold">Comunicarse con mi abogado/a</p>
            <p className="text-blue-200 text-xs font-normal">{datos.abogado_nombre || 'por WhatsApp'}</p>
          </div>
        </a>
      )}
    </div>
  )
}

function EscucharBoton({ texto, esVisual = false, notifId, tipoEvento = 'escuchar_notificacion' }) {
  const [hablando, setHablando] = useState(false)
  const anunciadoRef = useRef(false)

  // Mejora I: al primer toque (touchstart), vibrar + anunciar por voz antes de reproducir
  const handleTouchStart = () => {
    if (esVisual && !anunciadoRef.current) {
      anunciadoRef.current = true
      if (navigator.vibrate) navigator.vibrate(200)
      const aviso = new SpeechSynthesisUtterance('Botón: escuchar la notificación en voz alta. Toque para reproducir.')
      aviso.lang = 'es-AR'
      aviso.rate = 0.95
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(aviso)
    }
  }

  const hablar = () => {
    if (hablando) {
      window.speechSynthesis.cancel()
      setHablando(false)
      return
    }
    registrarEvento(notifId, tipoEvento)
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
      onTouchStart={handleTouchStart}
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
            <EscucharBoton texto={respuesta} notifId={notifId} tipoEvento="escuchar_respuesta_clara" />
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
  const [zoom, setZoom] = useState(0) // 0 = normal, 1 = grande, 2 = muy grande
  const [accesibilidadAplicada, setAccesibilidadAplicada] = useState(false)

  useEffect(() => {
    fetch(`/api/notificacion?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setNotif(data)
        // Registrar escaneo de QR
        registrarEvento(id, 'qr_scan')
        // Accesibilidad automática para discapacidad visual o adulto mayor
        const d = data.datos_procesados
        if (!accesibilidadAplicada && (d?.tipo_discapacidad === 'visual' || d?.tipo_destinatario === 'adulto_mayor')) {
          setAltoContraste(true)
          setZoom(2)
          setAccesibilidadAplicada(true)
        }
      })
      .catch(() => setError('No se pudo cargar la notificación.'))
  }, [id])

  // Registrar lectura completa cuando el usuario llega al final
  useEffect(() => {
    if (!notif) return
    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (scrollBottom >= docHeight - 80) {
        registrarEvento(id, 'lectura_completa')
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [notif, id])

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
      {mostrarSplash && <SplashVideo notifId={id} onSkip={() => setMostrarSplash(false)} />}

      <header className={`px-5 py-4 flex items-center justify-between shadow ${altoContraste ? 'bg-gray-900' : 'bg-blue-900'}`}>
        <div>
          <h1 className="text-white font-bold text-base">NotificAR Clara</h1>
          <p className="text-blue-200 text-xs">Explicación en lenguaje claro</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <button
            onClick={() => setZoom((z) => (z + 1) % 3)}
            title="Cambiar tamaño de texto"
            className={`flex items-center gap-1 px-3 py-2 rounded-xl font-semibold text-sm border-2 transition-colors ${altoContraste ? 'bg-gray-700 text-white border-gray-500' : 'bg-blue-800 text-white border-blue-300 hover:bg-blue-700'}`}
          >
            <span className="text-lg">🔍</span>
            <span className="hidden sm:inline">{zoom === 0 ? 'A+' : zoom === 1 ? 'A++' : 'A'}</span>
          </button>
          {/* Alto contraste */}
          <button
            onClick={() => setAltoContraste(!altoContraste)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm border-2 transition-colors ${altoContraste ? 'bg-white text-black border-white' : 'bg-blue-800 text-white border-blue-300 hover:bg-blue-700'}`}
          >
            <span className="text-lg">{altoContraste ? '☀️' : '🌑'}</span>
            <span className="hidden sm:inline">{altoContraste ? 'Normal' : 'Contraste'}</span>
          </button>
        </div>
      </header>

      <div
        className="max-w-lg mx-auto px-4 pt-6"
        style={{ zoom: zoom === 1 ? 1.12 : zoom === 2 ? 1.25 : 1 }}
      >

        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-blue-600">{d.tipo_acto}</p>
          <h2 className={`text-lg font-bold ${altoContraste ? 'text-white' : 'text-blue-900'}`}>{d.titulo_explicacion}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {d.nivel_urgencia && (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                d.nivel_urgencia === 'rojo' ? 'bg-red-100 text-red-700' :
                d.nivel_urgencia === 'amarillo' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {urgenciaLabel(d.nivel_urgencia)}
                {d.motivo_urgencia && <span className="font-normal">— {d.motivo_urgencia}</span>}
              </div>
            )}
            {d.tipo_discapacidad && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                🔵 Ajuste razonable
              </div>
            )}
          </div>
        </div>

        {(d.es_primera_notificacion || d.es_primera_notificacion_imputado) && <PrimerNotificacionPanel />}

        {/* Ajuste razonable: recordatorio acompañante + botón solicitar
            Solo se muestra cuando hay un lugar al que concurrir (citaciones, audiencias)
            No aplica a sentencias o resoluciones que solo se notifican */}
        {(d.tipo_discapacidad || d.tipo_destinatario === 'adulto_mayor') && d.datos_clave?.lugar && (
          <div className={`rounded-xl p-4 mb-4 border-l-4 border-blue-500 ${altoContraste ? 'bg-gray-800' : 'bg-blue-50 shadow'}`}>
            <p className="text-sm font-bold text-blue-800 mb-2">👥 Usted puede concurrir acompañado/a</p>
            <p className="text-sm text-blue-900 mb-3">
              Tiene derecho a asistir con un familiar, persona de confianza o referente de apoyo. No necesita ningún permiso especial para traer acompañante.
            </p>
            {d.organo_whatsapp && (
              <a
                href={`https://wa.me/${d.organo_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hola, me comunico en relación a la Causa N° ${d.datos_clave?.numero_causa || '(sin número)'}. Recibí una notificación del ${d.organo_emisor || 'organismo'} y quisiera informar que requiero un ajuste razonable para poder participar adecuadamente del acto. Por favor, ¿me pueden indicar cómo solicitarlo?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm w-full justify-center ${
                  (d.es_primera_notificacion || d.es_primera_notificacion_imputado)
                    ? 'bg-blue-700 text-white text-base py-4'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                <span className="text-xl">🤝</span>
                Solicitar ajuste razonable al organismo
              </a>
            )}
            {!d.organo_whatsapp && (
              <p className="text-xs text-blue-600 italic">Para solicitar un ajuste, comuníquese directamente con el organismo que le envió la notificación.</p>
            )}
          </div>
        )}

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

        {/* Cómo llegar — se muestra cuando hay lugar en la notificación */}
        {d.datos_clave?.lugar && (
          <div className={`rounded-xl p-4 mb-4 border-l-4 border-indigo-400 ${altoContraste ? 'bg-gray-800' : 'bg-indigo-50 shadow'}`}>
            <p className="text-xs font-bold uppercase text-indigo-700 mb-2">📍 Cómo llegar al organismo</p>
            <p className="text-sm mb-2"><span className="font-semibold">Dirección:</span> {d.datos_clave.lugar}</p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(d.datos_clave.lugar + ', Provincia de Buenos Aires, Argentina')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl mb-3"
            >
              🗺️ Ver en Google Maps
            </a>
            {d.transporte_publico && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-indigo-700 mb-1">🚌 Transporte público:</p>
                <p className="text-sm">{d.transporte_publico}</p>
              </div>
            )}
            {d.acceso_accesible && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-indigo-700 mb-1">♿ Acceso accesible:</p>
                <p className="text-sm">{d.acceso_accesible}</p>
              </div>
            )}
            {d.referente_nombre && (
              <div className="mt-3 bg-indigo-100 border border-indigo-300 rounded-lg p-3">
                <p className="text-xs font-semibold text-indigo-800 mb-1">👤 Al llegar, pregunte por:</p>
                <p className="text-base font-bold text-indigo-900">{d.referente_nombre}</p>
                {d.referente_cargo && <p className="text-sm text-indigo-700">{d.referente_cargo}</p>}
                <p className="text-xs text-indigo-600 mt-1">Esta persona está al tanto de su situación y la atenderá.</p>
              </div>
            )}
          </div>
        )}

        <div className={`rounded-xl p-4 mb-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <p className="text-xs font-bold uppercase text-blue-600 mb-3">¿Qué significa esta notificación?</p>
          <div className="text-sm leading-relaxed space-y-2 mb-4">
            {d.explicacion_principal?.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {/* Botón escuchar — grande y visible */}
          <EscucharBoton
            texto={d.explicacion_principal}
            esVisual={d.tipo_discapacidad === 'visual'}
            notifId={id}
            tipoEvento="escuchar_notificacion"
          />
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
          <ContactoButtons datos={d} notifId={id} />
        </div>

        {/* Notificación formal adjunta */}
        {d.pdf_url && (
          <div className={`rounded-xl p-4 mt-4 ${altoContraste ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <p className="text-xs font-bold uppercase text-gray-500 mb-3">📄 Notificación formal original</p>
            <a
              href={d.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl px-5 py-3 font-semibold text-sm transition-colors shadow mb-2"
            >
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-bold">Ver notificación original</p>
                <p className="text-gray-300 text-xs font-normal">Abre el documento oficial</p>
              </div>
            </a>
            {d.abogado_whatsapp && (
              <p className="text-xs text-gray-500 mt-1 italic">
                Para enviar este documento a su abogado/a, use el botón de contacto al final de la página.
              </p>
            )}
          </div>
        )}

        {/* Bloque 4 — Voluntad de apelar (solo sentencias penales y cámara) */}
        {['sentencia_penal', 'sentencia_camara', 'resolucion_penal'].includes(d.tipo_acto) && (
          <div className={`rounded-xl p-4 mt-4 border-l-4 border-orange-400 ${altoContraste ? 'bg-gray-800' : 'bg-orange-50 shadow'}`}>
            <p className="text-xs font-bold uppercase text-orange-700 mb-2">⚖️ ¿Quiere apelar esta resolución?</p>
            <p className="text-sm mb-3">
              Esta resolución puede ser apelada ante el tribunal superior. Si usted desea recurrir la decisión,
              debe comunicarlo a través de su abogado/a o de la Defensoría Oficial.
            </p>
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-3">
              <p className="text-xs text-amber-800 font-semibold">⚠️ Importante</p>
              <p className="text-xs text-amber-700 mt-1">
                Si fue notificado/a en persona, usted puede también manifestar verbalmente su voluntad de apelar
                a quien le entregó la notificación, en ese mismo momento. Esto <strong>no reemplaza</strong> la
                presentación formal que debe realizar su abogado/a dentro del plazo legal.
              </p>
            </div>
            {!d.organo_whatsapp && !d.abogado_whatsapp ? (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <p className="text-xs text-red-700 font-semibold">⚠️ No hay contacto cargado</p>
                <p className="text-xs text-red-600 mt-1">
                  El sistema no tiene número de WhatsApp cargado para el órgano emisor ni para su abogado/a.
                  Consulte directamente con quien le entregó la notificación.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">Comunique su voluntad de apelar por escrito:</p>
                {d.organo_whatsapp && (
                  <a
                    href={`https://wa.me/${d.organo_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `⚖️ VOLUNTAD DE APELAR — Causa N° ${d.datos_clave?.numero_causa || '(sin número)'}. Hablo con el ${d.organo_emisor || 'órgano emisor'}: recibí la notificación de la resolución del ${d.datos_clave?.fecha || '(fecha)'} y manifiesto mi voluntad de apelar dicha resolución. Quedo a la espera de instrucciones de mi abogado/a o la Defensoría.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-5 py-3 font-semibold text-sm transition-colors shadow"
                  >
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-bold">Comunicar al {d.organo_emisor || 'órgano emisor'}</p>
                      <p className="text-orange-100 text-xs font-normal">por WhatsApp</p>
                    </div>
                  </a>
                )}
                {d.abogado_whatsapp && (
                  <a
                    href={`https://wa.me/${d.abogado_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `⚖️ VOLUNTAD DE APELAR — Causa N° ${d.datos_clave?.numero_causa || '(sin número)'}. Hola ${d.abogado_nombre || ''}: recibí la notificación de la resolución del ${d.datos_clave?.fecha || '(fecha)'} y deseo apelarla. Por favor, tome las medidas procesales necesarias dentro del plazo.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl px-5 py-3 font-semibold text-sm transition-colors shadow"
                  >
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <p className="font-bold">Avisar a mi abogado/a</p>
                      <p className="text-blue-200 text-xs font-normal">{d.abogado_nombre || 'por WhatsApp'}</p>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">NotificAR Clara — Provincia de Buenos Aires</p>
      </div>
    </main>
  )
}
