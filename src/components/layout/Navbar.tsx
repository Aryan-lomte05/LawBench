import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Search, Menu, User } from 'lucide-react'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
            LawBench.
          </Link>
          
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link>
            <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="/latest" className="hover:text-foreground transition-colors">Latest</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors p-2">
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

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
