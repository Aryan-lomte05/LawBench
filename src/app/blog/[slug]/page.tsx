import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Share2, ArrowLeft } from 'lucide-react'
import { CommentsWithVotes } from '@/components/resources/CommentsWithVotes'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image_url')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Not Found | LawBench' }

  return {
    title: `${post.title} | LawBench Blog`,
    description: post.excerpt || `Read ${post.title} on LawBench`,
    openGraph: post.cover_image_url ? { images: [post.cover_image_url] } : undefined,
  }
}

// Simple estimated reading time calculation
function calculateReadingTime(text: string) {
  const wordsPerMinute = 200
  const noOfWords = text.split(/\s/g).length
  const minutes = noOfWords / wordsPerMinute
  return Math.ceil(minutes)
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post || (!post.is_published && (!user || !(await supabase.from('profiles').select('role').eq('id', user.id).single()).data?.role?.includes('admin')))) {
    notFound()
  }

  // Fetch more posts for the bottom rail
  const { data: morePosts } = await supabase
    .from('blog_posts')
    .select('title, slug, created_at')
    .eq('is_published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const authorProfile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
  const authorName = authorProfile?.full_name || 'Editor'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || `Read ${post.title} on LawBench`,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: authorName
    }
  }

  return (
    <article className="min-h-screen bg-[#F6F3EC] text-[#14171F] font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="w-full h-[280px] md:h-[480px] relative bg-[#EDE8DD]">
          <img 
            src={post.cover_image_url} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content wrapper */}
      <div className="max-w-[740px] mx-auto px-6 py-14">
        {/* Back Link */}
        <Link href="/blog" className="inline-block text-[11px] font-mono text-[#5B6470] hover:text-[#B8975A] mb-8 transition-colors uppercase tracking-[0.06em]">
          ← Back to Blog
        </Link>
        
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.08em] text-[#5B6470] mb-4">
          <span>
            {post.blog_post_tags?.[0]?.blog_tags?.name || 'EDITORIAL'}
          </span>
          <span className="text-[#B8975A]">·</span>
          <span>{calculateReadingTime(post.body || '')} MIN READ</span>
          <span className="text-[#B8975A]">·</span>
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-heading font-bold text-[#14171F] leading-[1.1] tracking-[-0.02em] mb-6">
          {post.title}
        </h1>

        {/* Byline & Share */}
        <div className="flex items-center justify-between py-5 border-y border-[#DDD7C9] mb-10 text-[14px]">
          <span className="text-[#5B6470]">
            By {authorName}
          </span>
          <button className="text-[13px] font-mono uppercase tracking-wider text-[#B8975A] hover:underline bg-transparent border-none">
            Share Post
          </button>
        </div>

        {/* Content Prose */}
        <div className="max-w-[68ch] text-[17px] text-[#14171F] leading-[1.75] font-sans">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-[26px] font-heading font-semibold text-[#14171F] mt-12 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-[21px] font-heading font-medium text-[#14171F] mt-9 mb-3" {...props} />,
              p: ({node, children, ...props}) => {
                // If it's the very first paragraph, it's the lead paragraph (20px)
                return (
                  <p className="mb-6 leading-relaxed last:mb-0" {...props}>
                    {children}
                  </p>
                )
              },
              blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-[#B8975A] pl-6 font-heading font-normal italic text-[20px] text-[#5B6470] my-10" {...props} />,
              code: ({node, inline, className, children, ...props} : any) => {
                return (
                  <code className="font-mono text-[12px] text-[#1F3A33] bg-[#EDE8DD] px-1.5 py-0.5 rounded-[2px] font-semibold" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {post.body || '*No content.*'}
          </ReactMarkdown>
        </div>

        {/* Comments Section */}
        {post.comments_enabled && (
          <div className="mt-16 pt-8 border-t border-[#DDD7C9]">
            <CommentsWithVotes 
              targetId={post.id} 
              targetType="blog" 
              currentUserId={user?.id}
              currentUserRole={user ? (await supabase.from('profiles').select('role').eq('id', user.id).single()).data?.role : undefined}
            />
          </div>
        )}

        {/* More from the blog */}
        {morePosts && morePosts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#DDD7C9]">
            <h3 className="text-[22px] font-heading font-semibold text-[#14171F] mb-8">More from the blog</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {morePosts.map(mp => (
                <Link key={mp.slug} href={`/blog/${mp.slug}`} className="group block">
                  <h4 className="font-heading font-semibold text-[#14171F] group-hover:text-[#B8975A] transition-colors line-clamp-2 mb-2 leading-snug">
                    {mp.title}
                  </h4>
                  <p className="text-xs font-mono text-[#8A949E] uppercase tracking-wider">
                    {formatDistanceToNow(new Date(mp.created_at), { addSuffix: true })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
