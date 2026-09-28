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

const AUTORES = [
  {
    nombre: 'Enzo Fontana',
    email: 'dr.fontana@gmail.com',
    foto: null,
    cv: 'Abogado. Integrante de Red Marea D+I. Especialista en derecho e innovación tecnológica.',
  },
  {
    nombre: 'Laura Bulesevich',
    email: 'bulesevichlaura@gmail.com',
    foto: null,
    cv: 'Abogada. Integrante de Red Marea D+I.',
  },
]

const PONENCIA_RESUMEN = `NotificAR Clara propone integrar inteligencia artificial al proceso de notificación judicial en la Provincia de Buenos Aires, con el objetivo de garantizar el acceso efectivo a la justicia de personas en condición de vulnerabilidad.

El sistema parte de una premisa simple: el derecho a ser notificado no se agota en la entrega formal del papel. Implica también el derecho a comprender qué dice ese papel. Sin comprensión no hay ejercicio efectivo del derecho de defensa, no hay acceso real a la justicia.

La propuesta combina: (1) procesamiento de lenguaje natural mediante IA (Claude Haiku 4.5, Anthropic) para traducir el lenguaje jurídico a lenguaje claro; (2) generación automática de un código QR por cada notificación; (3) una página web ciudadana accesible desde el celular que incluye explicación adaptada, guía de acciones, contacto directo con el órgano emisor y ajustes razonables para personas con discapacidad; y (4) un canal de WhatsApp para consultas de los ciudadanos con derivación automática al área responsable.

El sistema está diseñado conforme a las Reglas de Brasilia (reglas 58 a 61), la Ley Provincial 15.184 y la Resolución SC 1131/26 de la SCBA, y puede ser implementado con tecnología disponible en la actualidad, sin requerir modificaciones legislativas previas.`

