import { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-[#F6F3EC] font-sans">
      {/* Left panel - Dark Cinematic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#14171F] border-r border-[#2A2E3A] flex-col justify-between p-16 text-[#F9F8F5]">
        <div>
          <Link href="/" className="font-heading text-sm font-extrabold tracking-[0.3em] text-[#F9F8F5] uppercase flex items-center gap-1.5 hover:text-[#B8975A] transition-colors">
            <span>LAWBENCH</span>
            <span className="text-[#B8975A] font-light">·</span>
          </Link>
        </div>

        <div className="max-w-[400px]">
          <h2 className="text-[40px] font-heading font-medium text-[#F9F8F5] leading-[1.1] tracking-tight mb-4">
            The library of a serious lawyer.
          </h2>
          <p className="text-[15px] text-[#8A949E] leading-relaxed">
            Gain structured access to legal syllabi, landmark court judgments, and curated study materials designed for academic excellence.
          </p>
        </div>

        <div className="text-xs text-[#8A949E] font-mono tracking-wider uppercase">
          © {new Date().getFullYear()} LAWBENCH.
        </div>
      </div>

      {/* Right panel - Form Container */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[380px] py-12">
          {children}
        </div>
      </div>
    </div>
  )
}
