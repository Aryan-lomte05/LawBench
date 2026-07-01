'use client'

import dynamic from 'next/dynamic'

export const Lightfall = dynamic(
  () => import('./Lightfall').then((mod) => mod.Lightfall),
  { ssr: false }
)