// ── Isologo Red Marea D+I (SVG inline) ───────────────────
function IsologoRedMarea({ color = '#ffffff', size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rasgo descendente */}
      <line x1="20" y1="10" x2="38" y2="72" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Tres arcos decrecientes */}
      <path d="M38 30 Q58 30 58 48 Q58 62 44 66" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M38 42 Q52 42 52 54 Q52 62 44 64" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M38 54 Q46 54 46 61 Q46 64 44 65" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export default function LandingPage() {
  const [tabActiva, setTabActiva] = useState('inicio')

  return (
    <div className="min-h-screen rm-bg flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── Header ── */}
      <header style={{ backgroundColor: '#003366' }} className="text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IsologoRedMarea color="#00C2C2" size={40} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }} className="leading-tight">
                NotificAR Clara
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.7rem', letterSpacing: '0.1em' }} className="uppercase">
                RED MAREA D+I · notificarclara.ar
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#93c5fd', letterSpacing: '0.06em' }} className="uppercase">
              Congreso de Habla Hispana
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#93c5fd', letterSpacing: '0.06em' }} className="uppercase">
              La Plata · Octubre 2026
            </p>
          </div>
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav className="bg-white border-b sticky top-0 z-30 shadow-sm" style={{ borderColor: '#e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto gap-1 py-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: tabActiva === tab.id ? 700 : 600,
                fontSize: '0.8rem',
                backgroundColor: tabActiva === tab.id ? '#003366' : 'transparent',
                color: tabActiva === tab.id ? '#ffffff' : '#666666',
                borderBottom: tabActiva === tab.id ? '2px solid #00C2C2' : '2px solid transparent',
              }}
              className="whitespace-nowrap px-4 py-2 rounded-t-lg transition-all shrink-0 hover:opacity-80"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Contenido ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

        {/* ══ INICIO ══ */}
        {tabActiva === 'inicio' && (
          <div className="space-y-8">

            {/* Hero */}
            <div className="text-center py-4">
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.7rem', letterSpacing: '0.12em' }} className="uppercase mb-3">
                VERSIÓN DIVULGACIÓN · Piloto 2026
              </p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.9rem', color: '#003366', lineHeight: 1.2 }} className="mb-3">
                Notificaciones judiciales<br/>en lenguaje claro
              </h1>
              <div style={{ width: 48, height: 3, backgroundColor: '#00C2C2', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--font-body)', color: '#666666', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                Un sistema de inteligencia artificial para garantizar el acceso efectivo a la justicia en la Provincia de Buenos Aires.
              </p>
            </div>

            {/* Clara presenta */}
            <div className="bg-white rounded-2xl shadow-sm border-l-4 p-6 space-y-5" style={{ borderLeftColor: '#00C2C2' }}>
              <div className="flex items-center gap-3 pb-3 border-b" style={{ borderBottomColor: '#F5F2ED' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#003366' }}>
                  <IsologoRedMarea color="#00C2C2" size={22} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#003366', fontSize: '0.95rem' }}>Clara</p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#666666', fontSize: '0.65rem', letterSpacing: '0.08em' }} className="uppercase">Asistente NotificAR Clara · IA</p>
                </div>
              </div>
              <div className="space-y-4">
                {CLARA_INTRO.map((bloque, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-xl shrink-0 mt-0.5">{bloque.icono}</span>
                    <p style={{ fontFamily: 'var(--font-body)', color: '#444', fontSize: '0.9rem', lineHeight: 1.75 }}>{bloque.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesos rápidos */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#666', fontSize: '0.65rem', letterSpacing: '0.1em' }} className="uppercase mb-4">Accesos directos</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Panel del operador', desc: 'Generar notificaciones', href: '/operador', primary: true },
                  { label: 'Mensajes WhatsApp', desc: 'Bandeja de mensajes', href: '/operador/mensajes', primary: false },
                  { label: 'Estadísticas', desc: 'Actividad del sistema', href: '/admin/estadisticas', primary: false },
                  { label: 'Manual', desc: 'Guía del operador', href: '/sobre', primary: false },
                  { label: 'Autores', desc: 'Enzo y Laura', onclick: () => setTabActiva('autores'), primary: false },
                  { label: 'Ponencia', desc: 'Congreso 2026', onclick: () => setTabActiva('ponencia'), primary: false },
                ].map((item, i) => {
                  const cls = item.primary
                    ? 'text-white hover:opacity-90'
                    : 'hover:opacity-80'
                  const style = item.primary
                    ? { backgroundColor: '#003366', borderLeft: '3px solid #00C2C2' }
                    : { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderLeft: '3px solid #00C2C2' }
                  const content = (
                    <>
                      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', color: item.primary ? '#fff' : '#003366' }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: item.primary ? '#93c5fd' : '#666', marginTop: 2 }}>{item.desc}</p>
                    </>
                  )
                  return item.href ? (
                    <a key={i} href={item.href} style={style} className={`rounded-xl p-4 shadow-sm transition-opacity ${cls}`}>{content}</a>
                  ) : (
                    <button key={i} onClick={item.onclick} style={style} className={`rounded-xl p-4 shadow-sm transition-opacity text-left w-full ${cls}`}>{content}</button>
                  )
                })}
              </div>
            </div>

            {/* Marco normativo — chips */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-2" style={{ borderTopColor: '#00C2C2' }}>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#003366', fontSize: '0.65rem', letterSpacing: '0.1em' }} className="uppercase mb-3">Marco normativo</p>
              <div className="flex flex-wrap gap-2">
                {['Reglas de Brasilia 58–61', 'Ley PBA 15.184', 'Res. SC 1131/26', 'CDPD', 'Claude Haiku 4.5'].map((n) => (
                  <span key={n} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', backgroundColor: '#F5F2ED', color: '#003366', border: '1px solid #003366' }} className="px-3 py-1 rounded-full">{n}</span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══ AUTORES ══ */}
        {tabActiva === 'autores' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">Red Marea D+I</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>Autores</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8 }} />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: '#00C2C2' }}>
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Ponencia presentada en el <strong style={{ color: '#003366' }}>Congreso de Habla Hispana · La Plata, octubre 2026</strong>, en el marco de <strong style={{ color: '#003366' }}>Red Marea D+I</strong> — colectivo de colaboración intelectual que intersecciona derecho e innovación. Tagline: <em>"Derecho e innovación en red"</em>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUTORES.map((autor) => (
                <div key={autor.nombre} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-4 border-t-4" style={{ borderTopColor: '#003366' }}>
                  {autor.foto ? (
                    <img src={autor.foto} alt={autor.nombre} className="w-28 h-28 rounded-full object-cover" style={{ border: '4px solid #003366' }} />
                  ) : (
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl" style={{ backgroundColor: '#003366', border: '4px solid #00C2C2', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                      {autor.nombre.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#003366', fontSize: '1.1rem' }}>{autor.nombre}</h3>
                    <div style={{ width: 24, height: 2, backgroundColor: '#00C2C2', margin: '8px auto' }} />
                    <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.85rem', lineHeight: 1.65 }}>{autor.cv}</p>
                    <a href={`mailto:${autor.email}`} style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.72rem' }} className="hover:underline mt-2 block">{autor.email}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 text-center text-sm border border-dashed" style={{ borderColor: '#00C2C2', color: '#666', fontFamily: 'var(--font-body)' }}>
              ℹ️ Fotos y CVs completos se incorporarán próximamente.
            </div>
          </div>
        )}

        {/* ══ PONENCIA ══ */}
        {tabActiva === 'ponencia' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">VERSIÓN DIVULGACIÓN</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>Ponencia</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8 }} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <div className="pb-5 border-b" style={{ borderBottomColor: '#F5F2ED' }}>
                <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.1em' }} className="uppercase mb-2">
                  Congreso de Habla Hispana · La Plata · Octubre 2026
                </p>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#003366', lineHeight: 1.35 }}>
                  NotificAR Clara: inteligencia artificial para la traducción de notificaciones judiciales a lenguaje claro en la Provincia de Buenos Aires
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.82rem', marginTop: 8 }}>
                  Enzo Fontana · Laura Bulesevich · Red Marea D+I
                </p>
              </div>

              <div>
                <p style={{ fontFamily: 'var(--font-mono)', color: '#666', fontSize: '0.65rem', letterSpacing: '0.1em' }} className="uppercase mb-4">Resumen</p>
                <div className="space-y-4">
                  {PONENCIA_RESUMEN.split('\n\n').map((párrafo, i) => (
                    <p key={i} style={{ fontFamily: 'var(--font-body)', color: '#444', fontSize: '0.88rem', lineHeight: 1.8 }}>{párrafo}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-4 text-center border border-dashed" style={{ borderColor: '#00C2C2', color: '#666', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                📄 Texto completo de la ponencia — próximamente.
              </div>
            </div>
          </div>
        )}

        {/* ══ OPERADOR ══ */}
        {tabActiva === 'operador' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">Acceso restringido</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>Panel del operador judicial</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8, marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem' }}>Acceso al sistema de generación de notificaciones en lenguaje claro. Exclusivo para operadores judiciales autorizados.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/operador" className="rounded-2xl p-6 shadow-lg transition-opacity hover:opacity-90 flex flex-col gap-3" style={{ backgroundColor: '#003366', borderLeft: '4px solid #00C2C2' }}>
                <span className="text-3xl">⚙️</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>Generar notificación</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#93c5fd' }}>Procesar cédula con IA y generar QR</p>
              </a>
              <a href="/operador/mensajes" className="rounded-2xl p-6 shadow-sm transition-opacity hover:opacity-90 flex flex-col gap-3 bg-white" style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #00C2C2' }}>
                <span className="text-3xl">💬</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#003366' }}>Mensajes WhatsApp</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#666' }}>Bandeja de respuestas ciudadanas</p>
              </a>
            </div>
          </div>
        )}

        {/* ══ MANUAL ══ */}
        {tabActiva === 'manual' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">Documentación</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>Manual del sistema</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8, marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem' }}>Guía de uso del panel del operador, preguntas frecuentes e historial de versiones.</p>
            </div>
            <a href="/sobre" className="rounded-2xl p-8 shadow-lg hover:opacity-90 transition-opacity flex flex-col items-center text-center gap-3" style={{ backgroundColor: '#003366', borderTop: '4px solid #00C2C2' }}>
              <span className="text-4xl">📖</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Abrir manual completo</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#93c5fd', letterSpacing: '0.06em' }}>notificarclara.ar/sobre</p>
            </a>
          </div>
        )}

        {/* ══ ESTADÍSTICAS ══ */}
        {tabActiva === 'estadisticas' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">Monitoreo</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>Estadísticas del sistema</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8, marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem' }}>Actividad en tiempo real: notificaciones generadas, escaneos QR, geolocalización, consumo de IA.</p>
            </div>
            <a href="/admin/estadisticas" className="rounded-2xl p-8 shadow-lg hover:opacity-90 transition-opacity flex flex-col items-center text-center gap-3" style={{ backgroundColor: '#003366', borderTop: '4px solid #00C2C2' }}>
              <span className="text-4xl">📊</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Abrir panel de estadísticas</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#93c5fd', letterSpacing: '0.06em' }}>notificarclara.ar/admin/estadisticas</p>
            </a>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#003366', borderTop: '3px solid #00C2C2' }} className="text-white py-6 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IsologoRedMarea color="#00C2C2" size={28} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>Red Marea D+I</p>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.62rem', letterSpacing: '0.08em' }} className="uppercase">Derecho e innovación en red</p>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#93c5fd' }} className="text-center sm:text-right">
            <a href="mailto:dr.fontana@gmail.com" className="hover:text-white transition-colors">dr.fontana@gmail.com</a>
            <span className="mx-2 opacity-40">·</span>
            <a href="mailto:bulesevichlaura@gmail.com" className="hover:text-white transition-colors">bulesevichlaura@gmail.com</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
