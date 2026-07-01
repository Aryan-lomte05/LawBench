import { createClient } from '@/utils/supabase/server'
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
    <div className="space-y-12">
      <div>
        <h1 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#14171F]">Overview</h1>
        <p className="text-[#5B6470] text-sm mt-2">Manage your platform content and user library roles.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD]">
          <div className="text-[32px] font-heading font-semibold text-[#14171F]">
            {usersCount || 0}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5B6470] mt-1">
            Total Users
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD]">
          <div className="text-[32px] font-heading font-semibold text-[#14171F]">
            {resourcesCount || 0}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5B6470] mt-1">
            Resources
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD]">
          <div className="text-[32px] font-heading font-semibold text-[#14171F]">
            {subjectsCount || 0}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5B6470] mt-1">
            Subjects
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-6 rounded-[4px] border border-[#DDD7C9] bg-[#EDE8DD]">
          <div className="text-[32px] font-heading font-semibold text-[#14171F]">
            {blogCount || 0}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#5B6470] mt-1">
            Blog Posts
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-xl">
        <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] p-8">
          <h3 className="font-heading font-semibold text-[20px] text-[#14171F] mb-6">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <Link href="/admin/resources/new" className="block p-4 rounded-[4px] border border-[#DDD7C9] bg-[#F6F3EC] hover:border-[#B8975A] transition-colors">
              <div className="font-heading font-semibold text-[16px] text-[#14171F]">Upload Resource</div>
              <div className="text-[13px] text-[#5B6470] font-sans mt-1">Add new notes, cases, or videos.</div>
            </Link>
            <Link href="/admin/blog/new" className="block p-4 rounded-[4px] border border-[#DDD7C9] bg-[#F6F3EC] hover:border-[#B8975A] transition-colors">
              <div className="font-heading font-semibold text-[16px] text-[#14171F]">Write Blog Post</div>
              <div className="text-[13px] text-[#5B6470] font-sans mt-1">Publish a new article to the blog.</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
