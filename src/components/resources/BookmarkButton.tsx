'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  resourceId: string
  initialIsBookmarked: boolean
  userId?: string
}

export function BookmarkButton({ resourceId, initialIsBookmarked, userId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const toggleBookmark = async () => {
    if (!userId) {
      toast.error('Please sign in to bookmark resources')
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ user_id: userId, resource_id: resourceId })
          
        if (error) throw error
        setIsBookmarked(false)
        toast.success('Removed from bookmarks')
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: userId, resource_id: resourceId })
          
        if (error) throw error
        setIsBookmarked(true)
        toast.success('Added to bookmarks')
      }
      
      router.refresh()
    } catch (error: any) {
      toast.error('Failed to update bookmark: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={isBookmarked ? 'default' : 'outline'} 
      size="icon" 
      onClick={toggleBookmark}
      disabled={isLoading}
      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
      className="transition-all"
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-primary-foreground' : 'text-foreground'}`} />
    </Button>
  )
}
