import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Blog | LawBench',
  description: 'Insights, study tips, and updates from the LawBench team.',
}

export default async function BlogIndexPage() {
  const supabase = await createClient()

  // Fetch posts from db without joining non-existent blog tags tables
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const featuredPost = posts && posts.length > 0 ? posts[0] : null
  const gridPosts = featuredPost && posts ? posts.slice(1) : []

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#14171F] py-16 font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 max-w-2xl text-left">
          <h1 className="text-[38px] md:text-[50px] font-heading font-semibold text-[#14171F] leading-tight mb-4">
            Blog & Insights
          </h1>
          <p className="text-[15px] text-[#5B6470] leading-relaxed">
            Editorial updates, constitutional analyses, and study columns from the LawBench editors.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-[#EDE8DD] rounded-[4px] border border-[#DDD7C9] p-8 max-w-xl mx-auto">
            <h3 className="text-[22px] font-heading font-normal italic text-[#5B6470]">No posts found</h3>
            <p className="text-[#8A949E] mt-2 text-[15px]">Check back later for fresh legal analyses and insights.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post (MasterClass editorial layout style) */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EDE8DD] rounded-[4px] overflow-hidden border border-[#DDD7C9] hover:border-[#B8975A] transition-colors duration-150">
                  <div className="lg:col-span-7 aspect-[16/10] bg-[#EDE8DD] overflow-hidden">
                    {featuredPost.cover_image_url ? (
                      <img 
                        src={featuredPost.cover_image_url} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1F3A33]/10 flex items-center justify-center">
                        <span className="font-heading text-2xl font-bold text-[#1F3A33]/25">LawBench</span>
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-5 p-8 lg:pr-12 flex flex-col justify-between h-full">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#5B6470] mb-4">
                        FEATURED COLUMN &middot; {formatDistanceToNow(new Date(featuredPost.published_at || featuredPost.created_at), { addSuffix: true })}
                      </div>
                      <h2 className="text-[26px] md:text-[32px] font-heading font-semibold text-[#14171F] leading-tight mb-4 group-hover:text-[#B8975A] transition-colors duration-150">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[14px] text-[#5B6470] leading-relaxed mb-6 line-clamp-4">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="text-[13px] text-[#5B6470] font-sans">
                      By {featuredPost.profiles?.full_name || 'LawBench Editor'}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Posts (Compact Cards matching Section 5.4 specifications) */}
            {gridPosts && gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                    <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] p-6 hover:border-[#B8975A] transition-colors duration-150 flex flex-col h-full justify-between">
                      <div>
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2.5 py-0.5 rounded-[2px]">
                            ANALYSIS
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[19px] font-heading font-semibold text-[#14171F] leading-snug mb-2 line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-[14px] text-[#5B6470] leading-relaxed mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Meta Row */}
                      <div className="flex items-center justify-between text-xs font-mono text-[#8A949E] uppercase tracking-wider pt-4 border-t border-[#DDD7C9]/60">
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                        <span>{post.profiles?.full_name?.split(' ')[0] || 'Editor'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
