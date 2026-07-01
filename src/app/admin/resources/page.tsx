import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { DeleteResourceButton } from '@/components/admin/DeleteResourceButton'

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  // Fetch all resources with subjects
  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, type, semester, unit, author_or_uploader, is_published, subjects(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#14171F]">Resources</h1>
          <p className="text-[#5B6470] text-sm mt-2">Manage notes, cases, acts, and videos.</p>
        </div>
        <Link href="/admin/resources/new" className="btn-primary h-11 px-6 text-xs uppercase tracking-wider font-semibold flex items-center justify-center">
          Upload Resource
        </Link>
      </div>

      <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD7C9] bg-[#EDE8DD] text-[11px] font-mono uppercase tracking-[0.06em] text-[#5B6470]">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Semester/Unit</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7C9] text-[14px] text-[#14171F] font-sans">
              {resources && resources.length > 0 ? (
                resources.map((res: any) => (
                  <tr key={res.id} className="hover:bg-[#F6F3EC] transition-colors">
                    <td className="p-4 font-medium max-w-xs truncate">{res.title}</td>
                    <td className="p-4 text-[#5B6470]">{res.subjects?.name || 'N/A'}</td>
                    <td className="p-4 text-xs font-mono uppercase tracking-wider">{res.type.replace('_', ' ')}</td>
                    <td className="p-4 text-xs font-mono uppercase">SEM {res.semester || 'N/A'} · UNIT {res.unit || 'N/A'}</td>
                    <td className="p-4 text-[#5B6470]">{res.author_or_uploader || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`text-[11px] font-mono uppercase tracking-[0.06em] ${
                        res.is_published ? 'text-[#1F3A33] font-semibold' : 'text-[#8A949E]'
                      }`}>
                        {res.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/resources/edit/${res.id}`} className="text-[13px] font-sans font-semibold text-[#B8975A] hover:underline">
                          Edit
                        </Link>
                        <DeleteResourceButton id={res.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8A949E] font-sans">
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
