'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

interface CommentsProps {
  resourceId: string
  initialComments: Comment[]
  userId?: string
}

export function Comments({ resourceId, initialComments, userId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      toast.error('Please sign in to post a comment')
      router.push('/auth/login')
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          resource_id: resourceId,
          user_id: userId,
          content: newComment.trim()
        })
        .select(`
          id, content, created_at,
          profiles (full_name, avatar_url)
        `)
        .single()

      if (error) throw error

      setComments([data as any, ...comments])
      setNewComment('')
      toast.success('Comment posted')
      
    } catch (error: any) {
      toast.error('Failed to post comment: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-heading font-bold text-foreground">Discussion ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts or ask a question..."
          value={newComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-y"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 border border-border">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">
                    {comment.profiles?.full_name || 'Anonymous User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
