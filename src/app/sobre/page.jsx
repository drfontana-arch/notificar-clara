// Página: /sobre — Manual, changelog, info del proyecto y FAQ del operador
// Para actualizar: editar este archivo. El changelog está al final.

const VERSIONES = [
  {
    version: 'v0.5',
    fecha: 'Septiembre 2026',
    cambios: [
      'Página de manual y versiones (/sobre): manual de uso del panel operador, preguntas frecuentes del operador, información del proyecto con marco normativo, e historial de versiones actualizable.',
      'Link "📖 Manual" en el header del panel del operador para acceso directo.',
    ],
  },
  {
    version: 'v0.4',
    fecha: 'Septiembre 2026',
    cambios: [
      'Integración de calendario: botones "Google Calendar" y descarga .ics desde la página ciudadana cuando la notificación tiene fecha.',
      'Geolocalización de escaneos QR: el sistema registra ciudad, provincia y país de cada apertura para medir impacto territorial.',
      'Supervisión de tokens: cada notificación generada registra tokens de entrada y salida. El panel de estadísticas muestra el consumo acumulado y el costo estimado en dólares.',
      'Timeline de escaneos: gráfico de barras diario (últimos 30 días) en el panel de estadísticas.',
      'Footer de autoría Red Marea D+I con nombres y mails de contacto en todas las pantallas del sistema.',
    ],
  },
  {
    version: 'v0.3',
    fecha: 'Agosto 2026',
    cambios: [
      'Rediseño completo del panel del operador: layout de dos columnas, identidad visual Red Marea D+I, animación de carga.',
      'Override manual de urgencia: el notificador puede reclasificar el nivel de urgencia luego de generada la notificación.',
      'Panel de estadísticas (/admin/estadisticas): tarjetas resumen, gráficos por tipo de acto, destinatario, urgencia, discapacidad, dispositivo y tipo de evento.',
      'Registro de notificaciones con filtros y búsqueda libre.',
      'Corrección: el panel de acompañante solo aparece cuando la notificación cita a comparecer (no en sentencias ni resoluciones).',
      'Corrección: botón de contacto al abogado/a eliminado de la sección PDF para evitar duplicados.',
    ],
  },
  {
    version: 'v0.2',
    fecha: 'Agosto 2026',
    cambios: [
      'Sistema de analítica: tabla de eventos en Supabase, endpoint /api/evento, registro de qr_scan, video_completado, video_saltado, lectura_completa, click_whatsapp y otros.',
      'Auto-transición del video introductorio: al terminar el video, la página pasa automáticamente a la notificación.',
      'Accesibilidad táctil para discapacidad visual: vibración + anuncio por voz al primer toque del botón "Escuchar".',
      'Sistema de triage de urgencia con niveles rojo, amarillo y verde (clasificación automática por IA).',
      'Soporte de ajuste razonable con tipo de discapacidad, transporte, acceso accesible y referente de atención.',
    ],
  },
  {
    version: 'v0.1',
    fecha: 'Julio 2026',
    cambios: [
      'Lanzamiento inicial del sistema NotificAR Clara.',
      'Pipeline IA: texto legal bonaerense → JSON estructurado → explicación en lenguaje claro (Claude Haiku 4.5).',
      'Generación de QR con URL única por notificación.',
      'Página ciudadana con explicación, datos clave, sección de preguntas frecuentes, pregunta libre a Clara y botones de contacto por WhatsApp.',
      'Video introductorio de bienvenida con subtítulos sincrónicos.',
      'Soporte de accesibilidad: zoom, alto contraste, lectura en voz alta (Web Speech API), reconocimiento de voz para preguntas.',
      'Guía de cómo llegar (Google Maps) cuando la notificación incluye lugar.',
    ],
  },
]

