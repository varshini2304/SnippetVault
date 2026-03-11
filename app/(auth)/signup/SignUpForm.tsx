'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AtSign, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import AvatarPreview from './AvatarPreview'

const schema = z
  .object({
    display_name: z.string().min(2, 'Display name is required').max(50),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be under 20 characters')
      .regex(/^[a-z0-9_]+$/, 'Use lowercase letters, numbers, or underscores only'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type FormValues = z.infer<typeof schema>

interface SignUpFormProps {
  onDisplayNameChange?: (value: string) => void
}

export default function SignUpForm({ onDisplayNameChange }: SignUpFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const displayName = watch('display_name')
  const username = watch('username')
  const password = watch('password')
  const confirmPassword = watch('confirm_password')
  const emailValue = watch('email')

  useEffect(() => {
    onDisplayNameChange?.(displayName)
  }, [displayName, onDisplayNameChange])

  const displayNameField = register('display_name')
  const usernameField = register('username')
  const emailField = register('email')
  const passwordField = register('password')
  const confirmField = register('confirm_password')

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
          display_name: values.display_name,
        },
      },
    })

    if (error) {
      const message = error.message.toLowerCase()
      if (message.includes('already') || message.includes('exists')) {
        setError('email', { message: 'An account with this email already exists' })
        return
      }
      toast({
        title: 'Unable to create account',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            username: values.username,
            display_name: values.display_name,
            avatar_url: null,
          },
          { onConflict: 'id' }
        )

      if (profileError) {
        toast({
          title: 'Profile setup failed',
          description: profileError.message,
          variant: 'destructive',
        })
      }
    }

    toast({
      title: 'Welcome to SnippetVault! 🎉',
      description: 'Your workspace is ready.',
    })
    router.push('/dashboard')
  }

  return (
    <div className="animate-[fadeInUp_400ms_ease_forwards]">
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">
          SV
        </div>
        <span className="font-display text-lg font-bold">SnippetVault</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">Create your account</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Start your free snippet workspace today</p>
      </div>

      <div className="mb-6 lg:hidden">
        <AvatarPreview displayName={displayName} />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="display_name" className="text-sm text-[var(--text-secondary)]">
            Display name
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="display_name"
              value={displayName}
              onChange={(event) => displayNameField.onChange(event)}
              onBlur={displayNameField.onBlur}
              name={displayNameField.name}
              ref={displayNameField.ref}
              className={`h-12 pl-10 transition ${errors.display_name ? 'border-[var(--danger)]' : ''}`}
              placeholder="Jane Doe"
            />
          </div>
          {errors.display_name ? (
            <p className="text-xs text-[var(--danger)]">{errors.display_name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm text-[var(--text-secondary)]">
            Username
          </Label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="username"
              value={username}
              onChange={(event) => {
                const next = event.target.value.toLowerCase()
                event.target.value = next
                usernameField.onChange(event)
              }}
              onBlur={usernameField.onBlur}
              name={usernameField.name}
              ref={usernameField.ref}
              className={`h-12 pl-10 transition ${errors.username ? 'border-[var(--danger)]' : ''}`}
              placeholder="your_handle"
            />
          </div>
          <div
            className={`text-xs text-[var(--text-tertiary)] transition ${
              username ? 'opacity-100' : 'opacity-0'
            }`}
          >
            /u/{username || 'username'}
          </div>
          {errors.username ? (
            <p className="text-xs text-[var(--danger)]">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-[var(--text-secondary)]">
            Email address
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="email"
              type="email"
              value={emailValue}
              onChange={(event) => emailField.onChange(event)}
              onBlur={emailField.onBlur}
              name={emailField.name}
              ref={emailField.ref}
              className={`h-12 pl-10 transition ${errors.email ? 'border-[var(--danger)]' : ''}`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email ? <p className="text-xs text-[var(--danger)]">{errors.email.message}</p> : null}
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
              onChange={(event) => passwordField.onChange(event)}
              onBlur={passwordField.onBlur}
              name={passwordField.name}
              ref={passwordField.ref}
              className={`h-12 pl-10 pr-10 transition ${errors.password ? 'border-[var(--danger)]' : ''}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
          {errors.password ? (
            <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-sm text-[var(--text-secondary)]">
            Confirm password
          </Label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <Input
              id="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => confirmField.onChange(event)}
              onBlur={confirmField.onBlur}
              name={confirmField.name}
              ref={confirmField.ref}
              className={`h-12 pl-10 pr-10 transition ${errors.confirm_password ? 'border-[var(--danger)]' : ''}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password ? (
            <p className="text-xs text-[var(--danger)]">{errors.confirm_password.message}</p>
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
              Creating account...
            </span>
          ) : (
            'Create Account →'
          )}
        </Button>
      </form>

      <p className="mt-6 text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <a href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Sign in
        </a>
      </p>
      <p className="mt-4 text-xs text-[var(--text-tertiary)]">
        By creating an account you agree to our Terms of Service
      </p>
    </div>
  )
}

