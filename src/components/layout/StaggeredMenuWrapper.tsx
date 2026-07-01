'use client'

import dynamic from 'next/dynamic'

export const StaggeredMenu = dynamic(
  () => import('../ui/StaggeredMenu').then((mod) => mod.StaggeredMenu),
  { ssr: false }
)
