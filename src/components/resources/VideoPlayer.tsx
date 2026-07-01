'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

interface VideoPlayerProps {
  url: string
  resourceId: string
  userId?: string
  initialPosition?: number
}

export function VideoPlayer({ url, resourceId, userId, initialPosition = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const supabase = createClient()
  
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')

  // Save progress for direct HTML5 video
  useEffect(() => {
    if (isYouTube || !userId || !videoRef.current) return

    const video = videoRef.current
    
    // Set initial position
    if (initialPosition > 0) {
      video.currentTime = initialPosition
    }

    let lastSavedTime = initialPosition

    const handleTimeUpdate = async () => {
      // Save every 10 seconds to avoid spamming the DB
      if (Math.abs(video.currentTime - lastSavedTime) > 10) {
        lastSavedTime = video.currentTime
        
        await supabase.from('progress').upsert({
          user_id: userId,
          resource_id: resourceId,
          position_seconds: Math.floor(video.currentTime),
          completed: video.currentTime >= video.duration * 0.95, // 95% is considered complete
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,resource_id' })
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [isYouTube, userId, resourceId, initialPosition, supabase])

  if (isYouTube) {
    // For YouTube, we'd ideally use the YouTube IFrame API to track progress.
    // For now, we just embed the standard iframe.
    
    let embedUrl = url
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/')
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/')
    }
    
    // Append start time if provided
    if (initialPosition > 0) {
      embedUrl += `${embedUrl.includes('?') ? '&' : '?'}start=${initialPosition}`
    }

    return (
      <div className="aspect-video w-full rounded-[4px] overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  // Direct video URL (e.g. Bunny CDN direct link)
  return (
    <div className="aspect-video w-full rounded-[4px] overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full h-full outline-none"
        preload="metadata"
      />
    </div>
  )
}
