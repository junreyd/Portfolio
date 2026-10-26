import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { aiTools } from '../../data/aiTools'
import { assetUrl } from '../../lib/utils'

const count = aiTools.length
const slides = [0, 1, 2].flatMap((copy) => aiTools.map((tool) => ({ tool, copy })))

export function TechnologyCarousel() {
  const root = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const step = useRef(0)
  const destination = useRef(count)
  const animation = useRef<gsap.core.Tween | null>(null)
  const inView = useInView(root, { amount: 0.3 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const id = useId()

  const settle = useCallback(() => {
    const node = viewport.current
    if (!node || !step.current || animation.current?.isActive()) return
    const position = Math.round(node.scrollLeft / step.current)
    const index = ((position % count) + count) % count
    destination.current = count + index
    if (position < count || position >= count * 2)
      node.scrollLeft = destination.current * step.current
    setActive(index)
  }, [])

  const move = useCallback(
    (direction: number) => {
      const node = viewport.current
      if (!node || !step.current) return
      if (!animation.current?.isActive()) settle()
      animation.current?.kill()
      destination.current += direction
      node.style.scrollSnapType = 'none'
      animation.current = gsap.to(node, {
        scrollLeft: destination.current * step.current,
        duration: reduced ? 0 : 0.58,
        ease: 'power2.inOut',
        onComplete: () => {
          animation.current = null
          settle()
          node.style.scrollSnapType = ''
        },
      })
    },
    [reduced, settle],
  )

  useEffect(() => {
    const node = viewport.current
    if (!node) return
    const measure = () => {
      const cards = node.querySelectorAll<HTMLElement>('.technology-card')
      if (cards.length < 2) return
      animation.current?.kill()
      animation.current = null
      step.current = cards[1].offsetLeft - cards[0].offsetLeft
      destination.current = count + (((destination.current % count) + count) % count)
      node.style.scrollSnapType = 'none'
      node.scrollLeft = destination.current * step.current
      node.style.scrollSnapType = ''
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    node.addEventListener('scrollend', settle)
    const updateVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      node.removeEventListener('scrollend', settle)
      document.removeEventListener('visibilitychange', updateVisibility)
      animation.current?.kill()
    }
  }, [settle])

  useEffect(() => {
    if (!inView || !visible || hovered || focused || reduced) return
    const timer = window.setInterval(() => move(1), 2400)
    return () => window.clearInterval(timer)
  }, [inView, visible, hovered, focused, reduced, move])

  useEffect(() => {
    if (!reduced) return
    animation.current?.kill()
    animation.current = null
    const node = viewport.current
    if (node && step.current) {
      node.scrollLeft = destination.current * step.current
      node.style.scrollSnapType = ''
      settle()
    }
  }, [reduced, settle])

  const stopDragAnimation = () => {
    animation.current?.kill()
    animation.current = null
    if (viewport.current) viewport.current.style.scrollSnapType = ''
  }

  return (
    <section
      ref={root}
      className="technology-carousel"
      aria-label="AI tools"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setFocused(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <button
        type="button"
        className="technology-previous"
        aria-label="Previous AI tools"
        aria-controls={id}
        onClick={() => move(-1)}
      >
        <ChevronLeft size={14} />
      </button>
      <div
        ref={viewport}
        id={id}
        className="technology-viewport"
        tabIndex={0}
        role="group"
        aria-label="Swipe or use arrow keys to browse AI tools"
        onPointerDown={stopDragAnimation}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowRight' ? 1 : -1)
          }
        }}
      >
        <ul className="technology-track">
          {slides.map(({ tool, copy }) => (
            <li
              key={`${copy}-${tool.id}`}
              className="technology-card"
              data-ai-tool={tool.id}
              aria-hidden={copy !== 1 ? true : undefined}
            >
              <div className="technology-logos" aria-hidden="true">
                <img
                  src={assetUrl(`images/ai-tools/${tool.logo}`)}
                  alt=""
                  width="18"
                  height="18"
                  draggable={false}
                  decoding="async"
                />
              </div>
              <span className="technology-name">{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="technology-next"
        aria-label="Next AI tools"
        aria-controls={id}
        onClick={() => move(1)}
      >
        <ChevronRight size={14} />
      </button>
      <span className="sr-only" aria-live={focused ? 'polite' : 'off'} aria-atomic="true">
        {aiTools[active].name}, {active + 1} of {count}
      </span>
    </section>
  )
}
