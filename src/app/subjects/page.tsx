import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Subjects | LawBench',
  description: 'Browse all law subjects and modules',
}

export default async function SubjectsPage() {
  const supabase = await createClient()
  
  // In a real app we'd also aggregate resource counts here
  // using a view or complex query. For now we fetch subjects.
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    return <div className="container mx-auto py-12 text-center text-destructive">Failed to load subjects.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Subjects</h1>
        <p className="text-lg text-muted-foreground">
          Explore our comprehensive library of law subjects, organized by semester and unit.
        </p>
      </div>

      {subjects?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No subjects found</h3>
          <p className="text-muted-foreground mt-2">Subjects will appear here once they are added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.slug}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    {/* Placeholder for dynamic icon, using fallback */}
                    <BookOpen className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="line-clamp-1">{subject.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {subject.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
