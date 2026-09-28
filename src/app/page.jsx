'use client'
import { useState } from 'react'

const TABS = [
  { id: 'inicio',       label: '🏠 Inicio' },
  { id: 'autores',      label: '👥 Autores' },
  { id: 'ponencia',     label: '📄 Ponencia' },
  { id: 'operador',     label: '⚙️ Panel operador' },
  { id: 'manual',       label: '📖 Manual' },
  { id: 'estadisticas', label: '📊 Estadísticas' },
]

// ── Intro de Clara ────────────────────────────────────────
const CLARA_INTRO = [
  {
    icono: '👋',
    texto: 'Hola, soy Clara. Soy la inteligencia artificial que está detrás de este sistema. Mi trabajo es leer notificaciones judiciales — escritas en lenguaje técnico y formal — y transformarlas en explicaciones que cualquier persona pueda entender.',
  },
  {
    icono: '⚖️',
    texto: 'En la Argentina, cientos de miles de personas reciben cada año una cédula judicial sin saber qué significa, qué tienen que hacer ni cuándo. Eso no es solo una barrera de comprensión: es una barrera de acceso a la justicia.',
  },
  {
    icono: '📱',
    texto: 'El operador judicial pega el texto de la notificación en el panel, yo lo proceso en segundos y genero una explicación en lenguaje claro. El sistema produce un código QR que se imprime junto a la cédula. La persona lo escanea con su celular y accede a su propia página: qué le están diciendo, qué tiene que hacer, cuándo y cómo comunicarse con el juzgado o con su abogado/a.',
  },
  {
    icono: '♿',
    texto: 'Si la persona tiene una discapacidad declarada, el sistema adapta automáticamente la información: accesibilidad visual, auditiva o intelectual, información sobre transporte accesible, datos del referente de atención personalizada y botón para solicitar acompañante. Todo conforme a las Reglas de Brasilia y la Convención sobre los Derechos de las Personas con Discapacidad.',
  },
  {
    icono: '🔬',
    texto: 'NotificAR Clara es un prototipo piloto desarrollado por Red Marea D+I para el Congreso de Habla Hispana de La Plata 2026. Está construido con tecnología 100% disponible hoy, sin necesidad de grandes inversiones de infraestructura, y es adaptable a cualquier fuero o jurisdicción.',
  },
]

// ── Autores ───────────────────────────────────────────────
const AUTORES = [
  {
    nombre: 'Enzo Fontana',
    email: 'dr.fontana@gmail.com',
    foto: null, // reemplazar con '/autores/enzo.jpg' cuando esté disponible
    cv: 'Abogado. Integrante de Red Marea D+I. Especialista en derecho e innovación tecnológica.',
  },
  {
    nombre: 'Laura Bulesevich',
    email: 'bulesevichlaura@gmail.com',
    foto: null, // reemplazar con '/autores/laura.jpg' cuando esté disponible
    cv: 'Abogada. Integrante de Red Marea D+I.',
  },
]

// ── Ponencia ──────────────────────────────────────────────
// Reemplazar con el texto completo cuando esté disponible
const PONENCIA_RESUMEN = `NotificAR Clara propone integrar inteligencia artificial al proceso de notificación judicial en la Provincia de Buenos Aires, con el objetivo de garantizar el acceso efectivo a la justicia de personas en condición de vulnerabilidad.

El sistema parte de una premisa simple: el derecho a ser notificado no se agota en la entrega formal del papel. Implica también el derecho a comprender qué dice ese papel. Sin comprensión no hay ejercicio efectivo del derecho de defensa, no hay acceso real a la justicia.

La propuesta combina: (1) procesamiento de lenguaje natural mediante IA (Claude Haiku 4.5, Anthropic) para traducir el lenguaje jurídico a lenguaje claro; (2) generación automática de un código QR por cada notificación; (3) una página web ciudadana accesible desde el celular que incluye explicación adaptada, guía de acciones, contacto directo con el órgano emisor y ajustes razonables para personas con discapacidad; y (4) un canal de WhatsApp para consultas de los ciudadanos con derivación automática al área responsable.

El sistema está diseñado conforme a las Reglas de Brasilia (reglas 58 a 61), la Ley Provincial 15.184 y la Resolución SC 1131/26 de la SCBA, y puede ser implementado con tecnología disponible en la actualidad, sin requerir modificaciones legislativas previas.`

