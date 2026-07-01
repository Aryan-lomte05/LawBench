import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileText, Video, Bookmark, Presentation, Scale, BookOpen, Filter, Search } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Search | LawBench',
  description: 'Search for study materials, cases, and lectures.',
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const queryParam = resolvedParams.q as string || ''
  const typeParam = resolvedParams.type as string || ''
  
  const supabase = await createClient()
  
  let query = supabase
    .from('resources')
    .select('*, subjects(name)')
    .eq('is_published', true)
    
  if (queryParam) {
    // using textSearch on the search_vector we created in the schema
    // plainto_tsquery is safer for user input than to_tsquery
    query = query.textSearch('search_vector', queryParam, {
      type: 'plain',
      config: 'english'
    })
  }

  if (typeParam) {
    query = query.eq('type', typeParam)
  }
  
  const { data: resources } = await query.limit(50)

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Search Resources</h1>
        <form action="/search" method="GET" className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={queryParam}
            placeholder="Search for subjects, acts, case names..."
            className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
          {typeParam && <input type="hidden" name="type" value={typeParam} />}
          <Button type="submit" className="absolute right-2 rounded-full px-6">
            Search
          </Button>
        </form>
      </div>

      {queryParam && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-foreground">
            {resources?.length || 0} results for &quot;<span className="font-bold">{queryParam}</span>&quot;
          </h2>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-mono text-sm font-semibold tracking-wider uppercase text-foreground mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter by Type
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
                <Link 
                  href={`/search${queryParam ? `?q=${encodeURIComponent(queryParam)}` : ''}`} 
                  className={!typeParam ? 'font-medium text-primary' : 'hover:text-foreground'}
                >
                  All Types
                </Link>
                <Link 
                  href={`/search?type=note${queryParam ? `&q=${encodeURIComponent(queryParam)}` : ''}`} 
                  className={typeParam === 'note' ? 'font-medium text-primary' : 'hover:text-foreground'}
                >
                  Notes
                </Link>
                <Link 
                  href={`/search?type=bare_act${queryParam ? `&q=${encodeURIComponent(queryParam)}` : ''}`} 
                  className={typeParam === 'bare_act' ? 'font-medium text-primary' : 'hover:text-foreground'}
                >
                  Bare Acts
                </Link>
                <Link 
                  href={`/search?type=case_law${queryParam ? `&q=${encodeURIComponent(queryParam)}` : ''}`} 
                  className={typeParam === 'case_law' ? 'font-medium text-primary' : 'hover:text-foreground'}
                >
                  Case Laws
                </Link>
                <Link 
                  href={`/search?type=video${queryParam ? `&q=${encodeURIComponent(queryParam)}` : ''}`} 
                  className={typeParam === 'video' ? 'font-medium text-primary' : 'hover:text-foreground'}
                >
                  Videos
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Resources Grid */}
        <div className="flex-1">
          {!queryParam ? (
             <div className="text-center py-24 bg-card rounded-xl border border-border">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Start typing to search</h3>
              <p className="text-muted-foreground mt-2">Find what you need across all subjects and resources.</p>
            </div>
          ) : !resources || resources.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-xl border border-border">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No resources found</h3>
              <p className="text-muted-foreground mt-2 mb-6">We couldn't find any exact matches for that query.</p>
              <Link 
                href="/subjects" 
                className={buttonVariants({ variant: "outline" })}
              >
                Browse all subjects instead
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {resources.map((resource: any) => (
                <div key={resource.id} className="group relative flex flex-col p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-secondary/10 rounded-md group-hover:bg-primary/10 transition-colors">
                      {getTypeIcon(resource.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      <span>{resource.subjects?.name}</span>
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
