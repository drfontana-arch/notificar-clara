// test-cartesiano.js
// Prueba cartesiana completa: 10 tipos de acto × 11 destinatarios × 5 discapacidad = 550 combinaciones
// Uso: node scripts/test-cartesiano.js
// Tiempo estimado: ~23 minutos | Costo estimado API: ~$1.50

const BASE_URL = 'https://notificar-clara.vercel.app'
const DELAY_MS = 2500

const TIPOS_ACTO = [
  'testimonial',
  'indagatoria',
  'resolucion_civil',
  'resolucion_penal',
  'sentencia_civil',
  'sentencia_penal',
  'sentencia_camara',
  'alimentos',
  'accesibilidad_auditiva',
  'accesibilidad_visual',
]

const DESTINATARIOS = [
  'actor',
  'demandado',
  'imputado',
  'victima',
  'testigo',
  'nna_0_6',
  'nna_7_12',
  'nna_13_17',
  'adulto_mayor',
  'letrado',
  'perito',
]

const DISCAPACIDADES = [null, 'visual', 'auditiva', 'motriz', 'intelectual']

// Texto ficticio realista — sentencia penal con datos completos
const TEXTO_FICTICIO = `
JUZGADO CRIMINAL Y CORRECCIONAL N° 5 DE LA PLATA
Causa N° 12.345/2024 — "GARCÍA, Juan Carlos s/ robo calificado"

La Plata, 20 de agosto de 2026.

RESOLUCIÓN N° 145/2026

VISTO el expediente de referencia, y CONSIDERANDO:

Que con fecha 15 de agosto de 2026 se celebró la audiencia de debate oral y público.
Que el Tribunal resolvió CONDENAR al imputado JUAN CARLOS GARCÍA, DNI 28.456.789,
de 35 años, domiciliado en calle 42 N° 1234 de La Plata, a la pena de TRES (3) AÑOS
DE PRISIÓN EN SUSPENSO, con costas, por autor penalmente responsable del delito de
robo simple (art. 164 del Código Penal).

Se IMPONE la obligación de: presentarse mensualmente ante este Juzgado, fijar domicilio
y no ausentarse sin autorización judicial, y abonar la suma de PESOS QUINIENTOS MIL
($500.000) en concepto de reparación del daño.

La presente es apelable dentro de los DIEZ (10) días hábiles de notificada, ante la
Cámara de Apelaciones y Garantías en lo Penal, sita en calle 13 esquina 48, piso 3°,
La Plata. Horario de atención: lunes a viernes de 8:00 a 14:00 hs.

Regístrese. Notifíquese. Cúmplase.
Dr. Roberto Méndez — Juez Criminal y Correccional N° 5 de La Plata
`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function tiempoRestante(indice, total, delayMs) {
  const restantes = total - indice
  const segundos = Math.round((restantes * delayMs) / 1000)
  const min = Math.floor(segundos / 60)
  const seg = segundos % 60
  return `${min}m ${seg}s`
}

