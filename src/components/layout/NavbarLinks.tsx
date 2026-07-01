'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavbarLinks() {
  const pathname = usePathname()

  const links = [
    { label: 'Subjects', href: '/subjects' },
    { label: 'Resources', href: '/resources' },
    { label: 'Latest', href: '/latest' },
    { label: 'Blog', href: '/blog' }
  ]

  return (
    <div className="hidden md:flex gap-6 text-sm font-medium items-center font-sans">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`relative py-1 transition-colors text-[14px] ${
              isActive ? 'text-[#B8975A]' : 'text-[#8A949E] hover:text-[#F9F8F5]'
            }`}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#B8975A]" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
