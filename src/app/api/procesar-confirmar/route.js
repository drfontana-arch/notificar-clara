import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'

// POST /api/procesar-confirmar
// Recibe los datos de la IA + el texto revisado por el operador.
// Guarda ambas versiones en Supabase y genera el QR.
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      texto_original,
      tipo_acto,
      datos_ia,              // objeto completo que devolvió /api/procesar?preview=true
      texto_operador,        // explicacion_principal editada por el operador
      que_debe_hacer_operador, // array de pasos editados por el operador
    } = body

    if (!texto_original || !tipo_acto || !datos_ia) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (texto_original, tipo_acto, datos_ia).' },
        { status: 400 }
      )
    }

    // Construir datos finales: base = datos de la IA, luego aplicar edición del operador
    const datos = { ...datos_ia }

    // Guardar versión original de la IA
    datos.texto_ia_original         = datos_ia.explicacion_principal || ''
    datos.que_debe_hacer_ia_original = datos_ia.que_debe_hacer || []

    // Aplicar versión del operador (puede ser igual o diferente)
    const textoFinal   = (typeof texto_operador === 'string') ? texto_operador.trim() : datos.texto_ia_original
    const queDebehacer = Array.isArray(que_debe_hacer_operador) ? que_debe_hacer_operador : datos.que_debe_hacer_ia_original

    datos.explicacion_principal   = textoFinal
    datos.que_debe_hacer          = queDebehacer
    datos.texto_operador_editado  = textoFinal
    datos.editado_por_operador    = (textoFinal !== datos.texto_ia_original)

    // Calcular tokens aproximados del preview (vienen en body opcionalmente)
    const tokens_entrada = body.tokens_entrada || 0
    const tokens_salida  = body.tokens_salida  || 0

    // Guardar en Supabase
    const id = uuidv4()
    const db = supabaseAdmin()
    const { error: dbError } = await db.from('notificaciones').insert({
      id,
      texto_original,
      tipo_acto,
      datos_procesados: datos,
      tokens_entrada,
      tokens_salida,
      creado_en: new Date().toISOString(),
    })

    if (dbError) throw dbError

    // Generar QR
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/n/${id}`
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a5276', light: '#ffffff' },
    })

    return NextResponse.json({ id, url, qr: qrDataUrl, datos })
  } catch (err) {
    console.error('Error en /api/procesar-confirmar:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
