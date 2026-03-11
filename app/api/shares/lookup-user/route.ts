import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await adminClient.auth.admin.listUsers()
  if (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (!found) {
    return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  }

  return NextResponse.json({ profileId: found.id })
}
