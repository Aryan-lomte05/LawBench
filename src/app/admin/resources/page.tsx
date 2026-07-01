import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DeleteResourceButton } from '@/components/admin/DeleteResourceButton'

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  // Fetch all resources with subjects
  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, type, semester, unit, author_or_uploader, is_published, subjects(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-2">Manage notes, cases, acts, and videos.</p>
        </div>
        <Link href="/admin/resources/new">
          <Button className="bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold">
            <Plus className="w-4 h-4 mr-2" /> Upload Resource
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Semester/Unit</th>
                <th className="p-4 font-medium">Author</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm text-foreground">
              {resources && resources.length > 0 ? (
                resources.map((res: any) => (
                  <tr key={res.id} className="hover:bg-muted/10">
                    <td className="p-4 font-medium max-w-xs truncate">{res.title}</td>
                    <td className="p-4 text-muted-foreground">{res.subjects?.name || 'N/A'}</td>
                    <td className="p-4 uppercase text-xs font-mono tracking-wider">{res.type.replace('_', ' ')}</td>
                    <td className="p-4 text-xs font-mono">SEM {res.semester || 'N/A'} · UNIT {res.unit || 'N/A'}</td>
                    <td className="p-4 text-muted-foreground">{res.author_or_uploader || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        res.is_published ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {res.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DeleteResourceButton id={res.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No resources found. Upload one to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
