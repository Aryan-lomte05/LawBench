'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, User, Menu, X } from 'lucide-react'

interface NavbarRightProps {
  user: any
  role?: string
}

export function NavbarRight({ user, role }: NavbarRightProps) {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (searchExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchExpanded])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchExpanded(false)
      setSearchQuery('')
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isAdmin = ['admin', 'editor'].includes(role || '')

  return (
    <div className="flex items-center gap-4 font-sans">
      {/* Search Input Expansion */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        {searchExpanded ? (
          <input
            ref={inputRef}
            type="text"
            placeholder="Search resources, cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => {
              if (!searchQuery) setSearchExpanded(false)
            }}
            className="w-[200px] md:w-[280px] bg-[#1C2029] border border-[#2A2E3A] text-[#F9F8F5] text-xs px-3 py-2 pl-9 rounded-[2px] focus:outline-none focus:border-[#B8975A] transition-all duration-300"
          />
        ) : (
          <button
            type="button"
            onClick={() => setSearchExpanded(true)}
            className="text-[#8A949E] hover:text-[#F9F8F5] transition-colors p-2"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
        {searchExpanded && (
          <Search className="w-4 h-4 text-[#8A949E] absolute left-3 pointer-events-none" />
        )}
      </form>

      {/* Desktop Navigation Elements */}
      <div className="hidden md:flex items-center gap-4">
        {/* Separator */}
        <div className="w-px h-4 bg-[#2A2E3A]" />

        {/* Auth Button */}
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <button className="text-[13px] font-medium text-[#F9F8F5] border border-[#2A2E3A] rounded-[2px] px-5 py-2 hover:border-[#B8975A] hover:text-[#B8975A] bg-transparent transition-colors">
                  Admin Panel
                </button>
              </Link>
            )}
            <Link href="/dashboard">
              <button className="text-[13px] font-medium text-[#F9F8F5] border border-[#2A2E3A] rounded-[2px] px-5 py-2 hover:border-[#B8975A] hover:text-[#B8975A] bg-transparent transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <Link href="/auth/login">
            <button className="text-[13px] font-medium text-[#F9F8F5] border border-[#2A2E3A] rounded-[2px] px-5 py-2 hover:border-[#B8975A] hover:text-[#B8975A] bg-transparent transition-colors">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Popover Controls */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2A2E3A] text-[#F9F8F5] hover:border-[#B8975A] hover:text-[#B8975A] transition-colors bg-transparent"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Popover Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 w-full bg-[#1C2029] border-b border-[#2A2E3A] flex flex-col p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-6">
            <Link 
              href="/subjects" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-widest text-[#F9F8F5] hover:text-[#B8975A]"
            >
              SUBJECTS
            </Link>
            <Link 
              href="/resources" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-widest text-[#F9F8F5] hover:text-[#B8975A]"
            >
              RESOURCES
            </Link>
            <Link 
              href="/latest" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-widest text-[#F9F8F5] hover:text-[#B8975A]"
            >
              LATEST
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-widest text-[#F9F8F5] hover:text-[#B8975A]"
            >
              BLOG
            </Link>
            
            <div className="w-full h-px bg-[#2A2E3A] my-2" />

            {user ? (
              <>
                {isAdmin && (
                  <Link 
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-mono uppercase tracking-widest text-[#B8975A] hover:text-[#B8975A]/85"
                  >
                    ADMIN PANEL
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-mono uppercase tracking-widest text-[#F9F8F5] hover:text-[#B8975A]"
                >
                  DASHBOARD
                </Link>
              </>
            ) : (
              <Link 
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-[#B8975A] hover:text-[#B8975A]/85"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
