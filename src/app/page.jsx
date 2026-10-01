'use client'
import { useState } from 'react'

const TABS = [
  { id: 'inicio',       label: 'Inicio' },
  { id: 'autores',      label: 'Autores' },
  { id: 'ponencia',     label: 'Ponencia' },
  { id: 'operador',     label: 'Sistema NotificAR Clara' },
  { id: 'manual',       label: 'Manual' },
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
    texto: 'NotificAR Clara es un prototipo piloto desarrollado por Red Marea D+I, presentado en la III Convención RPLCyA (Red Panamericana de Lenguaje Claro y Acceso a la Justicia) en La Plata, octubre 2026. Está construido con tecnología 100% disponible hoy, sin necesidad de grandes inversiones de infraestructura, y es adaptable a cualquier fuero o jurisdicción.',
  },
]

const AUTORES = [
  {
    nombre: 'Laura A. Bulesevich',
    email: 'bulesevichlaura@gmail.com',
    foto: null,
    cargo: 'Jueza de la Cámara de Apelaciones Civil y Comercial de Necochea',
    cv: [
      'Integrante del Cuerpo Académico del Fuero Civil y Comercial del Consejo de la Magistratura de la Provincia de Buenos Aires.',
      'Abogada egresada de la UBA con medalla de oro, distinguida con Premio CSJN.',
      'Especialista en Derecho Penal — UBA (Director: Dr. David Baigún).',
      'Diplomada en Derechos Económicos, Sociales, Culturales y Ambientales — UBA / CIDH / CIADH (nov. 2020).',
      'Diplomada en Familias y Género — Universidad Nacional del Chaco Austral (mar. 2022).',
      'Diplomada en Argumentación Jurídica y Litigio Judicial — Universidad de San Isidro.',
    ],
  },
  {
    nombre: 'Enzo Fontana',
    email: 'dr.fontana@gmail.com',
    foto: null,
    cargo: 'Secretario de la Unidad Funcional de Defensa Penal N° 6 — Departamento Judicial de Necochea',
    cv: [
      'Ministerio Público de la Provincia de Buenos Aires (desde 2015).',
      'Abogado egresado de la Universidad Nacional de Mar del Plata (2003).',
      'Mediador (Programa de Formación de Mediadores de la UNLZ y de la Fundación CIJUSO).',
      'Ex docente titular de Abordaje de Conflictos y Derechos Humanos y Ética Profesional, Escuela de Policía Juan Vucetich, sede Necochea.',
      'Diplomado Iberoamericano en Innovación y Liderazgo Judicial — Universidad Champagnat.',
    ],
  },
]

const PONENCIA_RESUMEN = `Ser notificado de un acto judicial es, en teoría, el punto de partida del ejercicio de los derechos procesales. Sin embargo, en la práctica, es con frecuencia el punto donde ese ejercicio se detiene. El lenguaje técnico-jurídico que caracteriza a las cédulas, citaciones y notificaciones electrónicas resulta opaco para la gran mayoría de sus destinatarios.

Las consecuencias de esa incomprensión son concretas: inasistencias a audiencias, rebeldías declaradas, plazos procesales vencidos, privaciones de libertad evitables, resoluciones consentidas y, en resumen, derechos no ejercidos o vulnerados. La barrera comunicacional no es un problema periférico al sistema judicial sino que es uno de sus costos invisibles más significativos.

NotificAR Clara es un sistema de mediación comunicacional y servicios diseñado para dar respuesta tecnológica a ese problema. Su propósito central es incorporar, en las notificaciones y citaciones judiciales, una capa de comprensión accesible desde el teléfono celular de cualquier persona, sin modificar los documentos originales ni los sistemas informáticos en uso.

La propuesta se organiza en cuatro ejes: (1) el diagnóstico de la notificación como acto de comunicación que falla sistemáticamente; (2) el marco normativo — Reglas de Brasilia (58 a 63), CDPD, CDN, Convención Interamericana sobre Personas Mayores y Res. SCBA 1131/26; (3) la arquitectura y funcionamiento del sistema; y (4) la viabilidad, impacto esperado y condiciones de escalabilidad.

El sistema opera mediante un código QR que se añade al documento judicial. Al escanearlo, el destinatario accede a una asistente virtual de video generada con IA que explica su función y brinda comunicación en lenguaje claro. Incluye triaje automatizado editable, formulación de preguntas sobre el acto notificado y vías de contacto directo con el órgano emisor. Módulos diferenciados de ajustes razonables contemplan perfiles para personas con discapacidad, adultos mayores y niñas, niños y adolescentes.

El resultado principal es un prototipo operativo disponible para demostración. Los hallazgos confirman que la implementación no requiere gran inversión en infraestructura y puede avanzar órgano por órgano sobre la infraestructura digital ya existente. NotificAR Clara propone que el rigor técnico del documento y la explicación comprensible para quien lo recibe puedan coexistir en el mismo soporte.`

