import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { NavbarLinks } from '@/components/layout/NavbarLinks'
import { NavbarRight } from '@/components/layout/NavbarRight'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'user'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile) {
      role = profile.role
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2A2E3A] bg-[#14171F]/85 backdrop-blur-md h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-[18px] font-medium tracking-wide text-[#F9F8F5]">
            LAWBENCH
          </Link>
          
          <NavbarLinks />
        </div>

        <NavbarRight user={user} role={role} />
      </div>
    </nav>
  )
}
