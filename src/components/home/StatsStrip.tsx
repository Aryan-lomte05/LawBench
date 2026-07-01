'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsStripProps {
  subjects: number
  resources: number
  learners: number
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function StatsStrip({ subjects, resources, learners }: StatsStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState({ subjects: 0, resources: 0, learners: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCounts({ subjects, resources, learners })
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCounts()
        }
      },
      { threshold: 0.15 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, subjects, resources, learners])

  const animateCounts = () => {
    const duration = 1200 // 1.2s duration
    const startTime = performance.now()

    const step = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easeProgress = easeOutCubic(progress)

      setCounts({
        subjects: Math.floor(easeProgress * subjects),
        resources: Math.floor(easeProgress * resources),
        learners: Math.floor(easeProgress * learners)
      })

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  return (
    <section ref={containerRef} className="py-16 bg-[#14171F] border-b border-[#2A2E3A] relative z-10 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center md:border-r md:border-[#2A2E3A]">
            <span className="text-[40px] md:text-[64px] font-heading font-semibold text-[#F9F8F5] leading-none mb-2">
              {counts.subjects}+
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A949E]">
              Subjects Curated
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center md:border-r md:border-[#2A2E3A]">
            <span className="text-[40px] md:text-[64px] font-heading font-semibold text-[#F9F8F5] leading-none mb-2">
              {counts.resources}+
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A949E]">
              Study Resources
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[40px] md:text-[64px] font-heading font-semibold text-[#F9F8F5] leading-none mb-2">
              {counts.learners}+
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8A949E]">
              Active Learners
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
