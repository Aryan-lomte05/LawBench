import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { DeleteBlogPostButton } from '@/components/admin/DeleteBlogPostButton'

export const metadata = {
  title: 'Blog Management | Admin | LawBench',
}

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#14171F]">Blog Management</h1>
          <p className="text-[#5B6470] text-sm mt-2">Manage your blog posts here.</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary h-11 px-6 text-xs uppercase tracking-wider font-semibold flex items-center justify-center">
          New Post
        </Link>
      </div>

      <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD7C9] bg-[#EDE8DD] text-[11px] font-mono uppercase tracking-[0.06em] text-[#5B6470]">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7C9] text-[14px] text-[#14171F] font-sans">
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#8A949E]">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-[#F6F3EC] transition-colors">
                    <td className="p-4 font-semibold text-[#14171F]">{post.title}</td>
                    <td className="p-4 text-[#5B6470]">{post.profiles?.full_name || 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`text-[11px] font-mono uppercase tracking-[0.06em] ${
                        post.is_published ? 'text-[#1F3A33] font-semibold' : 'text-[#8A949E]'
                      }`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-[#5B6470]">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/blog/edit/${post.id}`} className="text-[13px] font-sans font-semibold text-[#B8975A] hover:underline">
                          Edit
                        </Link>
                        <DeleteBlogPostButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
