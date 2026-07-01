import { createClient } from '@/utils/supabase/server'
import { ResourceUploadForm } from '@/components/admin/ResourceUploadForm'
import { notFound } from 'next/navigation'

export default async function AdminEditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch the resource details
  const { data: resource } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!resource) {
    notFound()
  }

  // Fetch subjects for select list
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Edit Resource</h1>
        <p className="text-muted-foreground mt-2">Modify details of an existing resource.</p>
      </div>

      <ResourceUploadForm subjects={subjects || []} initialResource={resource} />
    </div>
  )
}
