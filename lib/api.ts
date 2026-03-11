import type { SupabaseClient } from '@supabase/supabase-js'
import type { CreateSnippetInput, Profile, Snippet, SnippetShare, Tag, UpdateSnippetInput } from '@/types'
import { getSupabaseBrowserClient } from './supabase/client'

const getClient = (client?: SupabaseClient) => client ?? getSupabaseBrowserClient()

const normalizeSnippet = (row: any): Snippet => {
  const tags = (row.snippet_tags ?? []).map((st: any) => st.tags).filter(Boolean)
  return { ...row, tags }
}

const normalizeTags = (tags: string[]) =>
  Array.from(
    new Set(
      tags
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
    )
  )

const upsertTags = async (names: string[], client?: SupabaseClient): Promise<Tag[]> => {
  if (names.length === 0) return []
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('tags')
    .upsert(names.map((name) => ({ name })), { onConflict: 'name' })
    .select('*')
  if (error) throw new Error(error.message)
  return data as Tag[]
}

const setSnippetTags = async (snippetId: string, tagIds: string[], client?: SupabaseClient) => {
  const supabase = getClient(client)
  await supabase.from('snippet_tags').delete().eq('snippet_id', snippetId)
  if (tagIds.length === 0) return
  const payload = tagIds.map((tag_id) => ({ snippet_id: snippetId, tag_id }))
  const { error } = await supabase.from('snippet_tags').insert(payload)
  if (error) throw new Error(error.message)
}

export const fetchUserSnippets = async (userId: string, client?: SupabaseClient): Promise<Snippet[]> => {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('snippets')
    .select('*, snippet_tags(tags(*))')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(normalizeSnippet)
}

export const fetchSnippetById = async (id: string, client?: SupabaseClient): Promise<Snippet | null> => {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('snippets')
    .select('*, profiles(id, username, display_name, avatar_url), snippet_tags(tags(*))')
    .eq('id', id)
    .maybeSingle()
  if (error) return null
  return data ? normalizeSnippet(data) : null
}

export const fetchPublicSnippetById = async (
  id: string,
  client?: SupabaseClient
): Promise<Snippet | null> => {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('snippets')
    .select('*, profiles(id, username, display_name, avatar_url), snippet_tags(tags(*))')
    .eq('id', id)
    .maybeSingle()
  if (error) return null
  return data ? normalizeSnippet(data) : null
}

export const fetchPublicSnippetsByUsername = async (
  username: string,
  client?: SupabaseClient
): Promise<Snippet[]> => {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('snippets')
    .select('*, snippet_tags(tags(*)), profiles!inner(username)')
    .eq('profiles.username', username)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(normalizeSnippet)
}

export const fetchProfileByUsername = async (
  username: string,
  client?: SupabaseClient
): Promise<Profile | null> => {
  const supabase = getClient(client)
  const { data, error } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  if (error) return null
  return data as Profile | null
}

export const createSnippet = async (
  input: CreateSnippetInput,
  userId: string,
  client?: SupabaseClient
): Promise<Snippet> => {
  const supabase = getClient(client)
  const { tags, ...rest } = input
  const { data: snippet, error } = await supabase
    .from('snippets')
    .insert({ ...rest, user_id: userId })
    .select('*')
    .single()
  if (error) throw new Error(error.message)

  const normalizedTags = normalizeTags(tags)
  const tagRows = await upsertTags(normalizedTags, client)
  await setSnippetTags(snippet.id, tagRows.map((t) => t.id), client)

  const full = await fetchSnippetById(snippet.id, client)
  if (!full) throw new Error('Failed to load snippet after create')
  return full
}

export const updateSnippet = async (input: UpdateSnippetInput, client?: SupabaseClient): Promise<Snippet> => {
  const supabase = getClient(client)
  const { id, tags, ...rest } = input

  const { error } = await supabase
    .from('snippets')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)

  if (tags) {
    const normalizedTags = normalizeTags(tags)
    const tagRows = await upsertTags(normalizedTags, client)
    await setSnippetTags(id, tagRows.map((t) => t.id), client)
  }

  const full = await fetchSnippetById(id, client)
  if (!full) throw new Error('Failed to load snippet after update')
  return full
}

export const deleteSnippet = async (id: string, client?: SupabaseClient): Promise<void> => {
  const supabase = getClient(client)
  const { error } = await supabase.from('snippets').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export const fetchShares = async (snippetId: string, client?: SupabaseClient): Promise<SnippetShare[]> => {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('snippet_shares')
    .select('*, profiles(id, username, display_name, avatar_url)')
    .eq('snippet_id', snippetId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data as SnippetShare[]
}

export const addShare = async (
  snippetId: string,
  email: string,
  client?: SupabaseClient
): Promise<SnippetShare> => {
  const supabase = getClient(client)
  const { data: auth } = await supabase.auth.getUser()
  const normalizedEmail = email.trim().toLowerCase()

  if (auth.user?.email?.toLowerCase() === normalizedEmail) {
    throw new Error('SELF_SHARE')
  }

  const res = await fetch('/api/shares/lookup-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail }),
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: 'NO_ACCOUNT' }))
    throw new Error(payload.error || 'NO_ACCOUNT')
  }

  const { profileId } = await res.json()

  const { data, error } = await supabase
    .from('snippet_shares')
    .insert({ snippet_id: snippetId, shared_with: profileId })
    .select('*, profiles(id, username, display_name, avatar_url)')
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('ALREADY_SHARED')
    throw new Error(error.message)
  }

  return data as SnippetShare
}

export const removeShare = async (shareId: string, client?: SupabaseClient): Promise<void> => {
  const supabase = getClient(client)
  const { error } = await supabase.from('snippet_shares').delete().eq('id', shareId)
  if (error) throw new Error(error.message)
}

export const getProfile = async (userId: string, client?: SupabaseClient): Promise<Profile | null> => {
  const supabase = getClient(client)
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) return null
  return data as Profile | null
}

export const createProfile = async (
  profile: Omit<Profile, 'created_at'>,
  client?: SupabaseClient
): Promise<Profile> => {
  const supabase = getClient(client)
  const { data, error } = await supabase.from('profiles').insert(profile).select('*').single()
  if (error) throw new Error(error.message)
  return data as Profile
}

export const incrementViewCount = async (snippetId: string, client?: SupabaseClient): Promise<void> => {
  if (typeof window !== 'undefined') {
    throw new Error('incrementViewCount must be called on the server')
  }
  const supabase = getClient(client)
  const { error } = await supabase.rpc('increment_view_count', { snippet_id: snippetId })
  if (error) throw new Error(error.message)
}
