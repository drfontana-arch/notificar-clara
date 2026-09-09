import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/agenda/letrados?unidad_id=&rol=
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const unidad_id = searchParams.get('unidad_id')
    const rol       = searchParams.get('rol')

    let query = supabaseAdmin()
      .from('letrados')
      .select('id, nombre, email, rol, unidad_id, unidades(nombre)')
      .eq('activo', true)
      .order('nombre')

    if (unidad_id) query = query.eq('unidad_id', unidad_id)
    if (rol)       query = query.eq('rol', rol)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ letrados: data || [] })
  } catch (err) {
    console.error('[GET /api/agenda/letrados]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
