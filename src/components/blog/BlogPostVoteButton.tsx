'use client'

import { useState } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { toast } from 'sonner'

interface Vote {
  vote_type: number
  user_id: string
}

interface BlogPostVoteButtonProps {
  postId: string
  initialVotes: Vote[]
  currentUserId?: string
}

export function BlogPostVoteButton({ postId, initialVotes, currentUserId }: BlogPostVoteButtonProps) {
  const [votes, setVotes] = useState<Vote[]>(initialVotes)
  const [loading, setLoading] = useState(false)

  const upvotes = votes.filter(v => v.vote_type === 1).length
  const downvotes = votes.filter(v => v.vote_type === -1).length
  const score = upvotes - downvotes
  const userVote = votes.find(v => v.user_id === currentUserId)?.vote_type || 0

  const handleVote = async (targetVote: number) => {
    if (!currentUserId) {
      toast.error('Please sign in to vote.')
      return
    }

    setLoading(true)
    const newVoteType = userVote === targetVote ? 0 : targetVote

    try {
      const res = await fetch('/api/blog/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, voteType: newVoteType })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to submit vote.')
      }

      // Update local state (Optimistic UI)
      setVotes(prevVotes => {
        let tempVotes = [...prevVotes]
        const existingVoteIndex = tempVotes.findIndex(v => v.user_id === currentUserId)

        if (newVoteType === 0) {
          if (existingVoteIndex >= 0) tempVotes.splice(existingVoteIndex, 1)
        } else {
          if (existingVoteIndex >= 0) {
            tempVotes[existingVoteIndex].vote_type = newVoteType
          } else {
            tempVotes.push({ user_id: currentUserId, vote_type: newVoteType })
          }
        }
        return tempVotes
      })

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error processing vote.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 bg-[#EDE8DD]/70 border border-[#DDD7C9] rounded-[4px] px-2 py-1 h-fit text-xs font-mono">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-1 rounded-[2px] transition-colors ${
          userVote === 1 ? 'text-[#B8975A]' : 'text-[#8A949E] hover:text-[#14171F]'
        }`}
        title="Upvote post"
      >
        <ArrowBigUp className="w-4.5 h-4.5 fill-current" />
      </button>
      <span className="font-bold text-[#14171F] min-w-[16px] text-center select-none">
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-1 rounded-[2px] transition-colors ${
          userVote === -1 ? 'text-[#B8975A]' : 'text-[#8A949E] hover:text-[#14171F]'
        }`}
        title="Downvote post"
      >
        <ArrowBigDown className="w-4.5 h-4.5 fill-current" />
      </button>
    </div>
  )
}
