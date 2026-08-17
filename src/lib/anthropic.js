import Anthropic from '@anthropic-ai/sdk'
import { PROMPT_BASE, PROMPTS_POR_TIPO, PROMPTS_POR_DESTINATARIO, PROMPTS_POR_DISCAPACIDAD } from './prompts/index.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function procesarNotificacion(textoOriginal, tipoActo, tipoDestinatario = 'actor', tipoDiscapacidad = null) {
  const promptEspecifico = PROMPTS_POR_TIPO[tipoActo] || ''
  const promptDestinatario = PROMPTS_POR_DESTINATARIO[tipoDestinatario] || ''
  const promptDiscapacidad = tipoDiscapacidad ? (PROMPTS_POR_DISCAPACIDAD[tipoDiscapacidad] || '') : ''

  const systemPrompt = PROMPT_BASE + '\n\n' + promptEspecifico + '\n\n' + promptDestinatario + '\n\n' + promptDiscapacidad

  const userMessage = `A continuación encontrás el texto de una notificación judicial bonaerense.
Explicala en lenguaje claro siguiendo las instrucciones que recibiste.
Devolvé únicamente el JSON solicitado, sin texto adicional antes ni después.

TEXTO DE LA NOTIFICACIÓN:
---
${textoOriginal}
---`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const raw = response.content[0].text.trim()

  // Limpiar posibles markdown code fences
  const json = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '')

  return JSON.parse(json)
}

export async function responderPreguntaLibre(pregunta, datosNotificacion) {
  const contexto = `
Tipo de acto: ${datosNotificacion.tipo_acto}
Explicación ya dada: ${datosNotificacion.explicacion_principal}
Datos clave: ${JSON.stringify(datosNotificacion.datos_clave)}
`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `Sos Clara, asistente virtual judicial bonaerense. Respondés preguntas sobre notificaciones judiciales
en lenguaje claro y empático. Nunca das consejos legales ni indicás pasos procesales concretos.
Si la persona pregunta cómo proceder o qué hacer ante la justicia, siempre recomendá que consulte con su abogado/a o con la Defensoría Oficial si cuenta con ese patrocinio.
Si la pregunta está fuera de lo que podés responder con certeza, decilo honestamente y derivá a su abogado/a o a la Defensoría Oficial.
Usá "usted". Sé breve y directo/a.`,
    messages: [
      { role: 'user', content: `Contexto de la notificación:\n${contexto}\n\nPregunta del ciudadano: ${pregunta}` }
    ],
  })

  return response.content[0].text.trim()
}
