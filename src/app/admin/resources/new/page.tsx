import { createClient } from '@/utils/supabase/server'
import { ResourceUploadForm } from '@/components/admin/ResourceUploadForm'

export default async function AdminNewResourcePage() {
  const supabase = await createClient()

  // Fetch subjects for select list
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Upload Resource</h1>
        <p className="text-muted-foreground mt-2">Create a new lecture video, note, or bare act.</p>
      </div>

      <ResourceUploadForm subjects={subjects || []} />
    </div>
  )
}
