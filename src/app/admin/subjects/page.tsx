import { createClient } from '@/utils/supabase/server'
import { SubjectsManager } from '@/components/admin/SubjectsManager'

export default async function AdminSubjectsPage() {
  const supabase = await createClient()

  // Fetch subjects ordered by order index and name
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, slug, description, icon_name, order_index')
    .order('order_index', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Subjects</h1>
        <p className="text-muted-foreground mt-2">Manage course modules and tags.</p>
      </div>

      <SubjectsManager initialSubjects={subjects || []} />
    </div>
  )
}
