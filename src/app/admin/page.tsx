import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, BookOpen, PenTool } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [
    { count: usersCount },
    { count: resourcesCount },
    { count: subjectsCount },
    { count: blogCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true })
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-2">Manage your platform content and users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usersCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resources</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resourcesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subjects</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subjectsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blog Posts</CardTitle>
            <PenTool className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/resources/new" className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="font-medium">Upload Resource</div>
              <div className="text-sm text-muted-foreground">Add new notes, cases, or videos.</div>
            </Link>
            <Link href="/admin/blog/new" className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="font-medium">Write Blog Post</div>
              <div className="text-sm text-muted-foreground">Publish a new article to the blog.</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
