'use client'

import { useState } from 'react'
import { toPng } from 'html-to-image'

export const useImageExport = () => {
  const [isExporting, setIsExporting] = useState(false)

  const exportImage = async (node: HTMLElement, filename: string) => {
    setIsExporting(true)
    try {
      const dataUrl = await toPng(node, { cacheBust: true })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      link.click()
    } finally {
      setIsExporting(false)
    }
  }

  return { exportImage, isExporting }
}
