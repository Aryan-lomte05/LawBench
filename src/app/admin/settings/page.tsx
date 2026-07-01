import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Fetch all contact messages
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings & Submissions</h1>
        <p className="text-muted-foreground mt-2">Manage app parameters and view contact form logs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Form Submissions</CardTitle>
            <CardDescription>
              Read incoming feedback, bug reports, and inquiries from students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages && messages.length > 0 ? (
                messages.map((msg: any) => (
                  <div key={msg.id} className="p-4 rounded-lg border border-border bg-card hover:bg-muted/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="font-semibold text-foreground">{msg.name}</div>
                      <div className="text-xs text-[#B8975A] font-mono">{msg.email}</div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="mt-3 text-xs text-muted-foreground font-mono">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No contact submissions found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
