'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import Navbar from '@/components/nav/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [profile, setProfile] = useState<{ display_name: string; username: string; avatar_url: string | null } | null>(
    null
  )

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser()
      const userId = data.user?.id
      if (!userId) return
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('id', userId)
        .maybeSingle()
      if (active && profileRow) setProfile(profileRow)
    }
    loadProfile()
    return () => {
      active = false
    }
  }, [supabase])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar profile={profile} />
      <div className="mx-auto max-w-[1400px] px-6 py-6">{children}</div>
    </div>
  )
}
