import { createClient } from '@/utils/supabase/server'
import { BlogEditor } from '@/components/admin/BlogEditor'
import { notFound } from 'next/navigation'

export default async function AdminEditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch the blog post details
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="w-full">
      <BlogEditor initialPost={post} />
    </div>
  )
}
