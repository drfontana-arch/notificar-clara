import { NextResponse } from 'next/server'
import { procesarNotificacion } from '@/lib/anthropic'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      texto_original,
      tipo_acto,
      organo_emisor,
      organo_whatsapp,
      abogado_nombre,
      abogado_whatsapp,
      es_primera_notificacion,
    } = body

    if (!texto_original || !tipo_acto) {
      return NextResponse.json(
        { error: 'Falta el texto de la notificación o el tipo de acto.' },
        { status: 400 }
      )
    }

    // 1. Procesar con IA
    const datos = await procesarNotificacion(texto_original, tipo_acto)

    // Enriquecer con datos del formulario
    datos.organo_emisor = organo_emisor || ''
    datos.organo_whatsapp = organo_whatsapp || ''
    datos.abogado_nombre = abogado_nombre || ''
    datos.abogado_whatsapp = abogado_whatsapp || ''
    datos.es_primera_notificacion = es_primera_notificacion || false

    // 2. Guardar en Supabase
    const id = uuidv4()
    const db = supabaseAdmin()
    const { error: dbError } = await db.from('notificaciones').insert({
      id,
      texto_original,
      tipo_acto,
      datos_procesados: datos,
      creado_en: new Date().toISOString(),
    })

    if (dbError) throw dbError

    // 3. Generar QR
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/n/${id}`
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1a5276', light: '#ffffff' },
    })

    return NextResponse.json({ id, url, qr: qrDataUrl, datos })
  } catch (err) {
    console.error('Error en /api/procesar:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
