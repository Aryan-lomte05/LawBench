import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Blog | LawBench',
  description: 'Insights, study tips, and updates from the LawBench team.',
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const tagParam = resolvedParams.tag as string || ''
  
  const supabase = await createClient()

  // First, get all tags to show the filter list
  const { data: allTags } = await supabase.from('blog_tags').select('name').order('name')

  // Build query for posts
  let query = supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url), blog_post_tags(blog_tags(name))')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (tagParam) {
    // We need to filter by tag. The easiest way is to fetch posts that have this tag.
    // In a real app with large data, a custom SQL function or view might be better.
    // For now we just filter on the application level if Supabase JS doesn't easily support many-to-many filtering.
    // Wait, Supabase supports filtering on joined tables:
    query = query.eq('blog_post_tags.blog_tags.name', tagParam)
  }

  const { data: posts, error } = await query

  // Client-side filtering if Supabase join filtering didn't work as expected
  const filteredPosts = tagParam && posts 
    ? posts.filter((post: any) => 
        post.blog_post_tags?.some((pt: any) => pt.blog_tags?.name === tagParam)
      )
    : posts

  const featuredPost = !tagParam && filteredPosts && filteredPosts.length > 0 ? filteredPosts[0] : null
  const gridPosts = featuredPost ? (filteredPosts ?? []).slice(1) : (filteredPosts ?? [])

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="mb-12 max-w-2xl text-center mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights, study strategies, and legal updates to keep you ahead.
        </p>
      </div>

      {/* Tags Filter */}
      {allTags && allTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <Link 
            href="/blog" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !tagParam ? 'bg-foreground text-background' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
            }`}
          >
            All
          </Link>
          {allTags.map(t => (
            <Link 
              key={t.name}
              href={`/blog?tag=${encodeURIComponent(t.name)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tagParam === t.name ? 'bg-foreground text-background' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}

      {!filteredPosts || filteredPosts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] md:aspect-auto md:h-full bg-muted overflow-hidden">
                  {featuredPost.cover_image_url ? (
                    <img 
                      src={featuredPost.cover_image_url} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                      <span className="font-heading text-4xl font-bold text-secondary/30">LawBench</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-4">
                    <span>Featured</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(featuredPost.published_at || featuredPost.created_at), { addSuffix: true })}</span>
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    {featuredPost.profiles?.avatar_url ? (
                      <img src={featuredPost.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary/20" />
                    )}
                    <span className="text-sm font-medium text-foreground">{featuredPost.profiles?.full_name || 'Author'}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid Posts */}
          {gridPosts && gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                  <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden mb-4 border border-border">
                    {post.cover_image_url ? (
                      <img 
                        src={post.cover_image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                        <span className="font-heading text-xl font-bold text-secondary/20">LawBench</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                    {post.blog_post_tags?.[0]?.blog_tags?.name && (
                      <span className="text-secondary">{post.blog_post_tags[0].blog_tags.name}</span>
                    )}
                    {post.blog_post_tags?.[0]?.blog_tags?.name && <span>•</span>}
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-secondary/20" />
                    )}
                    <span className="text-xs font-medium text-foreground">{post.profiles?.full_name || 'Author'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
