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
    <div className="min-h-screen bg-[#F6F3EC] text-[#14171F] py-12 px-4 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header section */}
      <div className="max-w-[860px] mx-auto mb-10 text-left">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] font-mono text-[#5B6470] uppercase tracking-[0.06em]">
          <Link href="/subjects" className="hover:text-[#B8975A] transition-colors">LAW</Link>
          <span className="text-[#B8975A]">·</span>
          {resource.subjects && (
            <>
              <Link href={`/subjects/${resource.subjects.slug}`} className="hover:text-[#B8975A] transition-colors">
                {resource.subjects.name}
              </Link>
              <span className="text-[#B8975A]">·</span>
            </>
          )}
          {resource.semester && (
            <>
              <span>SEM {resource.semester.toLowerCase().replace(/semester/gi, '').trim()}</span>
              <span className="text-[#B8975A]">·</span>
            </>
          )}
          {resource.unit && (
            <span>UNIT {resource.unit.toLowerCase().replace(/unit/gi, '').trim()}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-[28px] md:text-[36px] lg:text-[44px] font-heading font-semibold text-[#14171F] leading-tight mb-4 max-w-[22ch]">
          {resource.title}
        </h1>

        {/* Meta row & Tags */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#5B6470] mb-6">
          <span>Added {new Date(resource.created_at).toLocaleDateString()}</span>
          <span>·</span>
          <span className="capitalize">{resource.type.replace('_', ' ')}</span>
          {resource.author_or_uploader && (
            <>
              <span>·</span>
              <span>Uploaded by {resource.author_or_uploader}</span>
            </>
          )}
        </div>

        {/* Action tags */}
        <div className="flex flex-wrap items-center gap-3">
          {resource.resource_tags?.map((rt: any, i: number) => (
            rt.tags?.name && (
              <span key={i} className="inline-block text-[11px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2.5 py-0.5 rounded-[2px]">
                #{rt.tags.name}
              </span>
            )
          ))}
          <div className="ml-auto flex items-center gap-2">
            <BookmarkButton 
              resourceId={resource.id} 
              initialIsBookmarked={isBookmarked} 
              userId={user?.id}
            />
          </div>
        </div>
      </div>

      <hr className="border-[#DDD7C9] max-w-[860px] mx-auto my-8" />

      {/* Two Column Layout */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Viewer */}
          <div className="bg-[#EDE8DD] rounded-[4px] border border-[#DDD7C9] overflow-hidden">
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
              <div className="p-12 text-center text-[#8A949E] font-mono uppercase text-xs tracking-wider">
                No content available to display.
              </div>
            )}
          </div>

          {/* Description */}
          {resource.description && (
            <div className="max-w-[68ch] prose prose-stone prose-headings:font-heading prose-headings:text-[#14171F] text-zinc-800">
              <h3 className="font-heading font-semibold text-[20px] mb-2 text-[#14171F]">Description</h3>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{resource.description}</p>
            </div>
          )}

          <hr className="border-[#DDD7C9]" />
          
          {/* Discussion Wrapper */}
          <div className="max-w-[700px]">
            <Comments 
              resourceId={resource.id} 
              initialComments={comments || []} 
              userId={user?.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#EDE8DD] rounded-[4px] border border-[#DDD7C9] p-6 sticky top-24">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#5B6470] mb-4">
              Related Resources
            </h3>
            {!related || related.length === 0 ? (
              <p className="text-[13px] text-[#8A949E] font-mono uppercase tracking-wider">No related resources found.</p>
            ) : (
              <div className="space-y-4">
                {related.slice(0, 3).map((item: any) => (
                  <Link key={item.id} href={`/resources/${item.id}`} className="group block p-4 rounded-[4px] border border-[#DDD7C9]/60 bg-[#F6F3EC] hover:border-[#B8975A] transition-colors duration-150">
                    <p className="text-[14px] font-medium text-[#14171F] group-hover:text-[#14171F] line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2 py-0.5 rounded-[2px] mt-2">
                      {item.type.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
