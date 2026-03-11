import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { fetchSnippetById } from '@/lib/api'
import PublicSnippetView from './PublicSnippetView'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const snippet = await fetchSnippetById(id, supabase)

  if (!snippet || !snippet.is_public) {
    return { title: 'Snippet not found · SnippetVault' }
  }

  return {
    title: `${snippet.title} · SnippetVault`,
    description: snippet.description ?? `A ${snippet.language} snippet on SnippetVault.`,
  }
}

export default async function PublicSnippetPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await getSupabaseServerClient()

  // Check if current user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const snippet = await fetchSnippetById(id, supabase)

  // Show notFound if:
  // 1. Snippet doesn't exist
  // 2. Snippet is private AND user is not the owner AND user is not authenticated
  //    (RLS handles shared-user access automatically via the snippets_select policy)
  if (!snippet) return notFound()
  if (!snippet.is_public && snippet.user_id !== user?.id) {
    // RLS already filtered — if it came back, user has access via snippet_shares
    // but if it didn't return (null), notFound was already returned above
    // If it IS returned but private and not owner, RLS allowed it via shares
    // so we still show it. If not public and not accessible, fetchSnippetById returns null.
  }

  // Increment view count via server action if bonus A is enabled
  try {
    await supabase.rpc('increment_view_count', { snippet_id: id })
  } catch {
    // Non-critical — view count failure shouldn't break the page
  }

  return <PublicSnippetView snippet={snippet} />
}
