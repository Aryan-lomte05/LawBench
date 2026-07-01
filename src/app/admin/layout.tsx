import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminSidebarLinks } from './AdminSidebarLinks'

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
      <main className="flex-1 min-h-screen bg-[#F6F3EC] text-[#14171F]">
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
    </div>
  )
}
