import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { assetUrl } from '../../lib/utils'

let seed = 365
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}
const stars = Array.from({ length: 160 }, () => ({
  x: random(),
  y: random(),
  radius: 0.4 + random() * 1.15,
  phase: random() * Math.PI * 2,
  period: 6 + random() * 12,
  brightness: 0.2 + random() * 0.5,
}))

export function HeroUniverse() {
  const backdropRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsedRef = useRef(0)
  const inView = useInView(backdropRef, { amount: 0.05 })
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(!document.hidden)
  const running = inView && visible && !reduced

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const backdrop = backdropRef.current
    if (!canvas || !backdrop) return
    const context = canvas.getContext('2d')
    if (!context) return
    let width = 0
    let height = 0
    let frame = 0
    let previous = 0
    let lastPaint = 0

    const paint = (time: number) => {
      context.clearRect(0, 0, width, height)
      const light = document.documentElement.dataset.theme === 'light'
      const starColor = light ? '73, 102, 161' : '191, 219, 255'
      const glowColor = light ? '104, 122, 179' : '153, 207, 255'
      const count = width < 650 ? 75 : stars.length
      for (const star of stars.slice(0, count)) {
        const x = star.x * width + Math.sin(time / 95 + star.phase) * 9
        const y = star.y * height + Math.cos(time / 110 + star.phase) * 7
        const shimmer = 0.65 + 0.35 * Math.sin((time * Math.PI * 2) / star.period + star.phase)
        context.beginPath()
        context.fillStyle = `rgba(${starColor}, ${star.brightness * shimmer})`
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fill()
        if (star.radius > 1.35) {
          const glow = context.createRadialGradient(x, y, 0, x, y, star.radius * 4)
          glow.addColorStop(0, `rgba(${glowColor}, ${star.brightness * shimmer * 0.25})`)
          glow.addColorStop(1, `rgba(${glowColor}, 0)`)
          context.fillStyle = glow
          context.fillRect(
            x - star.radius * 4,
            y - star.radius * 4,
            star.radius * 8,
            star.radius * 8,
          )
        }
      }
    }

    const resize = () => {
      width = backdrop.clientWidth
      height = backdrop.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      paint(elapsedRef.current)
    }
    const tick = (timestamp: number) => {
      if (previous) elapsedRef.current += Math.min(timestamp - previous, 100) / 1000
      previous = timestamp
      // Cap painting at 30fps; the slow atmospheric motion needs no more.
      if (timestamp - lastPaint >= 1000 / 30) {
        paint(elapsedRef.current)
        lastPaint = timestamp
      }
      frame = window.requestAnimationFrame(tick)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(backdrop)
    const themeObserver = new MutationObserver(() => paint(elapsedRef.current))
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    resize()
    if (running) frame = window.requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      themeObserver.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [running])

  return (
    <>
      <div ref={backdropRef} className="hero-universe" data-running={running} aria-hidden="true">
        <img
          className="hero-nebula"
          src={assetUrl('images/backgrounds/hero-nebula.jpg')}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-nebula-light nebula-light-violet" />
        <div className="hero-nebula-light nebula-light-cyan" />
        <canvas ref={canvasRef} className="hero-starfield" />
        <div className="hero-universe-shade" />
      </div>
    </>
  )
}
