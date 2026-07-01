import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, PenTool, Trash2 } from 'lucide-react'

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
          <h1 className="text-3xl font-heading font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-2">Manage your blog posts here.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!posts || posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{post.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{post.profiles?.full_name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {/* For now, linking to edit but the edit page isn't explicitly built beyond standard new. 
                          It would be /admin/blog/[id]/edit which is similar to /new */}
                      <Button variant="ghost" size="icon" title="Edit" disabled>
                        <PenTool className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" disabled>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
