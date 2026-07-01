import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Share2, ArrowLeft } from 'lucide-react'
import { Comments } from '@/components/resources/Comments' // We can reuse the comments component!
// Wait, the Comments component expects a resourceId. We might need a separate one or adapt it.
// The schema has `comments` tied to `resource_id`. For blog posts, we might need a `blog_comments` table
// Or I can just skip blog comments for now, as the spec says "toggle-able... On/Off per post".
// Let's implement basic share buttons and body rendering first.

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
    .select('*, profiles(full_name, avatar_url), blog_post_tags(blog_tags(name))')
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
    <article className="min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero / Cover */}
      {post.cover_image_url ? (
        <div className="w-full h-[40vh] md:h-[60vh] relative bg-muted">
          <img 
            src={post.cover_image_url} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-32 md:h-48 bg-muted" />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-[80ch]">
        <div className="bg-[#F6F3EC] text-[#14171F] p-8 md:p-12 rounded-2xl border border-zinc-200/80 shadow-2xl">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-[#B8975A] mb-6 transition-colors tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO BLOG
            </Link>
            
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B8975A] mb-4">
              {post.blog_post_tags?.map((pt: any) => (
                <span key={pt.blog_tags.name} className="bg-[#1F3A33] text-[#F6F3EC] px-2.5 py-1 rounded text-[10px] tracking-wider font-semibold">
                  {pt.blog_tags.name}
                </span>
              ))}
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-600">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-600">{calculateReadingTime(post.body || '')} MIN READ</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#14171F] leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-y border-zinc-200 py-4 mb-12">
              <div className="flex items-center gap-3">
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full border border-zinc-300" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1F3A33]/15 flex items-center justify-center text-xs font-mono text-[#1F3A33] font-bold">
                    LB
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-[#14171F]">{post.profiles?.full_name || 'LawBench Author'}</p>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Editor</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2 border-zinc-300 text-zinc-700 hover:bg-zinc-100 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="prose prose-stone max-w-none text-zinc-800 prose-headings:text-[#14171F] prose-headings:font-heading prose-a:text-[#B8975A] prose-strong:text-[#14171F] prose-blockquote:border-l-4 prose-blockquote:border-[#B8975A] prose-blockquote:text-zinc-600 prose-blockquote:italic">
            <ReactMarkdown>
              {post.body || '*No content.*'}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Comments Section (renders on dark backdrop) */}
        {post.comments_enabled && (
          <div className="mt-16 pt-8 border-t border-border/20 text-[#F6F3EC]">
            <h3 className="text-2xl font-heading font-bold mb-4">Discussion</h3>
            <p className="text-muted-foreground text-sm font-mono">COMMENTS ARE COMING SOON FOR THE BLOG.</p>
          </div>
        )}

        {/* More from the blog */}
        {morePosts && morePosts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-border">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-8">More from the blog</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {morePosts.map(mp => (
                <Link key={mp.slug} href={`/blog/${mp.slug}`} className="group block">
                  <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {mp.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-mono">
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
