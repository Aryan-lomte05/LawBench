'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
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

  const displayUrl = url.startsWith('http') ? `/api/pdf?url=${encodeURIComponent(url)}` : url

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
    <div className="flex flex-col items-center bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] overflow-hidden">
      <div className="w-full flex items-center justify-between p-3 border-b border-[#DDD7C9] bg-[#EDE8DD]">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            className="text-[#5B6470] hover:text-[#14171F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono uppercase tracking-wider text-[#14171F] w-24 text-center">
            {pageNumber} / {numPages || '--'}
          </span>
          <button 
            type="button"
            onClick={() => changePage(1)} 
            disabled={pageNumber >= (numPages || 1)}
            className="text-[#5B6470] hover:text-[#14171F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => changeScale(-0.25)}
            className="text-[#5B6470] hover:text-[#14171F] transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono uppercase tracking-wider text-[#14171F] w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            type="button"
            onClick={() => changeScale(0.25)}
            className="text-[#5B6470] hover:text-[#14171F] transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <a 
          href={url} 
          download={`${title}.pdf`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary h-9 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-[#DDD7C9] text-[#14171F]"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>

      <div className="w-full overflow-auto max-h-[800px] flex justify-center bg-[#F6F3EC] p-6">
        <Document
          file={displayUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-xs font-mono uppercase tracking-widest text-[#8A949E]">Loading PDF...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64 text-xs font-mono uppercase tracking-widest text-[#C0392B]">
              Failed to load PDF. Please download to view.
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            className="border border-[#DDD7C9]"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  )
}
