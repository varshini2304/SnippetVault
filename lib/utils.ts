import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

export const formatRelativeTime = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getInitials = (displayName: string) => {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const AVATAR_COLORS = ['#6C63FF', '#22C55E', '#F59E0B', '#E34916', '#00ADD8', '#CE422B']

export const hashColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

export const truncateLines = (code: string, maxLines: number) => {
  const lines = code.split('\n')
  if (lines.length <= maxLines) return code
  return [...lines.slice(0, maxLines), '...truncated'].join('\n')
}

export const getLanguageColor = (language: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    typescript: { bg: '#007ACC22', text: '#007ACC', border: '#007ACC44' },
    javascript: { bg: '#F7DF1E22', text: '#F7DF1E', border: '#F7DF1E44' },
    python: { bg: '#3776AB22', text: '#3776AB', border: '#3776AB44' },
    bash: { bg: '#4EAA2522', text: '#4EAA25', border: '#4EAA2544' },
    sql: { bg: '#E97B2522', text: '#E97B25', border: '#E97B2544' },
    css: { bg: '#663399aa', text: '#9B59D4', border: '#66339944' },
    html: { bg: '#E3491622', text: '#E34916', border: '#E3491644' },
    go: { bg: '#00ADD822', text: '#00ADD8', border: '#00ADD844' },
    rust: { bg: '#CE422B22', text: '#CE422B', border: '#CE422B44' },
    default: { bg: '#9B99C022', text: '#9B99C0', border: '#9B99C044' },
  }

  return map[language] ?? map.default
}

export const buildShareUrl = (snippetId: string) => {
  const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')
  return `${base}/s/${snippetId}`
}

export const mapAuthError = (message: string) => {
  const map: Record<string, string> = {
    'User already registered': 'An account with this email already exists',
    'Invalid login credentials': 'Incorrect email or password',
    'Email not confirmed': 'Please verify your email before logging in',
    'Password should be at least 6 characters': 'Password must be at least 8 characters',
  }
  return map[message] ?? message
}
