import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { fetchPublicSnippetsByUsername, fetchProfileByUsername } from '@/lib/api'
import ProfilePageClient from './ProfilePageClient'
import ProfileHero from './ProfileHero'

export const revalidate = 120

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateStaticParams() {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('snippets')
    .select('profiles!inner(username)')
    .eq('is_public', true)

  const usernames = Array.from(
    new Set((data ?? []).map((row: any) => row.profiles?.username).filter(Boolean))
  )

  return usernames.map((username) => ({ username }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await getSupabaseServerClient()
  const profile = await fetchProfileByUsername(username, supabase)

  if (!profile) {
    return {
      title: 'Profile not found · SnippetVault',
      description: 'This profile does not exist or has no public snippets.',
    }
  }

  return {
    title: `${profile.display_name}'s Snippets on SnippetVault`,
    description: `Explore ${profile.display_name}'s public snippets on SnippetVault.`,
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await getSupabaseServerClient()
  const [profile, snippets] = await Promise.all([
    fetchProfileByUsername(username, supabase),
    fetchPublicSnippetsByUsername(username, supabase),
  ])

  if (!profile) return notFound()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <ProfileHero profile={profile} snippets={snippets} />
      <ProfilePageClient profile={profile} snippets={snippets} />
    </div>
  )
}
