import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, BookOpen, PenTool, LayoutDashboard, Settings } from 'lucide-react'

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
    redirect('/dashboard') // unauthorized users go to standard dashboard
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-heading font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/admin/resources" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors">
            <FileText className="w-4 h-4" /> Resources
          </Link>
          <Link href="/admin/subjects" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors">
            <BookOpen className="w-4 h-4" /> Subjects
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/10 transition-colors">
            <PenTool className="w-4 h-4" /> Blog Engine
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header (simplified) */}
        <div className="md:hidden h-16 border-b border-border bg-card flex items-center px-4">
          <span className="font-heading font-bold">Admin Panel</span>
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
