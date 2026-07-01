import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileText, Video, Bookmark, Presentation, Scale, BookOpen, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Resources | LawBench',
  description: 'Browse all study materials, cases, and lectures.',
}

// Helper to get icon by type
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

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient()
  
  // Build query based on filters
  let query = supabase
    .from('resources')
    .select('*, subjects(name)')
    .eq('is_published', true)
    
  if (resolvedParams.type) {
    query = query.eq('type', resolvedParams.type)
  }
  if (resolvedParams.subject) {
    query = query.eq('subject_id', resolvedParams.subject)
  }
  
  // Sort by newest
  query = query.order('created_at', { ascending: false })
  
  const { data: resources } = await query

  const { data: subjects } = await supabase.from('subjects').select('id, name').order('name')

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold text-foreground">Resources</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse our complete collection of legal study materials.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-mono text-sm font-semibold tracking-wider uppercase text-foreground mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Resource Type</h4>
                <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                  <Link href="/resources" className={!resolvedParams.type ? 'font-medium text-primary' : 'hover:text-foreground'}>All Types</Link>
                  <Link href="/resources?type=note" className={resolvedParams.type === 'note' ? 'font-medium text-primary' : 'hover:text-foreground'}>Notes</Link>
                  <Link href="/resources?type=bare_act" className={resolvedParams.type === 'bare_act' ? 'font-medium text-primary' : 'hover:text-foreground'}>Bare Acts</Link>
                  <Link href="/resources?type=case_law" className={resolvedParams.type === 'case_law' ? 'font-medium text-primary' : 'hover:text-foreground'}>Case Laws</Link>
                  <Link href="/resources?type=video" className={resolvedParams.type === 'video' ? 'font-medium text-primary' : 'hover:text-foreground'}>Videos</Link>
                </div>
              </div>

              {subjects && subjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Subject</h4>
                  <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                    <Link href="/resources" className={!resolvedParams.subject ? 'font-medium text-primary' : 'hover:text-foreground'}>All Subjects</Link>
                    {subjects.map(sub => (
                      <Link 
                        key={sub.id} 
                        href={`/resources?subject=${sub.id}${resolvedParams.type ? `&type=${resolvedParams.type}` : ''}`}
                        className={resolvedParams.subject === sub.id ? 'font-medium text-primary' : 'hover:text-foreground'}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Resources Grid */}
        <div className="flex-1">
          {!resources || resources.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-xl border border-border">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No resources found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {resources.map((resource: any) => (
                <div key={resource.id} className="group relative flex flex-col p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-secondary/10 rounded-md group-hover:bg-primary/10 transition-colors">
                      {getTypeIcon(resource.type)}
                    </div>
                    <Button variant="ghost" size="icon" className="relative z-10 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
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
                    </div>
                    
                    <Link href={`/resources/${resource.id}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                    </Link>
                    
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center rounded-full bg-secondary/5 px-2 py-1 font-medium text-secondary">
                      {resource.type.replace('_', ' ')}
                    </span>
                    {resource.author_or_uploader && (
                      <span className="truncate max-w-[120px]">
                        by {resource.author_or_uploader}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
