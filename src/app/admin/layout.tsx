import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebarLinks } from './AdminSidebarLinks'
import { LayoutDashboard, FileText, BookOpen, PenTool, Settings } from 'lucide-react'

export const metadata = {
  title: 'Admin Panel | LawBench',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#F6F3EC]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#14171F] border-r border-[#2A2E3A] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#2A2E3A]">
          <Link href="/" className="font-heading text-sm font-extrabold tracking-[0.2em] text-[#F9F8F5] uppercase flex items-center gap-1">
            <span>LAWBENCH</span>
            <span className="text-[#B8975A] font-light">·</span>
          </Link>
        </div>
        
        {/* Navigation list */}
        <AdminSidebarLinks />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-[#F6F3EC] text-[#14171F] pb-24 md:pb-8">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-[#DDD7C9] bg-[#EDE8DD] flex items-center px-4 justify-between">
          <span className="font-heading font-semibold text-[#14171F]">Admin Panel</span>
          <Link href="/" className="text-xs font-mono tracking-wider text-[#B8975A]">
            EXIT
          </Link>
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar (Section 14 responsive overlay) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#14171F] border-t border-[#2A2E3A] z-50 flex items-center justify-around px-2">
        <Link href="/admin" className="flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A949E] hover:text-[#F9F8F5] transition-colors">
          <LayoutDashboard className="w-5.5 h-5.5 mb-1" />
          <span>Home</span>
        </Link>
        <Link href="/admin/resources" className="flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A949E] hover:text-[#F9F8F5] transition-colors">
          <FileText className="w-5.5 h-5.5 mb-1" />
          <span>Files</span>
        </Link>
        <Link href="/admin/subjects" className="flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A949E] hover:text-[#F9F8F5] transition-colors">
          <BookOpen className="w-5.5 h-5.5 mb-1" />
          <span>Subjects</span>
        </Link>
        <Link href="/admin/blog" className="flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A949E] hover:text-[#F9F8F5] transition-colors">
          <PenTool className="w-5.5 h-5.5 mb-1" />
          <span>Blog</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A949E] hover:text-[#F9F8F5] transition-colors">
          <Settings className="w-5.5 h-5.5 mb-1" />
          <span>Config</span>
        </Link>
      </div>
    </div>
  )
}