async function probarCombinacion(tipo_acto, tipo_destinatario, tipo_discapacidad, indice, total) {
  const body = {
    texto_original: TEXTO_FICTICIO,
    tipo_acto,
    tipo_destinatario,
    tipo_discapacidad: tipo_discapacidad || null,
    tiene_discapacidad: !!tipo_discapacidad,
    organo_emisor: 'Juzgado Criminal y Correccional N° 5 de La Plata',
    organo_whatsapp: '5492214000000',
    abogado_nombre: 'Dra. Ana Rodríguez',
    abogado_whatsapp: '5492215000000',
    es_primera_notificacion: false,
  }

  const etiquetaDisc = tipo_discapacidad ? `[${tipo_discapacidad}]` : '[sin disc.]'
  const prefijo = `[${indice}/${total}]`

  try {
    process.stdout.write(`${prefijo} ${tipo_acto} × ${tipo_destinatario} ${etiquetaDisc} ... `)

    const res = await fetch(`${BASE_URL}/api/procesar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error desconocido')

    const urgencia = data.datos?.nivel_urgencia?.toUpperCase() || '?'
    console.log(`✅ ${urgencia} — resta: ${tiempoRestante(indice, total, DELAY_MS)}`)

    return {
      ok: true,
      tipo_acto,
      tipo_destinatario,
      tipo_discapacidad: tipo_discapacidad || null,
      id: data.id,
      url: data.url,
      titulo: data.datos?.titulo_explicacion,
      urgencia: data.datos?.nivel_urgencia,
      motivo_urgencia: data.datos?.motivo_urgencia,
      explicacion_preview: data.datos?.explicacion_principal?.substring(0, 300) + '...',
      que_debe_hacer: data.datos?.que_debe_hacer,
    }
  } catch (err) {
    console.log(`❌ ERROR: ${err.message}`)
    return {
      ok: false,
      tipo_acto,
      tipo_destinatario,
      tipo_discapacidad: tipo_discapacidad || null,
      error: err.message,
    }
  }
}

async function main() {
  const total = TIPOS_ACTO.length * DESTINATARIOS.length * DISCAPACIDADES.length
  const minutos = Math.round((total * DELAY_MS) / 60000)

  console.log(`\n🔬 NotificAR Clara — Prueba cartesiana completa`)
  console.log(`   ${TIPOS_ACTO.length} tipos × ${DESTINATARIOS.length} destinatarios × ${DISCAPACIDADES.length} discapacidades = ${total} combinaciones`)
  console.log(`   Tiempo estimado: ~${minutos} minutos`)
  console.log(`   URL: ${BASE_URL}\n`)

  const combos = []
  for (const tipo_acto of TIPOS_ACTO) {
    for (const tipo_destinatario of DESTINATARIOS) {
      for (const tipo_discapacidad of DISCAPACIDADES) {
        combos.push({ tipo_acto, tipo_destinatario, tipo_discapacidad })
      }
    }
  }

  const resultados = []
  for (let i = 0; i < combos.length; i++) {
    const { tipo_acto, tipo_destinatario, tipo_discapacidad } = combos[i]
    const resultado = await probarCombinacion(tipo_acto, tipo_destinatario, tipo_discapacidad, i + 1, combos.length)
    resultados.push(resultado)
    if (i < combos.length - 1) await sleep(DELAY_MS)
  }

  // Guardar JSON completo
  const { writeFileSync } = await import('fs')
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
  const filenameJSON = `scripts/resultados-${timestamp}.json`
  writeFileSync(filenameJSON, JSON.stringify(resultados, null, 2))

  // Guardar CSV resumido para revisión rápida
  const filenameCSV = `scripts/resultados-${timestamp}.csv`
  const header = 'tipo_acto,tipo_destinatario,tipo_discapacidad,ok,urgencia,titulo,url,error'
  const filas = resultados.map((r) =>
    [
      r.tipo_acto,
      r.tipo_destinatario,
      r.tipo_discapacidad || '',
      r.ok ? 'OK' : 'ERROR',
      r.urgencia || '',
      `"${(r.titulo || '').replace(/"/g, "'")}"`,
      r.url || '',
      `"${(r.error || '').replace(/"/g, "'")}"`,
    ].join(',')
  )
  writeFileSync(filenameCSV, [header, ...filas].join('\n'))

  // Resumen final
  const ok = resultados.filter((r) => r.ok)
  const errores = resultados.filter((r) => !r.ok)

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`✅ Exitosas: ${ok.length}/${total}`)
  if (errores.length > 0) {
    console.log(`❌ Con error: ${errores.length}`)
    errores.forEach((e) =>
      console.log(`   - ${e.tipo_acto} × ${e.tipo_destinatario} [${e.tipo_discapacidad || 'sin disc.'}]: ${e.error}`)
    )
  }
  console.log(`\n📄 JSON completo: ${filenameJSON}`)
  console.log(`📊 CSV resumido:  ${filenameCSV}`)
  console.log(`\n✔ Listo para análisis.`)
}

main().catch(console.error)
