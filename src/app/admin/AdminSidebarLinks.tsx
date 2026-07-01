'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, BookOpen, PenTool, Settings } from 'lucide-react'

export function AdminSidebarLinks() {
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href))
    return `flex items-center gap-3 px-6 py-2.5 text-xs font-sans font-medium transition-all duration-150 ${
      isActive 
        ? 'border-l-[3px] border-[#B8975A] text-[#F9F8F5] bg-[#1C2029]' 
        : 'border-l-[3px] border-transparent text-[#8A949E] hover:text-[#F9F8F5]'
    }`
  }

  return (
    <nav className="flex-1 py-6 space-y-6">
      {/* Overview */}
      <div>
        <Link href="/admin" className={linkClass('/admin')}>
          <LayoutDashboard className="w-4 h-4" /> Overview
        </Link>
      </div>

      {/* Content Section */}
      <div className="space-y-1">
        <span className="px-6 block text-[10px] font-mono tracking-[0.12em] uppercase text-[#5B6470] mb-2">
          Content
        </span>
        <Link href="/admin/resources" className={linkClass('/admin/resources')}>
          <FileText className="w-4 h-4" /> Resources
        </Link>
        <Link href="/admin/subjects" className={linkClass('/admin/subjects')}>
          <BookOpen className="w-4 h-4" /> Subjects
        </Link>
      </div>

      {/* Platform Section */}
      <div className="space-y-1">
        <span className="px-6 block text-[10px] font-mono tracking-[0.12em] uppercase text-[#5B6470] mb-2">
          Platform
        </span>
        <Link href="/admin/blog" className={linkClass('/admin/blog')}>
          <PenTool className="w-4 h-4" /> Blog Engine
        </Link>
        <Link href="/admin/settings" className={linkClass('/admin/settings')}>
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </nav>
  )
}
