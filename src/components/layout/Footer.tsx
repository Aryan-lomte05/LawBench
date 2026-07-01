import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-heading text-sm font-extrabold tracking-[0.3em] text-[#F6F3EC] uppercase flex items-center gap-1.5 transition-colors hover:text-[#B8975A]">
            <span>LAWBENCH</span>
            <span className="text-[#B8975A] font-light">·</span>
          </Link>
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-[#A1A8B4]/85 leading-relaxed max-w-sm">
            Premium learning platform for law students. Structured, comprehensive, and focused on clarity.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground mb-4 font-mono text-sm tracking-wider uppercase">Navigation</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link></li>
            <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground mb-4 font-mono text-sm tracking-wider uppercase">Legal</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} LawBench. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built for LawBench</p>
      </div>
    </footer>
  )
}
