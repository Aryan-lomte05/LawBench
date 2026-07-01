import { createClient } from '@/utils/supabase/server'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Fetch all contact messages
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#14171F]">Settings & Submissions</h1>
        <p className="text-[#5B6470] text-sm mt-2">Manage app parameters and view contact form logs.</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] p-8">
          <h2 className="text-[20px] font-heading font-semibold text-[#14171F] mb-1">Contact Form Submissions</h2>
          <p className="text-[13px] text-[#5B6470] mb-6">
            Read incoming feedback, bug reports, and inquiries from students.
          </p>
          
          <div className="space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((msg: any) => (
                <div key={msg.id} className="p-5 rounded-[4px] border border-[#DDD7C9] bg-[#F6F3EC] hover:border-[#B8975A] transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="font-semibold text-[#14171F]">{msg.name}</div>
                    <div className="text-[11px] text-[#B8975A] font-mono tracking-wider">{msg.email}</div>
                  </div>
                  <p className="text-[14px] text-[#5B6470] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-4 text-[11px] text-[#8A949E] font-mono uppercase tracking-wider">
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-[#8A949E] text-sm">
                No contact submissions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
