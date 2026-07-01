'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ArrowBigUp, ArrowBigDown, MessageSquare, CornerDownRight, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Vote {
  vote_type: number
  user_id: string
}

interface Profile {
  full_name: string | null
  avatar_url: string | null
}

interface Comment {
  id: string
  content: string
  created_at: string
  parent_id: string | null
  user_id: string
  profiles: Profile | null
  comment_votes?: Vote[]
}

interface CommentsWithVotesProps {
  targetId: string // resource_id or blog_post_id
  targetType: 'resource' | 'blog'
  currentUserId?: string
  currentUserRole?: string
}

export function CommentsWithVotes({ targetId, targetType, currentUserId, currentUserRole }: CommentsWithVotesProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [targetId])

  const fetchComments = async () => {
    setLoading(true)
    setDbError(null)
    try {
      const selectFields = `
        id, parent_id, content, created_at, user_id,
        profiles (full_name, avatar_url),
        comment_votes (vote_type, user_id)
      `
      
      let query = supabase
        .from('comments')
        .select(selectFields)

      if (targetType === 'resource') {
        query = query.eq('resource_id', targetId)
      } else {
        query = query.eq('blog_post_id', targetId)
      }

      const { data, error } = await query.order('created_at', { ascending: true })

      if (error) {
        const msg = error.message || ''
        if (msg.includes('relation') || msg.includes('does not exist') || msg.includes('column') || msg.includes('schema cache') || error.code === '42P01' || error.code === '42703') {
          setDbError('DATABASE_UPGRADE_PENDING')
        } else {
          throw error
        }
      } else {
        const formatted = (data || []).map((c: any) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          parent_id: c.parent_id,
          user_id: c.user_id,
          profiles: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
          comment_votes: c.comment_votes || []
        }))
        setComments(formatted)
      }
    } catch (err: any) {
      const errMsg = err?.message || ''
      if (errMsg.includes('relation') || errMsg.includes('does not exist') || errMsg.includes('column') || errMsg.includes('schema cache')) {
        setDbError('DATABASE_UPGRADE_PENDING')
      } else {
        console.error('Error fetching comments:', err?.message || err)
        toast.error('Could not load discussion logs.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePostComment = async (parentId: string | null = null) => {
    if (!currentUserId) {
      toast.error('Please sign in to join the discussion.')
      return
    }

    const text = parentId ? replyText.trim() : newCommentText.trim()
    if (!text) return

    setSubmitting(true)
    try {
      const insertObj: any = {
        user_id: currentUserId,
        content: text,
        parent_id: parentId
      }

      if (targetType === 'resource') {
        insertObj.resource_id = targetId
      } else {
        insertObj.blog_post_id = targetId
      }

      const { data, error } = await supabase
        .from('comments')
        .insert(insertObj)
        .select(`
          id, parent_id, content, created_at, user_id,
          profiles (full_name, avatar_url),
          comment_votes (vote_type, user_id)
        `)
        .single()

      if (error) throw error

      const formatted: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        parent_id: data.parent_id,
        user_id: data.user_id,
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        comment_votes: data.comment_votes || []
      }

      setComments([...comments, formatted])
      if (parentId) {
        setReplyToId(null)
        setReplyText('')
      } else {
        setNewCommentText('')
      }
      toast.success('Comment posted successfully.')
    } catch (err: any) {
      const errMsg = err?.message || ''
      if (errMsg.includes('relation') || errMsg.includes('does not exist') || errMsg.includes('column') || errMsg.includes('schema cache')) {
        setDbError('DATABASE_UPGRADE_PENDING')
      } else {
        console.error('Comment post error:', err?.message || err)
        toast.error('Failed to post comment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, currentVote: number, targetVote: number) => {
    if (!currentUserId) {
      toast.error('Please sign in to vote.')
      return
    }

    // If clicking same vote, delete it (retract)
    const newVoteType = currentVote === targetVote ? 0 : targetVote

    try {
      const res = await fetch('/api/comments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, voteType: newVoteType })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to submit vote.')
      }

      // Update local state instantly (Optimistic UI)
      setComments(prevComments => 
        prevComments.map(c => {
          if (c.id !== commentId) return c
          
          let votes = c.comment_votes ? [...c.comment_votes] : []
          const existingVoteIndex = votes.findIndex(v => v.user_id === currentUserId)

          if (newVoteType === 0) {
            // Remove
            if (existingVoteIndex >= 0) votes.splice(existingVoteIndex, 1)
          } else {
            // Upsert
            if (existingVoteIndex >= 0) {
              votes[existingVoteIndex].vote_type = newVoteType
            } else {
              votes.push({ user_id: currentUserId, vote_type: newVoteType })
            }
          }
          
          return { ...c, comment_votes: votes }
        })
      )

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error processing vote.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success('Comment deleted.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete comment.')
    }
  }

  // Render pending SQL schema setup block
  if (dbError === 'DATABASE_UPGRADE_PENDING') {
    return (
      <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] p-6 text-left my-8 font-sans">
        <h3 className="text-[17px] font-heading font-semibold text-[#14171F] mb-2">Discussion System Ready</h3>
        <p className="text-[13px] text-[#5B6470] mb-4 leading-relaxed">
          The upvote/downvote comment system is prepared. To enable it on your Supabase instance, please copy and apply the SQL script located in your project repository:
        </p>
        <code className="block bg-[#F6F3EC] p-3 text-[11px] font-mono text-[#1F3A33] border border-[#DDD7C9] rounded-[2px] mb-4 overflow-x-auto">
          supabase/migrations/20260701193000_comments_upgrades.sql
        </code>
        <p className="text-[12px] text-[#8A949E] italic">
          Once the tables are provisioned in the Supabase console SQL Editor, comments will live reload instantly here.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-6 w-32 skeleton" />
        <div className="h-16 w-full skeleton" />
        <div className="h-12 w-full skeleton" />
      </div>
    )
  }

  // Parse threads (Root comments vs Child replies)
  const rootComments = comments.filter(c => !c.parent_id)
  const getRepliesFor = (parentId: string) => comments.filter(c => c.parent_id === parentId)

  return (
    <div className="space-y-8 font-sans text-left">
      <div className="border-b border-[#DDD7C9] pb-4 flex items-center justify-between">
        <h3 className="text-[20px] font-heading font-semibold text-[#14171F]">
          Discussion ({comments.length})
        </h3>
        <span className="text-[11px] font-mono text-[#5B6470] uppercase tracking-wider">
          Editorial Forum
        </span>
      </div>

      {/* Main Comment Input */}
      {currentUserId ? (
        <div className="space-y-3 bg-[#EDE8DD] p-4 rounded-[4px] border border-[#DDD7C9]">
          <textarea
            placeholder="Share an insight or ask a clarification..."
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            disabled={submitting}
            className="w-full min-h-[90px] p-3 text-[14px] bg-[#F6F3EC] border border-[#DDD7C9] rounded-[2px] text-[#14171F] focus:outline-none focus:border-[#B8975A] transition-all resize-y"
          />
          <div className="flex justify-end">
            <button
              onClick={() => handlePostComment(null)}
              disabled={submitting || !newCommentText.trim()}
              className="btn-primary h-9 px-4 text-xs font-mono uppercase tracking-wider bg-[#B8975A] text-[#14171F] rounded-[2px] font-bold disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#EDE8DD] p-5 rounded-[4px] border border-[#DDD7C9] text-center">
          <p className="text-[14px] text-[#5B6470] mb-3">Please sign in to contribute to the discussion.</p>
          <a href="/auth/login" className="inline-block btn-secondary text-xs uppercase tracking-widest font-mono border-[#DDD7C9] px-4 py-2 text-[#14171F]">
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {rootComments.length === 0 ? (
          <p className="text-center py-10 text-[14px] italic text-[#8A949E]">
            No contributions yet. Start the conversation.
          </p>
        ) : (
          rootComments.map(comment => {
            const replies = getRepliesFor(comment.id)
            
            // Calculate votes
            const votes = comment.comment_votes || []
            const upvotes = votes.filter(v => v.vote_type === 1).length
            const downvotes = votes.filter(v => v.vote_type === -1).length
            const score = upvotes - downvotes
            const userVote = votes.find(v => v.user_id === currentUserId)?.vote_type || 0

            return (
              <div key={comment.id} className="space-y-4 border-b border-[#DDD7C9]/40 pb-6 last:border-b-0">
                {/* Main Comment Node */}
                <div className="flex gap-4">
                  {/* Upvote/Downvote Column (Monospaced & Vertical) */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleVote(comment.id, userVote, 1)}
                      className={`p-1 rounded-[2px] transition-colors ${
                        userVote === 1 ? 'text-[#B8975A]' : 'text-[#8A949E] hover:text-[#14171F]'
                      }`}
                      title="Upvote"
                    >
                      <ArrowBigUp className="w-5 h-5 fill-current" />
                    </button>
                    <span className="text-xs font-mono font-bold text-[#14171F] select-none min-w-[20px] text-center">
                      {score > 0 ? `+${score}` : score}
                    </span>
                    <button
                      onClick={() => handleVote(comment.id, userVote, -1)}
                      className={`p-1 rounded-[2px] transition-colors ${
                        userVote === -1 ? 'text-[#B8975A]' : 'text-[#8A949E] hover:text-[#14171F]'
                      }`}
                      title="Downvote"
                    >
                      <ArrowBigDown className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1 space-y-2">
                    {/* Header line */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-[#14171F] text-[14px]">
                          {comment.profiles?.full_name || 'Anonymous User'}
                        </span>
                        {comment.user_id === currentUserId && (
                          <span className="text-[10px] text-[#B8975A] border border-[#B8975A]/30 px-1 py-0.5 rounded-[2px]">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[#8A949E]">
                        <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                        {(comment.user_id === currentUserId || currentUserRole === 'admin') && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[#C0392B] hover:text-[#C0392B]/85 bg-transparent p-0 border-none"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content text */}
                    <p className="text-[14px] text-[#14171F] leading-relaxed whitespace-pre-wrap pl-1">
                      {comment.content}
                    </p>

                    {/* Footer Actions */}
                    {currentUserId && (
                      <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider pt-1 pl-1">
                        <button
                          onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                          className="text-[#8A949E] hover:text-[#B8975A] flex items-center gap-1.5 bg-transparent p-0 border-none"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-reply Input Field */}
                {replyToId === comment.id && (
                  <div className="ml-12 pl-4 border-l border-[#DDD7C9] space-y-2">
                    <textarea
                      placeholder={`Reply to ${comment.profiles?.full_name || 'user'}...`}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      disabled={submitting}
                      className="w-full min-h-[70px] p-3 text-[13px] bg-[#EDE8DD] border border-[#DDD7C9] rounded-[2px] text-[#14171F] focus:outline-none focus:border-[#B8975A] transition-all"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setReplyToId(null)}
                        className="h-8 px-3 text-[10px] font-mono uppercase tracking-wider border border-[#DDD7C9] rounded-[2px] text-[#5B6470]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostComment(comment.id)}
                        disabled={submitting || !replyText.trim()}
                        className="h-8 px-4 text-[10px] font-mono uppercase tracking-wider bg-[#B8975A] text-[#14171F] rounded-[2px] font-bold disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Nesting Replies */}
                {replies.length > 0 && (
                  <div className="ml-10 space-y-4 border-l border-[#DDD7C9] pl-6">
                    {replies.map(reply => {
                      const replyVotes = reply.comment_votes || []
                      const replyUpvotes = replyVotes.filter(v => v.vote_type === 1).length
                      const replyDownvotes = replyVotes.filter(v => v.vote_type === -1).length
                      const replyScore = replyUpvotes - replyDownvotes
                      const replyUserVote = replyVotes.find(v => v.user_id === currentUserId)?.vote_type || 0

                      return (
                        <div key={reply.id} className="flex gap-3 pt-2">
                          <CornerDownRight className="w-4 h-4 text-[#8A949E] mt-1 shrink-0" />
                          
                          {/* Inner Reply Card */}
                          <div className="flex-1 bg-[#EDE8DD]/40 border border-[#DDD7C9]/40 p-4 rounded-[4px] flex gap-3">
                            {/* Reply Votes */}
                            <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 bg-[#EDE8DD]/70 border border-[#DDD7C9]/50 rounded-[4px] px-1 py-0.5 h-fit text-[11px] font-mono">
                              <button
                                onClick={() => handleVote(reply.id, replyUserVote, 1)}
                                className={`text-[10px] ${replyUserVote === 1 ? 'text-[#B8975A]' : 'text-[#8A949E]'}`}
                              >
                                ▲
                              </button>
                              <span className="font-bold">{replyScore}</span>
                              <button
                                onClick={() => handleVote(reply.id, replyUserVote, -1)}
                                className={`text-[10px] ${replyUserVote === -1 ? 'text-[#B8975A]' : 'text-[#8A949E]'}`}
                              >
                                ▼
                              </button>
                            </div>

                            {/* Reply Content */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-sans font-semibold text-[#14171F]">
                                  {reply.profiles?.full_name || 'Anonymous User'}
                                </span>
                                <div className="flex items-center gap-2 text-[#8A949E]">
                                  <span>{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                                  {(reply.user_id === currentUserId || currentUserRole === 'admin') && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="text-[#C0392B] hover:text-[#C0392B]/85 bg-transparent p-0 border-none"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-[13px] text-[#14171F] leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
