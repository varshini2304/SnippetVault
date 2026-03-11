import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-code', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'SnippetVault',
  description: 'A modern code snippet manager for developers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${dmSans.variable} ${jetbrains.variable} bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
