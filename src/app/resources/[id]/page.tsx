import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PdfViewer } from '@/components/resources/PdfViewerWrapper'
import { VideoPlayer } from '@/components/resources/VideoPlayer'
import { BookmarkButton } from '@/components/resources/BookmarkButton'
import { Comments } from '@/components/resources/Comments'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: resource } = await supabase
    .from('resources')
    .select('title, description')
    .eq('id', resolvedParams.id)
    .single()

  if (!resource) return { title: 'Not Found | LawBench' }

  return {
    title: `${resource.title} | LawBench`,
    description: resource.description || `Study resource on LawBench`,
  }
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Get current user to pass to client components
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch resource details
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*, subjects(name, slug), resource_tags(tags(name))')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !resource || (!resource.is_published && (!user || !(await supabase.from('profiles').select('role').eq('id', user.id).single()).data?.role?.includes('admin')))) {
    notFound()
  }

  // Check if bookmarked by current user
  let isBookmarked = false
  if (user) {
    const { count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('resource_id', resource.id)
    isBookmarked = (count || 0) > 0
  }

  // Fetch comments
  const { data: rawComments } = await supabase
    .from('comments')
    .select(`
      id, content, created_at,
      profiles (full_name, avatar_url)
    `)
    .eq('resource_id', resource.id)
    .order('created_at', { ascending: false })

  const comments = (rawComments || []).map((c: any) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    profiles: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
  }))

  // Fetch initial progress if it's a video
  let initialPosition = 0
  if (user && resource.type === 'video') {
    const { data: progress } = await supabase
      .from('progress')
      .select('position_seconds')
      .eq('user_id', user.id)
      .eq('resource_id', resource.id)
      .single()
      
    if (progress) {
      initialPosition = progress.position_seconds
    }
  }

  // Related resources (same subject, excluding this one)
  const { data: related } = await supabase
    .from('resources')
    .select('id, title, type')
    .eq('subject_id', resource.subject_id)
    .eq('is_published', true)
    .neq('id', resource.id)
    .limit(3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: resource.title,
    description: resource.description || `Study resource on LawBench`,
    learningResourceType: resource.type,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalLevel',
      educationalFramework: 'Law School Syllabus',
      targetName: `Semester ${resource.semester || 'N/A'}, Unit ${resource.unit || 'N/A'}`
    },
    author: resource.author_or_uploader ? {
      '@type': 'Person',
      name: resource.author_or_uploader
    } : undefined
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 mb-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Link href="/subjects" className="hover:text-foreground transition-colors">LAW</Link>
            <span className="text-[#B8975A]">·</span>
            {resource.subjects && (
              <>
                <Link href={`/subjects/${resource.subjects.slug}`} className="hover:text-foreground transition-colors">
                  {resource.subjects.name}
                </Link>
                <span className="text-[#B8975A]">·</span>
              </>
            )}
            {resource.semester && (
              <>
                <span>SEM {resource.semester}</span>
                <span className="text-[#B8975A]">·</span>
              </>
            )}
            {resource.unit && (
              <span>UNIT {resource.unit}</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {resource.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              {resource.type.replace('_', ' ')}
            </span>
            {resource.author_or_uploader && (
              <span className="text-muted-foreground">
                By {resource.author_or_uploader}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <BookmarkButton 
            resourceId={resource.id} 
            initialIsBookmarked={isBookmarked} 
            userId={user?.id}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Viewer */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {resource.type === 'video' && resource.video_url ? (
              <VideoPlayer 
                url={resource.video_url} 
                resourceId={resource.id} 
                userId={user?.id} 
                initialPosition={initialPosition} 
              />
            ) : resource.file_url ? (
              <PdfViewer url={resource.file_url} title={resource.title} />
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No content available to display.
              </div>
            )}
          </div>

          {resource.description && (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <h3 className="font-heading font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{resource.description}</p>
            </div>
          )}

          {/* Tags */}
          {resource.resource_tags && resource.resource_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {resource.resource_tags.map((rt: any, i: number) => (
                rt.tags?.name && (
                  <span key={i} className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                    #{rt.tags.name}
                  </span>
                )
              ))}
            </div>
          )}

          <hr className="border-border" />
          
          {/* Discussion */}
          <Comments 
            resourceId={resource.id} 
            initialComments={comments || []} 
            userId={user?.id}
          />
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
            <h3 className="font-heading font-semibold text-foreground mb-4">Related Resources</h3>
            {!related || related.length === 0 ? (
              <p className="text-sm text-muted-foreground">No related resources found.</p>
            ) : (
              <ul className="space-y-4">
                {related.map((item: any) => (
                  <li key={item.id}>
                    <Link href={`/resources/${item.id}`} className="group block">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2 transition-colors">
                        {item.title}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 capitalize inline-block">
                        {item.type.replace('_', ' ')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
