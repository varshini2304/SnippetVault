'use client'

import { useMemo } from 'react'

interface PasswordStrengthMeterProps {
  password: string
}

const getScore = (password: string) => {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

const getColor = (index: number, score: number) => {
  if (score === 0) return 'bg-[var(--border)]'
  if (index >= score) return 'bg-[var(--border)]'
  if (score === 1) return 'bg-[var(--danger)]'
  if (score === 2 || score === 3) return 'bg-[var(--warning)]'
  return 'bg-[var(--success)]'
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const score = useMemo(() => getScore(password), [password])

  return (
    <div className="mt-2 grid grid-cols-4 gap-2">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${getColor(index, score)}`}
        />
      ))}
    </div>
  )
}