const FAQ = [
  {
    pregunta: '¿Qué hago si la IA devuelve un error al generar la notificación?',
    respuesta: 'Intentar de nuevo: los errores transitorios se resuelven solos en la mayoría de los casos. Si el error persiste, verificar que el texto de la notificación esté completo y no tenga caracteres extraños. Si el problema continúa, contactar al equipo técnico.',
  },
  {
    pregunta: '¿Puedo corregir el nivel de urgencia que asignó la IA?',
    respuesta: 'Sí. Luego de generar la notificación, en el panel del operador aparecen tres botones (🔴 Urgente / 🟡 Importante / 🟢 Sin urgencia). Al seleccionar uno, el cambio se guarda en la base de datos y se refleja inmediatamente en la página que ve el ciudadano.',
  },
  {
    pregunta: '¿Los datos del ciudadano quedan guardados en el sistema?',
    respuesta: 'El sistema guarda el texto de la notificación original, el tipo de acto, el tipo de destinatario y los datos procesados por la IA (sin nombre ni DNI salvo que estén en el texto ingresado). No se registran datos biométricos ni de identidad del ciudadano que escanea el QR. Los escaneos quedan registrados por IP y geolocalización aproximada.',
  },
  {
    pregunta: '¿El QR tiene fecha de vencimiento?',
    respuesta: 'No. El QR apunta a una URL permanente en la base de datos. Mientras el sistema esté activo, el ciudadano puede acceder en cualquier momento.',
  },
  {
    pregunta: '¿Qué pasa si el ciudadano no tiene smartphone?',
    respuesta: 'El QR es complementario: la notificación judicial sigue siendo válida sin él. El sistema es un canal adicional de acceso a la información, no reemplaza el acto de notificación.',
  },
  {
    pregunta: '¿Cómo ingreso el número de WhatsApp del órgano emisor?',
    respuesta: 'En formato internacional sin espacios ni guiones: código de país + código de área sin 0 + número. Ejemplo para La Plata: 5492214XXXXXX (54 = Argentina, 221 = La Plata, sin el 0 inicial).',
  },
  {
    pregunta: '¿Puedo usar el sistema para cualquier tipo de acto procesal?',
    respuesta: 'El sistema está optimizado para los tipos de acto que figuran en el selector del formulario. Para tipos no listados se puede usar la opción más cercana, aunque la explicación generada puede ser menos precisa. Próximas versiones incorporarán más tipos.',
  },
  {
    pregunta: '¿El modelo de IA puede correr sin enviar datos a internet?',
    respuesta: 'Sí, en principio. La tarea que realiza la IA es clasificación y simplificación de texto sobre un esquema predefinido, lo que no requiere un modelo de frontera. El sistema podría adaptarse para correr sobre infraestructura propia del Poder Judicial o el Ministerio Público, eliminando el envío de datos a servidores externos.',
  },
]

