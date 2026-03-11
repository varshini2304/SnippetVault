export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
}

export interface Snippet {
  id: string
  user_id: string
  title: string
  language: Language
  description: string | null
  code: string
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string
  tags: Tag[]
  profiles?: Profile
}

export interface SnippetShare {
  id: string
  snippet_id: string
  shared_with: string
  created_at: string
  profiles?: Profile
}

export type Language =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'bash'
  | 'css'
  | 'html'
  | 'sql'
  | 'go'
  | 'rust'
  | 'java'
  | 'c'
  | 'cpp'
  | 'json'
  | 'yaml'
  | 'markdown'

export const SUPPORTED_LANGUAGES: Language[] = [
  'typescript',
  'javascript',
  'python',
  'bash',
  'css',
  'html',
  'sql',
  'go',
  'rust',
  'java',
  'c',
  'cpp',
  'json',
  'yaml',
  'markdown',
]

export interface CreateSnippetInput {
  title: string
  language: Language
  description?: string
  code: string
  tags: string[]
  is_public: boolean
}

export interface UpdateSnippetInput {
  id: string
  title?: string
  language?: Language
  description?: string
  code?: string
  tags?: string[]
  is_public?: boolean
}

export type VisibilityFilter = 'all' | 'public' | 'private'

export interface FilterState {
  searchQuery: string
  selectedTags: string[]
  visibilityFilter: VisibilityFilter
}

export interface UIStore extends FilterState {
  activeSnippetId: string | null
  isShareMenuOpen: boolean
  setActiveSnippet: (id: string | null) => void
  setShareMenuOpen: (open: boolean) => void
  setSearchQuery: (q: string) => void
  toggleTag: (tag: string) => void
  setVisibilityFilter: (v: VisibilityFilter) => void
  clearFilters: () => void
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
