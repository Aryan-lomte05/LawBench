'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react'

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  url: string
  title: string
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }

  const changeScale = (offset: number) => {
    setScale(prevScale => Math.max(0.5, Math.min(prevScale + offset, 2.5)))
  }

  return (
    <div className="flex flex-col items-center bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="w-full flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-24 text-center">
            {pageNumber} / {numPages || '--'}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => changeScale(-0.25)}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => changeScale(0.25)}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="default" size="sm" className="gap-2" asChild>
          <a href={url} download={`${title}.pdf`} target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4" />
            Download
          </a>
        </Button>
      </div>

      <div className="w-full overflow-auto max-h-[800px] flex justify-center bg-muted/10 p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading PDF...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64 text-destructive">
              Failed to load PDF. Please try downloading it instead.
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            className="shadow-md"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  )
}