function Seccion({ id, titulo, children }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-lg font-bold text-[#003366] mb-4 pb-2 border-b-2 border-[#00C2C2]">{titulo}</h2>
      {children}
    </section>
  )
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Header */}
      <header className="bg-[#003366] text-white px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00C2C2] flex items-center justify-center font-bold text-white text-base">C</div>
          <div>
            <p className="font-bold text-base leading-tight">NotificAR Clara</p>
            <p className="text-[#00C2C2] text-xs font-mono">MANUAL Y VERSIONES</p>
          </div>
        </div>
        <a href="/" className="text-blue-200 text-xs underline hover:text-white">← Volver al panel</a>
      </header>

      {/* Índice rápido */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3 text-sm">
          {[
            ['#proyecto', '📋 El proyecto'],
            ['#manual', '📖 Manual de uso'],
            ['#faq', '❓ Preguntas frecuentes'],
            ['#roadmap', '🗺️ Próximas versiones'],
            ['#versiones', '🔖 Versiones'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-[#003366] font-semibold hover:text-[#00C2C2] transition-colors">{label}</a>
          ))}
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-10">

        {/* ── Información del proyecto ── */}
        <Seccion id="proyecto" titulo="📋 El proyecto">
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>NotificAR Clara</strong> es un sistema de notificaciones judiciales en lenguaje claro para la Provincia de Buenos Aires. Agrega un código QR a la cédula o resolución que, al ser escaneado por el ciudadano, abre una explicación adaptada generada por inteligencia artificial. La explicación incluye qué significa el acto, qué debe hacer el destinatario, cuándo debe hacerlo y cómo comunicarse con el órgano emisor o con su abogado/a.
            </p>
            <p>
              El sistema está diseñado conforme a las <strong>Reglas de Brasilia sobre Acceso a la Justicia de las Personas en Condición de Vulnerabilidad</strong> (Reglas 58 a 61 sobre lenguaje claro), la <strong>Ley Provincial 15.184</strong> (Lenguaje Claro en el Estado bonaerense) y la <strong>Resolución SC 1131/26</strong> (Guía de Lenguaje Claro de la SCBA). Incorpora ajustes razonables para personas con discapacidad conforme a la <strong>Convención sobre los Derechos de las Personas con Discapacidad (CDPD)</strong>.
            </p>
            <p>
              El modelo de IA utilizado es <strong>Claude Haiku 4.5</strong> (Anthropic). La tarea asignada — clasificación y simplificación de texto jurídico sobre un esquema predefinido — no requiere un modelo de frontera y es técnicamente compatible con soluciones de IA en infraestructura propia del Poder Judicial.
            </p>
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Desarrollado por <strong>Red Marea D+I</strong> · Enzo Fontana (<a href="mailto:dr.fontana@gmail.com" className="underline hover:text-[#003366]">dr.fontana@gmail.com</a>) · Laura Bulesevich (<a href="mailto:bulesevichlaura@gmail.com" className="underline hover:text-[#003366]">bulesevichlaura@gmail.com</a>)
            </p>
          </div>
        </Seccion>

        {/* ── Manual de uso ── */}
        <Seccion id="manual" titulo="📖 Manual de uso del panel operador">
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-5 text-sm text-gray-700 leading-relaxed">

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Paso 1 — Tipo de acto y destinatario</h3>
              <p>Seleccionar el tipo de acto procesal (citación, sentencia, audiencia, etc.) y el destinatario (actor, demandado, imputado, letrado, perito, etc.). Para destinatarios profesionales (letrado o perito), el sistema genera solo el triage de urgencia, sin explicación en lenguaje claro ciudadano.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Paso 2 — Texto de la notificación</h3>
              <p>Pegar el texto completo de la cédula o resolución. El sistema lo procesa con IA y extrae: título, tipo de acto, nivel de urgencia, fecha, hora, lugar, número de causa, explicación en lenguaje claro, qué debe hacer el destinatario, qué pasa si no actúa y preguntas frecuentes.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Paso 3 — Datos de contacto</h3>
              <p>Ingresar el órgano emisor y su número de WhatsApp (formato internacional, ej: 5492214XXXXXX). Opcionalmente, nombre y WhatsApp del abogado/a patrocinante. Si la notificación tiene PDF disponible, pegar el link para que el ciudadano pueda descargarlo. Marcar si es la primera notificación como imputado/a o demandado/a sin defensa designada.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Ajuste razonable (Reglas de Brasilia)</h3>
              <p>Activar si el destinatario tiene una discapacidad declarada. Seleccionar el tipo y completar los datos opcionales de transporte, acceso accesible y referente de atención personalizada. El sistema adapta la página ciudadana según el tipo de discapacidad.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Resultado: QR y explicación</h3>
              <p>Al generar, el sistema muestra el código QR (descargable) y la URL para imprimir o copiar en el papel de notificación. En la columna derecha se puede revisar la urgencia asignada por la IA y corregirla manualmente con los botones de triage (🔴 / 🟡 / 🟢). El cambio se refleja de inmediato en la página que ve el ciudadano.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Lo que ve el ciudadano al escanear el QR</h3>
              <p>El ciudadano accede a una página móvil con: video de bienvenida con subtítulos (saltable), explicación del acto en lenguaje claro, datos clave (fecha, hora, lugar, número de causa), botones de calendario para agregar el evento a Google Calendar o descargar un archivo .ics compatible con cualquier agenda, mapa con la dirección del organismo, qué debe hacer y qué pasa si no actúa, preguntas frecuentes y la posibilidad de hacer preguntas adicionales a Clara por escrito o por voz. Si corresponde, aparece un panel de ajuste razonable para solicitar acompañante o apoyo al organismo. Al final, botones de contacto directo al órgano emisor y al abogado/a por WhatsApp.</p>
            </div>

            <div>
              <h3 className="font-bold text-[#003366] mb-2">Panel de estadísticas</h3>
              <p>Accesible desde el botón "📊 Estadísticas" del header. Muestra en tiempo real: cantidad de notificaciones generadas, escaneos QR, lecturas completas, timeline de actividad por día, distribución por ciudad y país (geolocalización por IP), consumo de tokens y costo estimado del servicio de IA. También incluye el registro completo de notificaciones con filtros y búsqueda.</p>
            </div>

          </div>
        </Seccion>

        {/* ── FAQ ── */}
        <Seccion id="faq" titulo="❓ Preguntas frecuentes del operador">
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 group">
                <summary className="px-5 py-4 text-sm font-semibold text-[#003366] cursor-pointer list-none flex justify-between items-center hover:text-[#00C2C2] transition-colors">
                  {item.pregunta}
                  <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed border-t border-gray-50 pt-3">
                  {item.respuesta}
                </div>
              </details>
            ))}
          </div>
        </Seccion>

        {/* ── Próximas versiones ── */}
        <Seccion id="roadmap" titulo="🗺️ Próximas versiones (roadmap)">
          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">

            <div className="border-l-4 border-[#00C2C2] pl-4">
              <p className="font-bold text-[#003366] mb-1">Certificado digital de concurrencia</p>
              <p>Cuando la notificación cita al ciudadano a comparecer, el sistema permitirá que solicite un certificado de concurrencia desde su página. La versión piloto contempla dos modalidades:</p>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2"><span className="text-[#00C2C2] shrink-0">·</span><span><strong>Confirmación manual por el operador:</strong> el funcionario del organismo registra la presentación desde el panel y el sistema genera y envía el certificado en PDF al teléfono del ciudadano por WhatsApp.</span></li>
                <li className="flex gap-2"><span className="text-[#00C2C2] shrink-0">·</span><span><strong>QR de presencia en el organismo (versión avanzada):</strong> el organismo dispone de un código QR propio en su sede. Al escanearlo al momento de la presentación, el sistema registra la concurrencia automáticamente y genera el certificado sin intervención manual. Esta modalidad requiere una arquitectura más compleja y se evaluará para versiones posteriores al piloto.</span></li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-200 pl-4">
              <p className="font-bold text-[#003366] mb-1">Avatar Clara con videos por tipo de caso</p>
              <p>Video de bienvenida personalizado según el tipo de acto procesal, en lugar del video genérico actual.</p>
            </div>

            <div className="border-l-4 border-gray-200 pl-4">
              <p className="font-bold text-[#003366] mb-1">Mejoras de lenguaje claro</p>
              <p>Refinamiento del glosario de reemplazos en los prompts de la IA: términos como "comparecer" en lugar de "comparecer" (se usa en actos), eliminación de latinismos (<em>ut supra</em> → "mencionado más arriba"), y ajuste de plazos y artículos conforme al proceso bonaerense.</p>
            </div>

          </div>
        </Seccion>

        {/* ── Versiones ── */}
        <Seccion id="versiones" titulo="🔖 Historial de versiones">
          <div className="space-y-4">
            {VERSIONES.map((v) => (
              <div key={v.version} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#00C2C2]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#003366] text-white text-xs font-bold font-mono px-3 py-1 rounded-full">{v.version}</span>
                  <span className="text-xs text-gray-400">{v.fecha}</span>
                </div>
                <ul className="space-y-1.5">
                  {v.cambios.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-[#00C2C2] mt-0.5 shrink-0">·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Seccion>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-6 text-center space-y-1">
          <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Red Marea D+I</p>
          <p className="text-xs text-gray-400">
            Enzo Fontana · <a href="mailto:dr.fontana@gmail.com" className="hover:underline">dr.fontana@gmail.com</a>
            {' '}· Laura Bulesevich · <a href="mailto:bulesevichlaura@gmail.com" className="hover:underline">bulesevichlaura@gmail.com</a>
          </p>
          <p className="text-xs text-gray-300">NotificAR Clara — Provincia de Buenos Aires</p>
        </footer>

      </main>
    </div>
  )
}
