'use client'

import dynamic from 'next/dynamic'

export const PdfViewer = dynamic(
  () => import('./PdfViewer').then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted/10 rounded-lg border border-border">
        <div className="animate-pulse text-muted-foreground">Loading PDF Viewer...</div>
      </div>
    )
  }
)