// ── Componente principal ──────────────────────────────────
export default function LandingPage() {
  const [tabActiva, setTabActiva] = useState('inicio')

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">

      {/* ── Header ── */}
      <header className="bg-[#003366] text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C2C2] flex items-center justify-center font-bold text-white text-lg">C</div>
            <div>
              <p className="font-bold text-lg leading-tight">NotificAR Clara</p>
              <p className="text-[#00C2C2] text-xs font-mono tracking-wide">RED MAREA D+I · notificarclara.ar</p>
            </div>
          </div>
          <p className="text-xs text-blue-300 hidden sm:block text-right">
            Congreso de Habla Hispana<br />La Plata · Octubre 2026
          </p>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto gap-1 py-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                tabActiva === tab.id
                  ? 'bg-[#003366] text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#003366]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Contenido ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {/* ── INICIO ── */}
        {tabActiva === 'inicio' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#003366] mb-2">Notificaciones judiciales en lenguaje claro</h1>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Un sistema de inteligencia artificial para garantizar el acceso efectivo a la justicia en la Provincia de Buenos Aires.
              </p>
            </div>

            {/* Clara presenta el sistema */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-base shrink-0">C</div>
                <div>
                  <p className="font-bold text-[#003366]">Clara</p>
                  <p className="text-xs text-gray-400 font-mono">Asistente de NotificAR Clara · IA</p>
                </div>
              </div>
              <div className="space-y-4 pl-1">
                {CLARA_INTRO.map((bloque, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-xl shrink-0 mt-0.5">{bloque.icono}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{bloque.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Panel del operador', desc: 'Generar notificaciones', href: '/operador', color: 'bg-[#003366] text-white' },
                { label: 'Vista ciudadano', desc: 'Demo de ejemplo', href: '/n/demo', color: 'bg-[#00C2C2] text-[#003366]' },
                { label: 'Estadísticas', desc: 'Actividad del sistema', href: '/admin/estadisticas', color: 'bg-white text-[#003366] border border-gray-200' },
                { label: 'Manual', desc: 'Guía del operador', href: '/sobre', color: 'bg-white text-[#003366] border border-gray-200' },
                { label: 'Mensajes WhatsApp', desc: 'Bandeja de mensajes', href: '/operador/mensajes', color: 'bg-white text-[#003366] border border-gray-200' },
                { label: 'Ponencia', desc: 'Congreso 2026', onclick: () => setTabActiva('ponencia'), color: 'bg-white text-[#003366] border border-gray-200' },
              ].map((item, i) => (
                item.href ? (
                  <a key={i} href={item.href} className={`${item.color} rounded-xl p-4 shadow-sm font-semibold text-sm hover:opacity-90 transition-opacity`}>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
                  </a>
                ) : (
                  <button key={i} onClick={item.onclick} className={`${item.color} rounded-xl p-4 shadow-sm font-semibold text-sm hover:opacity-90 transition-opacity text-left w-full`}>
                    <p className="font-bold">{item.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
                  </button>
                )
              ))}
            </div>
          </div>
        )}

        {/* ── AUTORES ── */}
        {tabActiva === 'autores' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#003366]">Autores</h2>
            <div className="bg-white rounded-2xl p-4 mb-4 border-l-4 border-[#00C2C2] shadow-sm">
              <p className="text-sm text-gray-600">
                Proyecto presentado en el <strong>Congreso de Habla Hispana · La Plata, octubre 2026</strong>, en el marco de <strong>Red Marea D+I</strong> — colectivo de colaboración intelectual que intersecciona derecho e innovación.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUTORES.map((autor) => (
                <div key={autor.nombre} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-4">
                  {autor.foto ? (
                    <img src={autor.foto} alt={autor.nombre} className="w-28 h-28 rounded-full object-cover border-4 border-[#003366]" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-[#003366] flex items-center justify-center text-white text-4xl font-bold border-4 border-[#00C2C2]">
                      {autor.nombre.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[#003366] text-lg">{autor.nombre}</h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{autor.cv}</p>
                    <a href={`mailto:${autor.email}`} className="text-xs text-[#00C2C2] hover:underline mt-2 block font-mono">{autor.email}</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-400">
              ℹ️ Las fotos y CVs completos se incorporarán próximamente.
            </div>
          </div>
        )}

        {/* ── PONENCIA ── */}
        {tabActiva === 'ponencia' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#003366]">Ponencia</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs font-mono text-[#00C2C2] uppercase tracking-widest mb-1">Congreso de Habla Hispana · La Plata · Octubre 2026</p>
                <h3 className="text-lg font-bold text-[#003366] leading-snug">
                  NotificAR Clara: inteligencia artificial para la traducción de notificaciones judiciales a lenguaje claro en la Provincia de Buenos Aires
                </h3>
                <p className="text-sm text-gray-500 mt-1">Enzo Fontana · Laura Bulesevich · Red Marea D+I</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Resumen</p>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {PONENCIA_RESUMEN.split('\n\n').map((párrafo, i) => (
                    <p key={i}>{párrafo}</p>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-400">
                📄 El texto completo de la ponencia se incorporará próximamente.
              </div>
            </div>
          </div>
        )}

        {/* ── OPERADOR ── */}
        {tabActiva === 'operador' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#003366]">Panel del operador judicial</h2>
            <p className="text-sm text-gray-600">Acceso al sistema de generación de notificaciones en lenguaje claro. Exclusivo para operadores judiciales autorizados.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/operador" className="bg-[#003366] hover:bg-[#004080] text-white rounded-2xl p-6 shadow-lg transition-colors flex flex-col gap-2">
                <span className="text-3xl">⚙️</span>
                <p className="font-bold text-lg">Generar notificación</p>
                <p className="text-xs text-blue-200">Procesar cédula con IA y generar QR</p>
              </a>
              <a href="/operador/mensajes" className="bg-white hover:bg-gray-50 text-[#003366] rounded-2xl p-6 shadow-sm border border-gray-200 transition-colors flex flex-col gap-2">
                <span className="text-3xl">💬</span>
                <p className="font-bold text-lg">Mensajes WhatsApp</p>
                <p className="text-xs text-gray-400">Bandeja de respuestas ciudadanas</p>
              </a>
            </div>
          </div>
        )}

        {/* ── MANUAL ── */}
        {tabActiva === 'manual' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#003366]">Manual del sistema</h2>
            <p className="text-sm text-gray-600">Guía de uso completa del panel del operador, preguntas frecuentes e historial de versiones.</p>
            <a href="/sobre" className="block bg-[#003366] hover:bg-[#004080] text-white rounded-2xl p-6 shadow-lg transition-colors text-center">
              <span className="text-3xl block mb-2">📖</span>
              <p className="font-bold text-lg">Abrir manual completo</p>
              <p className="text-xs text-blue-200 mt-1">notificarclara.ar/sobre</p>
            </a>
          </div>
        )}

        {/* ── ESTADÍSTICAS ── */}
        {tabActiva === 'estadisticas' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#003366]">Estadísticas del sistema</h2>
            <p className="text-sm text-gray-600">Panel de actividad en tiempo real: notificaciones generadas, escaneos QR, geolocalización, consumo de IA.</p>
            <a href="/admin/estadisticas" className="block bg-[#003366] hover:bg-[#004080] text-white rounded-2xl p-6 shadow-lg transition-colors text-center">
              <span className="text-3xl block mb-2">📊</span>
              <p className="font-bold text-lg">Abrir panel de estadísticas</p>
              <p className="text-xs text-blue-200 mt-1">notificarclara.ar/admin/estadisticas</p>
            </a>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#003366] text-blue-200 text-xs text-center py-4 px-4 mt-8">
        <p className="font-mono uppercase tracking-widest mb-1">Red Marea D+I · Derecho e innovación en red</p>
        <p>Enzo Fontana · <a href="mailto:dr.fontana@gmail.com" className="hover:text-white underline">dr.fontana@gmail.com</a> &nbsp;·&nbsp; Laura Bulesevich · <a href="mailto:bulesevichlaura@gmail.com" className="hover:text-white underline">bulesevichlaura@gmail.com</a></p>
      </footer>

    </div>
  )
}
