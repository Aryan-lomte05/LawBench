'use client'

import React, { useRef, useState, useEffect } from 'react'

interface MagnetismProps {
  children: React.ReactElement
  strength?: number // multiplier for magnetic strength, defaults to subtle (0.15)
}

export function Magnetism({ children, strength = 0.15 }: MagnetismProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY

      // Calculate distance
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Limit pull range (e.g. 100px)
      if (distance < 120) {
        // Cap the max offset to a few pixels (e.g. max 15px pull)
        const pullX = Math.max(-15, Math.min(15, dx * strength))
        const pullY = Math.max(-15, Math.min(15, dy * strength))
        setPosition({ x: pullX, y: pullY })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-block',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {children}
    </div>
  )
}

export default Magnetism
