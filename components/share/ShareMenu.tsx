'use client'

import { useEffect, useState } from 'react'
import { Share2, X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import type { Snippet } from '@/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import SharePublicUrl from './SharePublicUrl'
import ShareWithUser from './ShareWithUser'
import ExportAsImage from './ExportAsImage'
import CopyLinkButton from './CopyLinkButton'

interface ShareMenuProps {
  snippet: Snippet
  trigger: React.ReactNode
}

export default function ShareMenu({ snippet, trigger }: ShareMenuProps) {
  const isOpen = useUIStore((state) => state.isShareMenuOpen)
  const setShareMenuOpen = useUIStore((state) => state.setShareMenuOpen)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const content = (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <Share2 className="h-4 w-4 text-[var(--accent)]" />
          Share Snippet
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShareMenuOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-[var(--bg-tertiary)] p-1">
          <TabsTrigger value="link" className="rounded-lg text-xs data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
            🔗 Link
          </TabsTrigger>
          <TabsTrigger value="people" className="rounded-lg text-xs data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
            👤 People
          </TabsTrigger>
          <TabsTrigger value="image" className="rounded-lg text-xs data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
            🖼 Image
          </TabsTrigger>
          <TabsTrigger value="copy" className="rounded-lg text-xs data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">
            📋 Copy
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <TabsContent value="link" className="mt-0">
            <SharePublicUrl snippet={snippet} />
          </TabsContent>
          <TabsContent value="people" className="mt-0">
            <ShareWithUser snippet={snippet} />
          </TabsContent>
          <TabsContent value="image" className="mt-0">
            <ExportAsImage snippet={snippet} />
          </TabsContent>
          <TabsContent value="copy" className="mt-0">
            <CopyLinkButton snippet={snippet} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <div onClick={() => setShareMenuOpen(true)}>{trigger}</div>
        <Sheet open={isOpen} onOpenChange={setShareMenuOpen}>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl border-[var(--border)] bg-[var(--bg-elevated)]">
            {content}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setShareMenuOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl"
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}
