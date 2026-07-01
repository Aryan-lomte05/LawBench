import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Scale } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-[#14171F]">
      <div className="mb-6 p-4 rounded-full bg-[#B8975A]/10 border border-[#B8975A]/20 text-[#B8975A]">
        <Scale className="w-12 h-12" />
      </div>
      <h1 className="text-8xl font-heading font-extrabold text-[#F6F3EC] tracking-tighter mb-2">404</h1>
      <h2 className="text-2xl font-bold font-heading text-zinc-300 mb-4">Judgment Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
        The page you are looking for has either been moved, deleted, or does not exist in our library records.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/">
          <Button variant="default" className="bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold px-6 py-5">
            Return Home
          </Button>
        </Link>
        <Link href="/subjects">
          <Button variant="outline" className="border-zinc-700 text-[#F6F3EC] hover:bg-zinc-800 px-6 py-5 bg-transparent">
            Browse Subjects
          </Button>
        </Link>
      </div>
    </div>
  )
}
