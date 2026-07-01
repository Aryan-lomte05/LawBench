import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, User } from 'lucide-react'
import { StaggeredMenu } from '@/components/layout/StaggeredMenuWrapper'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-sm font-extrabold tracking-[0.3em] text-[#F6F3EC] uppercase flex items-center gap-1.5 transition-colors hover:text-[#B8975A]">
            <span>LAWBENCH</span>
            <span className="text-[#B8975A] font-light">·</span>
          </Link>
          
          <div className="hidden md:flex gap-6 text-[10px] font-mono uppercase tracking-widest text-[#A1A8B4] items-center">
            <Link href="/subjects" className="hover:text-[#B8975A] transition-colors">Subjects</Link>
            <span className="text-[#B8975A]/40">·</span>
            <Link href="/resources" className="hover:text-[#B8975A] transition-colors">Resources</Link>
            <span className="text-[#B8975A]/40">·</span>
            <Link href="/latest" className="hover:text-[#B8975A] transition-colors">Latest</Link>
            <span className="text-[#B8975A]/40">·</span>
            <Link href="/blog" className="hover:text-[#B8975A] transition-colors">Blog</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors p-2 mr-12 md:mr-0">
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <StaggeredMenu
              isFixed={true}
              position="right"
              items={[
                { label: 'Subjects', ariaLabel: 'Subjects list', link: '/subjects' },
                { label: 'Resources', ariaLabel: 'Resource library', link: '/resources' },
                { label: 'Latest', ariaLabel: 'Latest uploads', link: '/latest' },
                { label: 'Blog', ariaLabel: 'Articles and study tips', link: '/blog' },
                { label: 'Dashboard', ariaLabel: 'Student dashboard', link: '/dashboard' }
              ]}
              colors={['#1F3A33', '#B8975A']}
              accentColor="#B8975A"
              menuButtonColor="#f6f3ec"
              openMenuButtonColor="#14171f"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

