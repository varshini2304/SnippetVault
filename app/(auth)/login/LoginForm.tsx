'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const emailField = register('email')
  const passwordField = register('password')

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast({
        title: 'Unable to sign in',
        description: error.message,
        variant: 'destructive',
      })
      setError('email', { message: 'Check your email and password' })
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="animate-[fadeInUp_400ms_ease_forwards]">
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">
            SV
          </div>
          <span className="font-display text-lg font-bold">SnippetVault</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Sign in to your snippet workspace</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-[var(--text-secondary)]">
            Email address
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                emailField.onChange(event)
              }}
              onBlur={emailField.onBlur}
              name={emailField.name}
              ref={emailField.ref}
              className={`h-12 pl-10 transition ${errors.email ? 'border-[var(--danger)]' : ''}`}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? (
            <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-[var(--text-secondary)]">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                passwordField.onChange(event)
              }}
              onBlur={passwordField.onBlur}
              name={passwordField.name}
              ref={passwordField.ref}
              className={`h-12 pl-10 pr-10 transition ${errors.password ? 'border-[var(--danger)]' : ''}`}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-[var(--accent)] text-white transition active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign In →'
          )}
        </Button>
      </form>

      <p className="mt-6 text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Sign up
        </a>
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 h-12 w-full border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
      >
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
          <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.706 31.91 29.19 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.807 0 5.37 1.058 7.343 2.789l5.657-5.657C33.477 6.053 28.977 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.54 16.108 18.938 13 24 13c2.807 0 5.37 1.058 7.343 2.789l5.657-5.657C33.477 6.053 28.977 4 24 4c-7.681 0-14.332 4.314-17.694 10.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c4.995 0 9.487-1.919 12.89-5.046l-5.966-5.052C29.06 35.091 26.62 36 24 36c-5.162 0-9.548-3.02-11.146-7.391l-6.53 5.025C9.664 39.732 16.345 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.28 3.547-4.665 6.091-8.303 6.091-5.162 0-9.548-3.02-11.146-7.391l-6.53 5.025C9.664 39.732 16.345 44 24 44c11.045 0 20-8.955 20-20 0-1.341-.138-2.651-.389-3.917z"
            />
          </svg>
        </span>
        Continue with Google
      </Button>
    </div>
  )
}


