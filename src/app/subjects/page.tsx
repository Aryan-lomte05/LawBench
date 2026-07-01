import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Subjects | LawBench',
  description: 'Browse all law subjects and modules',
}

export default async function SubjectsPage() {
  const supabase = await createClient()
  
  // Fetch subjects with resource counts
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*, resources(id)')
    .order('order_index', { ascending: true })

  if (error) {
    console.error("Supabase error loading subjects:", error)
    return (
      <div className="min-h-screen bg-[#14171F] text-[#F9F8F5] flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-[#C0392B] mb-2">Error</p>
          <p className="text-sm font-medium">Failed to load subjects library.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#14171F] text-[#F9F8F5] py-16 font-sans border-b border-[#2A2E3A]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-2xl mb-16 text-left">
          <h1 className="text-[38px] md:text-[50px] font-heading font-semibold text-[#F9F8F5] leading-tight mb-4">
            Subjects Library
          </h1>
          <p className="text-[15px] text-[#8A949E] leading-relaxed">
            Explore our comprehensive curriculum catalog, structured by semesters and academic modules.
          </p>
        </div>

        {subjects?.length === 0 ? (
          <div className="text-center py-24 bg-[#1C2029] rounded-[4px] border border-[#2A2E3A]">
            <BookOpen className="w-12 h-12 mx-auto text-[#8A949E] mb-4 opacity-50" />
            <h3 className="text-[22px] font-heading font-semibold text-[#F9F8F5]">No subjects found</h3>
            <p className="text-[#8A949E] mt-2 text-sm">Modules will appear here once they are added by the dean.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map((subject) => {
              const count = subject.resources?.length || 0
              return (
                <Link key={subject.id} href={`/subjects/${subject.slug}`} className="group block">
                  <div className="bg-[#1C2029] border border-[#2A2E3A] rounded-[4px] p-7 flex flex-col hover:bg-[#14171F] hover:border-[#B8975A] transition-all duration-150 h-full">
                    {/* Icon */}
                    <div className="text-[#B8975A]">
                      <BookOpen className="w-8 h-8" />
                    </div>

                    {/* Subject name */}
                    <h3 className="text-[22px] font-heading font-semibold text-[#F9F8F5] mt-4 leading-snug group-hover:text-[#B8975A] transition-colors">
                      {subject.name}
                    </h3>

                    {/* Resource count */}
                    <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#8A949E] mt-2 block">
                      {count} {count === 1 ? 'Resource' : 'Resources'}
                    </span>

                    {/* Description */}
                    {subject.description && (
                      <p className="text-[13px] text-[#8A949E] mt-4 line-clamp-3 leading-relaxed">
                        {subject.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