// ── Isologo Red Marea D+I (SVG inline) ───────────────────
function IsologoRedMarea({ color = '#ffffff', size = 32 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="85 95 145 155"
      width={size}
      height={size}
      fill="none"
    >
      <path
        d="M 95 240 C 98 180, 125 105, 142 105 C 158 105, 145 190, 133 220 C 145 190, 160 145, 175 145 C 190 145, 175 195, 165 224 C 180 190, 205 160, 210 175 C 215 195, 195 220, 200 226 C 205 232, 215 222, 222 208"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function LandingPage() {
  const [tabActiva, setTabActiva] = useState('inicio')
  const [subTabPonencia, setSubTabPonencia] = useState('resumen')

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
              III Convención RPLCyA
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#93c5fd', letterSpacing: '0.06em' }} className="uppercase">
              La Plata · 1 oct. 2026
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
                fontWeight: 700,
                fontSize: '0.9rem',
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

            {/* ── Portada evento (inspirada en flyer RPLCyA) ── */}
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#003366' }}>

              {/* Banda superior — evento */}
              <div className="px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: '#00446a' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.62rem', letterSpacing: '0.14em' }} className="uppercase mb-1">
                      III Convención RPLCyA
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', color: '#93c5fd', fontSize: '0.75rem', lineHeight: 1.4 }}>
                      Red Panamericana de Lenguaje Claro y Acceso a la Justicia
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', backgroundColor: '#00C2C2', color: '#003366', fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 4 }}>
                    MESA 4.2
                  </span>
                </div>
              </div>

              {/* Título de la mesa */}
              <div className="px-6 py-5 border-b" style={{ borderBottomColor: '#00446a' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.35 }}>
                  Lingüística e inteligencia artificial: asistentes para una comunicación clara
                </p>
              </div>

              {/* Datos logísticos */}
              <div className="px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 border-b" style={{ borderBottomColor: '#00446a' }}>
                {[
                  { icon: '📅', text: 'Jueves 1ro de octubre' },
                  { icon: '🕐', text: '12:20 – 13:05 h' },
                  { icon: '📍', text: 'Casa de Justicia · Sala de Audiencias' },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ fontSize: '0.85rem' }}>{d.icon}</span>
                    <span style={{ fontFamily: 'var(--font-body)', color: '#93c5fd', fontSize: '0.78rem' }}>{d.text}</span>
                  </div>
                ))}
              </div>

              {/* Presentación de NotificAR Clara */}
              <div className="px-6 py-6">
                <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.6rem', letterSpacing: '0.16em' }} className="uppercase mb-3">
                  Te invitamos a la presentación de
                </p>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '2rem', color: '#ffffff', lineHeight: 1, marginBottom: 6 }}>
                  Notific<span style={{ color: '#00C2C2' }}>AR</span> Clara
                  <span style={{ color: '#00C2C2', marginLeft: 6, fontSize: '1.4rem' }}>—</span>
                </p>
                <div style={{ width: 48, height: 3, backgroundColor: '#00C2C2', marginBottom: 16 }} />
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: '#ffffff', fontSize: '0.95rem', marginBottom: 4 }}>
                  Laura Bulesevich y Enzo Fontana
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: '#93c5fd', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Poder Judicial de la Provincia de Buenos Aires (Argentina)
                </p>
              </div>

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
                  { label: 'Sistema NotificAR Clara', desc: 'Generar notificaciones', href: '/operador', primary: true },
                  { label: 'Manual', desc: 'Guía del operador', href: '/sobre', primary: false },
                  { label: 'Autores', desc: 'Red Marea D+I', onclick: () => setTabActiva('autores'), primary: false },
                  { label: 'Ponencia', desc: 'III Convención RPLCyA', onclick: () => setTabActiva('ponencia'), primary: false },
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
              <div className="flex flex-wrap gap-2 mb-3">
                {['Reglas de Brasilia 58–63', 'Ley PBA 15.184', 'Res. SC 1131/26', 'CDPD', 'CDN', 'Conv. Interamericana Personas Mayores'].map((n) => (
                  <span key={n} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', backgroundColor: '#F5F2ED', color: '#003366', border: '1px solid #003366' }} className="px-3 py-1 rounded-full">{n}</span>
                ))}
              </div>
              <a
                href="https://www.scba.gov.ar/informacion/guiasbuenaspracticas.asp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', backgroundColor: '#003366', color: '#fff', border: '1px solid #003366', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, textDecoration: 'none' }}
                className="hover:opacity-80 transition-opacity"
              >
                📋 Guías de Buenas Prácticas · SCBA →
              </a>
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
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: 12 }}>
                Ponencia presentada en la <strong style={{ color: '#003366' }}>III Convención RPLCyA — Red Panamericana de Lenguaje Claro y Acceso a la Justicia · La Plata, 1 de octubre de 2026</strong>, en el marco de <strong style={{ color: '#003366' }}>Red Marea D+I</strong> — Colectivo de colaboración intelectual que intersecciona derecho e innovación.
              </p>
              <div className="flex items-center gap-3">
                <IsologoRedMarea color="#003366" size={28} />
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: '#003366' }}>Red Marea D+I</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#00C2C2', letterSpacing: '0.06em' }}>Derecho e innovación en red. Tecnohumanistas.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUTORES.map((autor) => (
                <div key={autor.nombre} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-4 border-t-4" style={{ borderTopColor: '#003366' }}>
                  {autor.foto ? (
                    <img src={autor.foto} alt={autor.nombre} className="w-28 h-28 rounded-full object-cover" style={{ border: '4px solid #003366' }} />
                  ) : (
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl" style={{ backgroundColor: '#003366', border: '4px solid #00C2C2', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                      {autor.nombre.split(' ').map(p => p[0]).join('').slice(0,2)}
                    </div>
                  )}
                  <div className="text-left w-full">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#003366', fontSize: '1.1rem', textAlign: 'center' }}>{autor.nombre}</h3>
                    <div style={{ width: 24, height: 2, backgroundColor: '#00C2C2', margin: '8px auto 10px' }} />
                    <p style={{ fontFamily: 'var(--font-body)', color: '#003366', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4, textAlign: 'center', marginBottom: 12 }}>{autor.cargo}</p>
                    <ul className="space-y-1">
                      {autor.cv.map((item, i) => (
                        <li key={i} style={{ fontFamily: 'var(--font-body)', color: '#555', fontSize: '0.86rem', lineHeight: 1.55 }} className="flex gap-2">
                          <span style={{ color: '#00C2C2', flexShrink: 0 }}>·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={`mailto:${autor.email}`} style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.72rem' }} className="hover:underline mt-3 block text-center">{autor.email}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 text-center text-sm border border-dashed" style={{ borderColor: '#00C2C2', color: '#666', fontFamily: 'var(--font-body)' }}>
              📷 Fotos de los autores se incorporarán próximamente.
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

            {/* Sub-tabs ponencia */}
            <div className="flex gap-2 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
              {[
                { id: 'resumen', label: 'Resúmen de Ponencia' },
                { id: 'completa', label: 'Ponencia Completa' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSubTabPonencia(st.id)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: subTabPonencia === st.id ? '#003366' : '#999',
                    borderBottom: subTabPonencia === st.id ? '3px solid #00C2C2' : '3px solid transparent',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: subTabPonencia === st.id ? '3px solid #00C2C2' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                >{st.label}</button>
              ))}
            </div>

            {subTabPonencia === 'resumen' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                <div className="pb-5 border-b" style={{ borderBottomColor: '#F5F2ED' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.1em' }} className="uppercase mb-2">
                    III Convención RPLCyA · Mesa 4.2 · La Plata · 1 oct. 2026
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#003366', lineHeight: 1.35 }}>
                    NotificAR Clara: sistema de mediación comunicacional para la comprensión de notificaciones judiciales mediante inteligencia artificial y asistente virtual de video
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.82rem', marginTop: 8 }}>
                    Enzo Fontana · Laura Bulesevich · Red Marea D+I
                  </p>
                </div>
                <div className="space-y-4">
                  {PONENCIA_RESUMEN.split('\n\n').map((párrafo, i) => (
                    <p key={i} style={{ fontFamily: 'var(--font-body)', color: '#444', fontSize: '0.88rem', lineHeight: 1.8 }}>{párrafo}</p>
                  ))}
                </div>
              </div>
            )}

            {subTabPonencia === 'completa' && (
              <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center gap-4 text-center" style={{ minHeight: 260, border: '2px dashed #00C2C2' }}>
                <span style={{ fontSize: '2.5rem' }}>📄</span>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#003366' }}>Ponencia Completa</p>
                <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem' }}>Próximamente disponible en formato descargable.</p>
              </div>
            )}
          </div>
        )}

        {/* ══ SISTEMA NOTIFICAR CLARA ══ */}
        {tabActiva === 'operador' && (
          <div className="space-y-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.65rem', letterSpacing: '0.12em' }} className="uppercase mb-2">Sistema</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', color: '#003366' }}>NotificAR Clara</h2>
              <div style={{ width: 32, height: 3, backgroundColor: '#00C2C2', marginTop: 8, marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Sistema de mediación comunicacional para la comprensión de notificaciones judiciales mediante inteligencia artificial. Procesá una cédula, generá su explicación en lenguaje claro y el código QR para imprimir junto al documento original.
              </p>
            </div>

            {/* Banner de acceso principal */}
            <a href="/operador" className="block rounded-2xl overflow-hidden shadow-lg hover:opacity-95 transition-opacity" style={{ backgroundColor: '#003366', borderLeft: '5px solid #00C2C2', textDecoration: 'none' }}>
              <div className="px-8 py-7 flex items-center justify-between gap-4">
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#00C2C2', fontSize: '0.62rem', letterSpacing: '0.14em' }} className="uppercase mb-2">Acceso al sistema</p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.4rem', color: '#fff', lineHeight: 1.2, marginBottom: 6 }}>
                    Generar notificación en lenguaje claro
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', color: '#93c5fd', fontSize: '0.83rem' }}>
                    Ingresá el texto de la cédula, Clara lo procesa con IA y genera el QR listo para imprimir.
                  </p>
                </div>
                <span style={{ fontSize: '3rem', flexShrink: 0 }}>⚙️</span>
              </div>
            </a>

            {/* Banner de acceso — repetido abajo */}
            <a href="/operador" className="block rounded-2xl overflow-hidden shadow-md hover:opacity-95 transition-opacity" style={{ backgroundColor: '#F5F2ED', border: '2px solid #003366', textDecoration: 'none' }}>
              <div className="px-8 py-5 flex items-center justify-between gap-4">
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#003366' }}>
                    → Ingresar al panel del operador
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#666', letterSpacing: '0.06em', marginTop: 4 }}>
                    notificarclara.ar/operador
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', backgroundColor: '#003366', color: '#fff', padding: '8px 18px', borderRadius: 6 }}>
                  Acceder
                </span>
              </div>
            </a>

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
