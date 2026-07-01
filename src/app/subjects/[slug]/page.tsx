import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, Video, Bookmark, Presentation, Scale, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  const { data: subject } = await supabase
    .from('subjects')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!subject) return { title: 'Not Found | LawBench' }

  return {
    title: `${subject.name} | LawBench`,
    description: subject.description || `Study resources for ${subject.name}`,
  }
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

export default async function SubjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!subject) {
    notFound()
  }

  // Fetch published resources for this subject
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Group by semester, then by unit
  // Default to 'General' if no semester/unit is specified
  const groupedResources = resources?.reduce((acc: any, resource: any) => {
    const sem = resource.semester || 'General'
    const unit = resource.unit || 'General'
    if (!acc[sem]) acc[sem] = {}
    if (!acc[sem][unit]) acc[sem][unit] = []
    acc[sem][unit].push(resource)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <Link href="/subjects" className="text-sm font-mono text-muted-foreground hover:text-foreground mb-4 inline-block">
          ← BACK TO SUBJECTS
        </Link>
        <h1 className="text-4xl font-heading font-bold text-foreground mt-2">{subject.name}</h1>
        {subject.description && (
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
            {subject.description}
          </p>
        )}
      </div>

      {!resources || resources.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No resources available</h3>
          <p className="text-muted-foreground mt-2">Check back later for notes, cases, and videos.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedResources || {}).map(([semester, units]: [string, any]) => (
            <div key={semester} className="space-y-8">
              <h2 className="text-2xl font-bold font-heading text-foreground border-b border-border pb-2">
                {semester}
              </h2>
              
              <div className="space-y-8 pl-4 border-l-2 border-border/50">
                {Object.entries(units).map(([unit, unitResources]: [string, any]) => (
                  <div key={unit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                      {unit}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                      {unitResources.map((resource: any) => (
                        <div key={resource.id} className="group relative flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                          <div className="mt-1 flex-shrink-0 p-2 bg-secondary/10 rounded-md group-hover:bg-primary/10 transition-colors">
                            {getTypeIcon(resource.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/resources/${resource.id}`} className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {resource.title}
                              </p>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                                {resource.type.replace('_', ' ')}
                              </span>
                              {resource.author_or_uploader && (
                                <span className="text-xs text-muted-foreground truncate">
                                  by {resource.author_or_uploader}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="relative z-10 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Bookmark">
                            <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
