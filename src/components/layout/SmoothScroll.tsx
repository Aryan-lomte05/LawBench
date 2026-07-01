'use client'

import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2
    })

    lenisRef.current = lenis

    // Frame loop
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Sync with GSAP ScrollTrigger if it is loaded
    try {
      const gsap = require('gsap').gsap
      const ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger
      if (gsap && ScrollTrigger) {
        lenis.on('scroll', () => {
          ScrollTrigger.update()
        })
      }
    } catch (e) {
      // gsap might not be imported or set up in this context
    }

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
