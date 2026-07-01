'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import './GradualBlur.css'

interface GradualBlurProps {
  position?: 'top' | 'bottom' | 'left' | 'right'
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
  opacity?: number
  animated?: boolean | 'scroll'
  duration?: string
  easing?: string
  hoverIntensity?: number
  target?: 'parent' | 'page'
  preset?: 'top' | 'bottom' | 'left' | 'right' | 'subtle' | 'intense' | 'smooth' | 'sharp' | 'header' | 'footer' | 'sidebar' | 'page-header' | 'page-footer'
  responsive?: boolean
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_CONFIG = {
  position: 'bottom' as const,
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear' as const,
  responsive: false,
  target: 'parent' as const,
  className: '',
  style: {}
}

const PRESETS = {
  top: { position: 'top' as const, height: '6rem' },
  bottom: { position: 'bottom' as const, height: '6rem' },
  left: { position: 'left' as const, height: '6rem' },
  right: { position: 'right' as const, height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier' as const, divCount: 10 },
  sharp: { height: '5rem', curve: 'linear' as const, divCount: 4 },
  header: { position: 'top' as const, height: '8rem', curve: 'ease-out' as const },
  footer: { position: 'bottom' as const, height: '8rem', curve: 'ease-out' as const },
  sidebar: { position: 'left' as const, height: '6rem', strength: 2.5 },
  'page-header': { position: 'top' as const, height: '10rem', target: 'page' as const, strength: 3 },
  'page-footer': { position: 'bottom' as const, height: '10rem', target: 'page' as const, strength: 3 }
}

const CURVE_FUNCTIONS = {
  linear: (p: number) => p,
  bezier: (p: number) => p * p * (3 - 2 * p),
  'ease-in': (p: number) => p * p,
  'ease-out': (p: number) => 1 - Math.pow(1 - p, 2),
  'ease-in-out': (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
}

const mergeConfigs = (...configs: any[]) => configs.reduce((acc, c) => ({ ...acc, ...c }), {})

const getGradientDirection = (position: 'top' | 'bottom' | 'left' | 'right') =>
  ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  })[position] || 'to bottom'

export function GradualBlur(props: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props)
  }, [props])

  const {
    position,
    strength,
    height,
    width,
    divCount,
    exponential,
    curve,
    opacity,
    animated,
    duration,
    easing,
    hoverIntensity,
    target,
    zIndex,
    className,
    style: customStyle
  } = config

  // Intersection Observer implementation
  useEffect(() => {
    if (animated !== 'scroll' || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [animated])

  const layers = useMemo(() => {
    return Array.from({ length: divCount }).map((_, i) => {
      const p = (i + 1) / divCount
      let c = CURVE_FUNCTIONS[curve as keyof typeof CURVE_FUNCTIONS] ? CURVE_FUNCTIONS[curve as keyof typeof CURVE_FUNCTIONS](p) : p
      if (exponential) {
        c = Math.pow(c, 2)
      }
      const currentStrength = c * strength * (isHovered ? (hoverIntensity || 1) : 1)

      // Calculate mask gradient percentages
      const startPercent = (i / divCount) * 100
      const endPercent = Math.min(100, ((i + 1.5) / divCount) * 100)

      const gradientDir = getGradientDirection(position)
      const mask = `linear-gradient(${gradientDir}, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,${opacity}) ${endPercent}%)`

      const layerStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(${currentStrength}px)`,
        WebkitBackdropFilter: `blur(${currentStrength}px)`,
        maskImage: mask,
        WebkitMaskImage: mask,
        pointerEvents: 'none',
        transition: animated === true ? `backdrop-filter ${duration} ${easing}, opacity ${duration} ${easing}` : undefined
      }

      return <div key={i} style={layerStyle} className="gradual-blur-layer" />
    })
  }, [divCount, curve, exponential, strength, isHovered, hoverIntensity, position, opacity, animated, duration, easing])

  const containerStyle: React.CSSProperties = {
    position: target === 'page' ? 'fixed' : 'absolute',
    zIndex,
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: animated === 'scroll' ? 'opacity 0.6s ease' : undefined,
    ...((position === 'top' || position === 'bottom') && {
      left: 0,
      right: 0,
      height: height,
      ...(position === 'top' ? { top: 0 } : { bottom: 0 })
    }),
    ...((position === 'left' || position === 'right') && {
      top: 0,
      bottom: 0,
      width: width || height,
      ...(position === 'left' ? { left: 0 } : { right: 0 })
    }),
    ...customStyle
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`gradual-blur-container ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {layers}
    </div>
  )
}

export default GradualBlur
