import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileText, Video, Bookmark, Presentation, Scale, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Latest Uploads | LawBench',
  description: 'View the most recently uploaded study resources and case laws.',
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4 text-primary" />
    case 'case_law':
    case 'judgment': return <Scale className="w-4 h-4 text-primary" />
    case 'presentation': return <Presentation className="w-4 h-4 text-primary" />
    case 'bare_act': return <BookOpen className="w-4 h-4 text-primary" />
    default: return <FileText className="w-4 h-4 text-primary" />
  }
}

export default async function LatestUploadsPage() {
  const supabase = await createClient()

  // Fetch the 10 most recent published resources
  const { data: resources, error } = await supabase
    .from('resources')
    .select('*, subjects(name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Latest Uploads</h1>
        <p className="text-lg text-muted-foreground">
          Stay up to date with the newest study materials, case summaries, and bare acts.
        </p>
      </div>

      {error ? (
        <div className="text-center py-12 text-destructive">Failed to load latest uploads.</div>
      ) : !resources || resources.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No recent uploads</h3>
          <p className="text-muted-foreground mt-2">Check back later for newly added legal resources.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {resources.map((resource: any) => (
            <div key={resource.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD] hover:border-[#B8975A] transition-colors duration-150 gap-4">
              <div className="flex items-start gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5 text-[11px] font-mono text-[#5B6470] uppercase tracking-[0.06em]">
                    <span className="inline-block text-[11px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2.5 py-0.5 rounded-[2px] mr-2">
                      {resource.type.replace('_', ' ')}
                    </span>
                    <span>{resource.subjects?.name}</span>
                    {resource.semester && (
                      <>
                        <span className="text-[#B8975A]">·</span>
                        <span>SEM {resource.semester.toLowerCase().replace(/semester/gi, '').trim()}</span>
                      </>
                    )}
                    {resource.unit && (
                      <>
                        <span className="text-[#B8975A]">·</span>
                        <span>UNIT {resource.unit.toLowerCase().replace(/unit/gi, '').split(':')[0].trim()}</span>
                      </>
                    )}
                    <span className="text-[#B8975A]">·</span>
                    <span className="text-[#8A949E]">{formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}</span>
                  </div>
                  <Link href={`/resources/${resource.id}`} className="focus:outline-none">
                    <h3 className="text-[19px] font-heading font-medium text-[#14171F] transition-colors">
                      {resource.title}
                    </h3>
                  </Link>
                  <p className="text-[14px] text-[#8A949E] mt-1 line-clamp-2 leading-relaxed">
                    {resource.description || 'No description provided.'}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#DDD7C9]/40">
                <Link href={`/resources/${resource.id}`}>
                  <button className="btn-secondary h-9 py-1 px-4 text-xs font-semibold border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
                    View Resource
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
