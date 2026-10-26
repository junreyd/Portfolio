import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Project } from '../../types/portfolio'
import { ProjectCard } from '../cards/ProjectCard'

export function ProjectCarousel({
  projects,
  onSelect,
  dialogOpen,
}: {
  projects: Project[]
  onSelect: (project: Project) => void
  dialogOpen: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(1)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const reduced = useReducedMotion()
  const lastIndex = Math.max(0, projects.length - visible)
  const paused = hovered || focused || !inView || !pageVisible || dialogOpen || reduced

  const goTo = useCallback(
    (requested: number, manual = false) => {
      const track = trackRef.current
      const card = track?.firstElementChild as HTMLElement | null
      if (!track || !card) return
      const target = requested > lastIndex ? 0 : requested < 0 ? lastIndex : requested
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const wrapping = target !== requested
      track.scrollTo({
        left: target * (card.offsetWidth + gap),
        behavior: reduced || wrapping ? 'instant' : 'smooth',
      })
      if (wrapping && !reduced)
        track.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' })
      indexRef.current = target
      setIndex(target)
      if (manual)
        setAnnouncement(
          `Showing projects ${target + 1} to ${Math.min(target + visible, projects.length)} of ${projects.length}`,
        )
    },
    [lastIndex, projects.length, reduced, visible],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(() => {
      const card = track.firstElementChild as HTMLElement | null
      if (!card) return
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const count = Math.max(1, Math.round((track.clientWidth + gap) / (card.offsetWidth + gap)))
      setVisible(count)
      const next = Math.min(indexRef.current, Math.max(0, projects.length - count))
      track.scrollTo({ left: next * (card.offsetWidth + gap), behavior: 'instant' })
      indexRef.current = next
      setIndex(next)
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [projects.length])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(root)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (paused || lastIndex === 0) return
    const timer = window.setInterval(() => goTo(indexRef.current + 1), 6000)
    return () => window.clearInterval(timer)
  }, [paused, goTo, lastIndex])

  useEffect(() => {
    if (reduced) goTo(indexRef.current)
  }, [goTo, reduced])

  return (
    <div
      ref={rootRef}
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(indexRef.current + (event.key === 'ArrowRight' ? 1 : -1), true)
        }
        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          goTo(event.key === 'Home' ? 0 : lastIndex, true)
        }
      }}
    >
      <div
        className="project-carousel-track"
        ref={trackRef}
        id="project-carousel-track"
        onScroll={() => {
          const track = trackRef.current
          const card = track?.firstElementChild as HTMLElement | null
          if (!track || !card) return
          const gap = parseFloat(getComputedStyle(track).columnGap) || 0
          const next = Math.min(
            lastIndex,
            Math.max(0, Math.round(track.scrollLeft / (card.offsetWidth + gap))),
          )
          indexRef.current = next
          setIndex(next)
        }}
      >
        {projects.map((project, position) => (
          <div
            className="project-slide"
            key={project.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${projects.length}: ${project.title}`}
            inert={position < index || position >= index + visible}
          >
            <ProjectCard project={project} index={position} onSelect={onSelect} />
          </div>
        ))}
      </div>
      <div className="project-carousel-controls">
        <span className="project-carousel-range">
          <strong>
            {String(index + 1).padStart(2, '0')}–
            {String(Math.min(index + visible, projects.length)).padStart(2, '0')}
          </strong>{' '}
          / {String(projects.length).padStart(2, '0')}
        </span>
        <div className="project-carousel-pagination" aria-label="Choose projects">
          {Array.from({ length: lastIndex + 1 }, (_, position) => (
            <button
              key={position}
              aria-label={`Show projects ${position + 1} to ${position + visible}`}
              aria-current={index === position ? 'true' : undefined}
              onClick={() => goTo(position, true)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="project-carousel-arrows">
          <button
            className="icon-button"
            aria-label="Previous projects"
            aria-controls="project-carousel-track"
            onClick={() => goTo(indexRef.current - 1, true)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Next projects"
            aria-controls="project-carousel-track"
            onClick={() => goTo(indexRef.current + 1, true)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </div>
  )
}
