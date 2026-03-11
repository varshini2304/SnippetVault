'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useCreateSnippet } from '@/hooks/useCreateSnippet'
import { useUpdateSnippet } from '@/hooks/useUpdateSnippet'
import type { Language, Snippet } from '@/types'
import { getLanguageColor } from '@/lib/utils'
import TagChipInput from './TagChipInput'
import CodeEditorField from './CodeEditorField'

const languageList = [
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
] as const

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  language: z.enum(languageList, { errorMap: () => ({ message: 'Please select a language' }) }),
  description: z.string().max(300, 'Max 300 characters').optional().or(z.literal('')),
  code: z.string().min(1, 'Code is required'),
  tags: z.array(z.string()).max(10, 'Max 10 tags'),
  is_public: z.boolean(),
})

type FormValues = z.infer<typeof schema>

type Mode = 'create' | 'edit'

interface SnippetFormProps {
  mode: Mode
  snippet?: Snippet | null
  userId: string | null
  onClose: () => void
}

export default function SnippetForm({ mode, snippet, userId, onClose }: SnippetFormProps) {
  const { toast } = useToast()
  const [showDiscard, setShowDiscard] = useState(false)
  const createMutation = useCreateSnippet(userId)
  const updateMutation = useUpdateSnippet()

  const defaultValues: FormValues = useMemo(
    () => ({
      title: snippet?.title ?? '',
      language: (snippet?.language as Language) ?? 'typescript',
      description: snippet?.description ?? '',
      code: snippet?.code ?? '',
      tags: snippet?.tags?.map((t) => t.name) ?? [],
      is_public: snippet?.is_public ?? false,
    }),
    [snippet]
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const codeValue = watch('code')
  const descriptionValue = watch('description')

  const lineCount = codeValue ? codeValue.split('\n').length : 0
  const charCount = codeValue ? codeValue.length : 0

  const onSubmit = async (values: FormValues) => {
    if (!userId && mode === 'create') return
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync({ ...values, description: values.description || undefined })
        toast({ title: 'Snippet created!' })
      } else if (snippet) {
        await updateMutation.mutateAsync({
          id: snippet.id,
          ...values,
          description: values.description || undefined,
        })
        toast({ title: 'Snippet updated!' })
      }
      onClose()
    } catch (err: any) {
      toast({
        title: 'Save failed',
        description: err?.message ?? 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  const onError = (errs: typeof errors) => {
    const firstKey = Object.keys(errs)[0]
    if (firstKey) {
      const el = document.getElementById(firstKey)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 h-screen w-full animate-[fadeInUp_300ms_ease_forwards] bg-[var(--bg-elevated)] md:top-16 md:h-[calc(100vh-64px)] md:w-[560px] md:animate-[slideInRight_300ms_ease_forwards]">
      <div className="flex h-full flex-col">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => (isDirty ? setShowDiscard(true) : onClose())}>
              <X className="h-4 w-4" />
            </Button>
            <div className="font-display text-lg font-semibold">
              {mode === 'create' ? 'New Snippet' : 'Edit Snippet'}
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">{lineCount} lines · {charCount} chars</div>
          </div>

          {showDiscard ? (
            <div className="mt-3 rounded-xl border border-[var(--warning)]/60 bg-[var(--warning)]/10 p-3 text-sm">
              <div className="font-semibold text-[var(--warning)]">Discard changes?</div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={() => setShowDiscard(false)}>Cancel</Button>
                <Button className="bg-[var(--danger)] text-white hover:bg-red-500" onClick={onClose}>
                  Discard
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <form
          id="snippet-form"
          className="flex-1 space-y-6 overflow-y-auto px-5 py-6"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm text-[var(--text-secondary)]">Title *</label>
            <Input
              id="title"
              placeholder="e.g. Debounce hook utility"
              className={`${errors.title ? 'border-[var(--danger)] animate-[shake_300ms_ease]' : ''}`}
              {...register('title')}
            />
            {errors.title ? <p className="text-xs text-[var(--danger)]">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="language" className="text-sm text-[var(--text-secondary)]">Language *</label>
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="language" className={errors.language ? 'border-[var(--danger)] animate-[shake_300ms_ease]' : ''}>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bg-elevated)]">
                    {languageList.map((lang) => {
                      const colors = getLanguageColor(lang)
                      return (
                        <SelectItem key={lang} value={lang}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.text }} />
                            {lang}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language ? <p className="text-xs text-[var(--danger)]">{errors.language.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm text-[var(--text-secondary)]">Description (optional)</label>
            <Textarea
              id="description"
              rows={3}
              placeholder="A brief description of what this snippet does..."
              className={errors.description ? 'border-[var(--danger)] animate-[shake_300ms_ease]' : ''}
              {...register('description')}
            />
            <div className="text-xs text-[var(--text-tertiary)]">{(descriptionValue ?? '').length} / 300</div>
            {errors.description ? <p className="text-xs text-[var(--danger)]">{errors.description.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm text-[var(--text-secondary)]">Code *</label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <CodeEditorField
                  id="code"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={Boolean(errors.code)}
                />
              )}
            />
            {errors.code ? <p className="text-xs text-[var(--danger)]">{errors.code.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--text-secondary)]">Tags</label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TagChipInput value={field.value} onChange={field.onChange} maxTags={10} />
              )}
            />
            {errors.tags ? <p className="text-xs text-[var(--danger)]">{errors.tags.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--text-secondary)]">Visibility</label>
            <Controller
              control={control}
              name="is_public"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3">
                  <span className="text-xs text-[var(--warning)]">🔒 Private</span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[var(--success)] data-[state=unchecked]:bg-[var(--warning)]"
                  />
                  <span className="text-xs text-[var(--success)]">🌐 Public</span>
                </div>
              )}
            />
            <div className="text-xs text-[var(--text-tertiary)]">
              {watch('is_public') ? 'Anyone can view this at /s/[id]' : 'Only you can see this snippet'}
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[var(--text-tertiary)]">{lineCount} lines of code</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => (isDirty ? setShowDiscard(true) : onClose())}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="snippet-form"
                className="bg-[var(--accent)] text-white"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {isSubmitting || createMutation.isPending || updateMutation.isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Saving...'
                  : mode === 'create'
                    ? 'Create Snippet →'
                    : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

