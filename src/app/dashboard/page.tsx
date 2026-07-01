import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Video, Bookmark, MessageSquare, Settings, PlayCircle } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { logout } from '@/app/auth/actions'

export const metadata = {
  title: 'Dashboard | LawBench',
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-muted-foreground mt-2">Manage your study library, track progress, and update your account.</p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">Sign Out</Button>
        </form>
      </div>

      <Tabs defaultValue="bookmarks" className="w-full">
        <TabsList className="grid grid-cols-4 md:inline-flex mb-8 bg-muted p-1 rounded-xl">
          <TabsTrigger value="bookmarks" className="py-2.5 flex items-center justify-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Bookmarks</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="py-2.5 flex items-center justify-center gap-2">
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">In Progress</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="py-2.5 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-2.5 flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bookmarks</CardTitle>
              <CardDescription>Resources you've saved for later study.</CardDescription>
            </CardHeader>
            <CardContent>
              {!bookmarks || bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">You haven't bookmarked any resources yet.</p>
                  <Link href="/resources" className={buttonVariants({ variant: "outline", className: "mt-4" })}>Browse Resources</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarks.map((bookmark: any) => (
                    <Link key={bookmark.id} href={`/resources/${bookmark.resources.id}`} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                      <div className="p-2 bg-secondary/10 rounded text-secondary group-hover:text-primary transition-colors">
                        {getTypeIcon(bookmark.resources.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{bookmark.resources.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{bookmark.resources.type.replace('_', ' ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Resume videos and lectures where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
              {!progressItems || progressItems.length === 0 ? (
                <div className="text-center py-12">
                  <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">No videos in progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressItems.map((item: any) => (
                    <Link key={item.id} href={`/resources/${item.resources.id}`} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded text-primary">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.resources.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">Stopped at {Math.floor(item.position_seconds / 60)}:{String(item.position_seconds % 60).padStart(2, '0')}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary">Resume →</span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Comments</CardTitle>
              <CardDescription>Your recent contributions to discussions.</CardDescription>
            </CardHeader>
            <CardContent>
              {!comments || comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">You haven't posted any comments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/resources/${comment.resource_id}`} className="text-sm font-medium text-primary hover:underline">
                          On: {comment.resources?.title || 'Resource'}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm profile={profile} userEmail={user.email} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
