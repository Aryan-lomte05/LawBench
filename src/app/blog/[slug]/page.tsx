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

  return (
    <article className="min-h-screen pb-16">
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
      <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-[75ch]">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO BLOG
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-4">
            {post.blog_post_tags?.map((pt: any) => (
              <span key={pt.blog_tags.name} className="bg-primary/10 px-2 py-1 rounded">
                {pt.blog_tags.name}
              </span>
            ))}
            <span>•</span>
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{calculateReadingTime(post.body || '')} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-border py-4 mb-12">
            <div className="flex items-center gap-3">
              {post.profiles?.avatar_url ? (
                <img src={post.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary/20" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{post.profiles?.full_name || 'LawBench Author'}</p>
                <p className="text-xs text-muted-foreground">Editor</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl w-full max-w-none">
          <ReactMarkdown>
            {post.body || '*No content.*'}
          </ReactMarkdown>
        </div>
        
        {/* Comments Section Placeholder (since we didn't add blog_comments to schema yet) */}
        {post.comments_enabled && (
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Discussion</h3>
            <p className="text-muted-foreground">Comments are coming soon for the blog.</p>
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
