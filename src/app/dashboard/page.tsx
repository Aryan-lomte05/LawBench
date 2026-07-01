import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bookmark, MessageSquare, Settings, PlayCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { logout } from '@/app/auth/actions'

export const metadata = {
  title: 'Dashboard | LawBench',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_approved) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] text-[#14171F] py-16 px-4 flex items-center justify-center font-sans">
        <div className="text-center py-20 max-w-xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-[28px] md:text-[34px] font-heading font-semibold text-[#14171F] mb-4 leading-tight">
            Account Pending Review
          </h1>
          <p className="text-[20px] font-heading font-normal italic text-[#5B6470] mb-4">
            An administrator will verify your access shortly.
          </p>
          <p className="text-[#8A949E] text-[15px] mb-8 leading-relaxed max-w-[42ch]">
            To ensure the integrity of academic materials, all new accounts are verified manually. Thank you for your patience.
          </p>
          <form action={logout}>
            <button type="submit" className="btn-secondary h-10 px-5 text-xs font-semibold uppercase tracking-wider border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, resources(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch progress
  const { data: progressItems } = await supabase
    .from('progress')
    .select('*, resources(*)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, resources(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#14171F] py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#DDD7C9]">
          <div>
            <h1 className="text-[32px] font-heading font-semibold text-[#14171F]">
              Your Library
            </h1>
            <p className="text-[15px] text-[#5B6470] mt-2 leading-relaxed">
              Manage your study library, track progress, and update your account.
            </p>
          </div>
          <form action={logout}>
            <button type="submit" className="btn-secondary h-10 px-5 text-xs font-semibold uppercase tracking-wider border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
              Sign Out
            </button>
          </form>
        </div>

        <Tabs defaultValue="bookmarks" className="w-full">
          <TabsList variant="line" className="flex border-b border-[#DDD7C9] bg-transparent p-0 gap-8 rounded-none w-full justify-start mb-8">
            <TabsTrigger 
              value="bookmarks" 
              className="rounded-none bg-transparent shadow-none border-b-2 border-x-0 border-t-0 border-transparent data-active:!border-b-[#B8975A] data-active:!border-x-transparent data-active:!border-t-transparent data-active:!bg-transparent data-active:!text-[#14171F] text-[#8A949E] hover:!text-[#14171F] px-0 pb-3 text-xs font-mono uppercase tracking-[0.12em] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              Bookmarks
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="rounded-none bg-transparent shadow-none border-b-2 border-x-0 border-t-0 border-transparent data-active:!border-b-[#B8975A] data-active:!border-x-transparent data-active:!border-t-transparent data-active:!bg-transparent data-active:!text-[#14171F] text-[#8A949E] hover:!text-[#14171F] px-0 pb-3 text-xs font-mono uppercase tracking-[0.12em] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="rounded-none bg-transparent shadow-none border-b-2 border-x-0 border-t-0 border-transparent data-active:!border-b-[#B8975A] data-active:!border-x-transparent data-active:!border-t-transparent data-active:!bg-transparent data-active:!text-[#14171F] text-[#8A949E] hover:!text-[#14171F] px-0 pb-3 text-xs font-mono uppercase tracking-[0.12em] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-none bg-transparent shadow-none border-b-2 border-x-0 border-t-0 border-transparent data-active:!border-b-[#B8975A] data-active:!border-x-transparent data-active:!border-t-transparent data-active:!bg-transparent data-active:!text-[#14171F] text-[#8A949E] hover:!text-[#14171F] px-0 pb-3 text-xs font-mono uppercase tracking-[0.12em] font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              Settings
            </TabsTrigger>
          </TabsList>
 
          <TabsContent value="bookmarks" className="space-y-6 focus:outline-none">
            {!bookmarks || bookmarks.length === 0 ? (
              <div className="text-center py-16 max-w-xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-[22px] font-heading font-normal italic text-[#5B6470] mb-2">You haven't bookmarked any resources yet</h3>
                <p className="text-[#8A949E] text-[15px] mb-6">Explore the catalog to save notes, judgments, or lectures.</p>
                <Link href="/resources" className="btn-secondary h-10 px-5 text-xs font-semibold uppercase tracking-wider border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
                  Browse Resources
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarks.map((bookmark: any) => (
                  <div key={bookmark.id} className="group relative flex flex-col p-5 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD] hover:border-[#B8975A] transition-colors duration-150 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-block text-[11px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2.5 py-0.5 rounded-[2px]">
                        {bookmark.resources.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Link href={`/resources/${bookmark.resources.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <h3 className="text-[18px] font-heading font-medium text-[#14171F] line-clamp-2 leading-snug">
                          {bookmark.resources.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
 
          <TabsContent value="progress" className="space-y-6 focus:outline-none">
            {!progressItems || progressItems.length === 0 ? (
              <div className="text-center py-16 max-w-xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-[22px] font-heading font-normal italic text-[#5B6470] mb-2">No lectures in progress</h3>
                <p className="text-[#8A949E] text-[15px] mb-6">Resume video lectures here once you start studying.</p>
                <Link href="/resources" className="btn-secondary h-10 px-5 text-xs font-semibold uppercase tracking-wider border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
                  Browse Resources
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progressItems.map((item: any) => (
                  <div key={item.id} className="group relative flex flex-col p-5 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD] hover:border-[#B8975A] transition-colors duration-150 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-block text-[11px] font-mono uppercase tracking-[0.06em] text-[#F9F8F5] bg-[#1F3A33] px-2.5 py-0.5 rounded-[2px]">
                        {item.resources.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Link href={`/resources/${item.resources.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <h3 className="text-[18px] font-heading font-medium text-[#14171F] line-clamp-2 leading-snug">
                          {item.resources.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#8A949E] mt-3 font-mono">
                        STOPPED AT {Math.floor(item.position_seconds / 60)}:{String(item.position_seconds % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
 
          <TabsContent value="comments" className="space-y-6 focus:outline-none">
            {!comments || comments.length === 0 ? (
              <div className="text-center py-16 max-w-xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-[22px] font-heading font-normal italic text-[#5B6470] mb-2">No comment contributions</h3>
                <p className="text-[#8A949E] text-[15px] mb-6">Comments you publish on study resources will appear here.</p>
                <Link href="/resources" className="btn-secondary h-10 px-5 text-xs font-semibold uppercase tracking-wider border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A] bg-transparent">
                  Browse Resources
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD]">
                    <div className="flex items-center justify-between mb-3">
                      <Link href={`/resources/${comment.resource_id}`} className="text-[14px] font-heading font-semibold text-[#B8975A] hover:underline">
                        On: {comment.resources?.title || 'Resource'}
                      </Link>
                      <span className="text-xs font-mono text-[#8A949E]">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[14px] font-sans text-[#14171F] whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
 
          <TabsContent value="settings" className="focus:outline-none">
            <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] p-8 max-w-2xl">
              <SettingsForm profile={profile} userEmail={user.email} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
