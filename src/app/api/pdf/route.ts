import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pdfUrl = searchParams.get('url')

  if (!pdfUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status })
    }

    const data = await response.arrayBuffer()

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*', // allow access
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error: any) {
    return new NextResponse(`CORS Proxy Error: ${error.message}`, { status: 500 })
  }
}
