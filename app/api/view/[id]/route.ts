import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Missing snippet id' }, { status: 400 })
  }

  const { data: snippet } = await adminClient
    .from('snippets')
    .select('id, is_public')
    .eq('id', id)
    .single()

  if (!snippet) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await adminClient.rpc('increment_view_count', { snippet_id: id })

  return NextResponse.json({ success: true })
}
