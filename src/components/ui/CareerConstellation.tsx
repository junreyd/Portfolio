import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ArrowDown, Sparkles } from 'lucide-react'
import type { Experience } from '../../types/portfolio'

type Point = { x: number; y: number }
type MapLayout = { width: number; height: number; points: Point[] }

function geometryFor(points: Point[]) {
  const distances = points.map((point, index) =>
    index ? Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y) : 0,
  )
  const stops = distances.map((_, index) =>
    distances.slice(0, index + 1).reduce((sum, value) => sum + value, 0),
  )
  return {
    points,
    distances,
    stops,
    length: stops[stops.length - 1] || 1,
    route: points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '),
  }
}

function routePosition(
  progress: number,
  axis: 'x' | 'y',
  geometry: ReturnType<typeof geometryFor>,
) {
  const { points, stops, distances, length } = geometry
  const distance = Math.max(0, Math.min(1, progress)) * length
  const end = Math.max(
    1,
    stops.findIndex((stop) => stop >= distance),
  )
  const fraction = (distance - stops[end - 1]) / distances[end]
  return points[end - 1][axis] + (points[end][axis] - points[end - 1][axis]) * fraction
}

// A seeded distribution keeps the sky stable while concentrating stars into a winding galactic band.
function galaxyStars(width: number, height: number) {
  let seed = 3187
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const count = Math.max(300, Math.min(1700, Math.round((width * height) / 650)))
  return Array.from({ length: count }, (_, index) => {
    const y = random()
    const center = 0.5 + Math.sin(y * 9 - 1) * 0.22
    const spread =
      Math.sqrt(-2 * Math.log(Math.max(0.0001, random()))) * Math.cos(2 * Math.PI * random())
    const x = index % 4 === 0 ? random() : center + spread * 0.1
    return {
      x: Math.max(0.02, Math.min(0.98, x)) * width,
      y: y * height,
      radius: index % 29 === 0 ? 1.5 : 0.3 + random() * 0.65,
      opacity: 0.22 + random() * 0.63,
      tone: index % 7 === 0 ? 'warm' : index % 3 === 0 ? 'blue' : 'white',
    }
  })
}

export function CareerConstellation({
  items,
  timelineRef,
}: {
  items: Experience[]
  timelineRef: RefObject<HTMLDivElement | null>
}) {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { amount: 'some' })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [layout, setLayout] = useState<MapLayout>(() => ({
    width: 360,
    height: 800,
    points: items.map((_, index) => ({ x: index % 2 === 0 ? 252 : 108, y: 65 + index * 130 })),
  }))
  const geometry = useMemo(() => geometryFor(layout.points), [layout.points])
  const stars = useMemo(
    () => galaxyStars(layout.width, layout.height),
    [layout.width, layout.height],
  )
  const progress = useMotionValue(0)
  const eased = useSpring(progress, { stiffness: 100, damping: 28, restDelta: 0.0001 })
  const travel = reduced ? progress : eased
  const cursorX = useTransform(travel, (value) => routePosition(value, 'x', geometry))
  const cursorY = useTransform(travel, (value) => routePosition(value, 'y', geometry))
  const stardrift = useTransform(travel, [0, 1], [-8, 8])

  useEffect(() => {
    const node = root.current
    const timeline = timelineRef.current
    if (!node || !timeline) return
    const cards = Array.from(timeline.querySelectorAll<HTMLElement>('[data-experience-id]'))
    const measure = () => {
      const width = node.clientWidth
      const height = node.clientHeight
      const compact = window.matchMedia('(max-width: 650px)').matches
      const offset = node.getBoundingClientRect().top - timeline.getBoundingClientRect().top
      const points = cards.map((card, index) => {
        // The reveal wrapper's offset ignores its entrance transform.
        const roleTop = card.parentElement?.offsetTop ?? 0
        const y = compact
          ? 65 + (index * (height - 130)) / Math.max(1, cards.length - 1)
          : Math.max(
              70,
              Math.min(height - 85, roleTop + Math.min(card.offsetHeight * 0.35, 160) - offset),
            )
        return { x: width * (index % 2 === 0 ? 0.7 : 0.28), y }
      })
      setLayout((previous) =>
        previous.width === width &&
        previous.height === height &&
        points.every((point, index) => Math.abs(point.y - (previous.points[index]?.y ?? -1)) < 1)
          ? previous
          : { width, height, points },
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    observer.observe(timeline)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [items, timelineRef])

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    const cards = Array.from(timeline.querySelectorAll<HTMLElement>('[data-experience-id]'))
    let frame = 0
    const measure = () => {
      frame = 0
      const focus = window.innerHeight * 0.42
      const anchors = cards.map((card) => card.getBoundingClientRect().top)
      let index = 0
      for (let i = 1; i < anchors.length; i++) if (anchors[i] <= focus) index = i
      const next = Math.min(index + 1, anchors.length - 1)
      const fraction =
        next === index
          ? 0
          : Math.max(0, Math.min(1, (focus - anchors[index]) / (anchors[next] - anchors[index])))
      progress.set(
        (geometry.stops[index] + (geometry.stops[next] - geometry.stops[index]) * fraction) /
          geometry.length,
      )
      setActive((previous) => (previous === index ? previous : index))
    }
    const requestMeasure = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
    }
  }, [geometry, progress, timelineRef])

  return (
    <div
      className="career-constellation"
      ref={root}
      data-active-role={items[active].id}
      data-in-view={inView}
    >
      <div className="career-map-heading">
        <span>
          <Sparkles size={13} aria-hidden="true" /> CAREER CONSTELLATION
        </span>
        <span>
          {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
      <div className="career-galactic-dust" aria-hidden="true" />
      <svg
        className="career-map"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="group"
        aria-label="Career map. Select a star to explore a role."
      >
        <g aria-hidden="true">
          <motion.g className="career-map-stars" style={{ y: reduced ? 0 : stardrift }}>
            {stars.map((star, index) => (
              <circle
                key={index}
                cx={star.x}
                cy={star.y}
                r={star.radius}
                opacity={star.opacity}
                data-tone={star.tone}
              />
            ))}
          </motion.g>
          <path className="career-map-route" d={geometry.route} />
          <motion.path
            className="career-map-trail"
            d={geometry.route}
            style={{ pathLength: travel }}
          />
          <motion.circle className="career-map-traveler-glow" cx={cursorX} cy={cursorY} r="14" />
          <motion.circle className="career-map-traveler" cx={cursorX} cy={cursorY} r="2.5" />
        </g>
        {items.map((item, index) => {
          const point = layout.points[index]
          const labelX = point.x + (index % 2 === 0 ? -20 : 20)
          return (
            <a
              key={item.id}
              href={`#experience-${item.id}`}
              className="career-map-point"
              data-active={active === index}
              aria-label={`Explore ${item.company} experience`}
              aria-current={active === index ? 'step' : undefined}
            >
              <title>
                {item.company} · {item.period}
              </title>
              <circle className="career-map-hit" cx={point.x} cy={point.y} r="22" />
              {active === index && (
                <circle
                  key={`ring-${index}`}
                  className="career-map-ring"
                  cx={point.x}
                  cy={point.y}
                  r="11"
                  aria-hidden="true"
                />
              )}
              <circle
                className="career-map-node"
                cx={point.x}
                cy={point.y}
                r={active === index ? 4.5 : 3}
              />
              <text
                className="career-star-label"
                x={labelX}
                y={point.y - 9}
                textAnchor={index % 2 === 0 ? 'end' : 'start'}
                aria-hidden="true"
              >
                <tspan className="career-star-year" x={labelX}>
                  {item.period.match(/\d{4}/)?.[0]}
                </tspan>
                <tspan className="career-star-company" x={labelX} dy="18">
                  {item.company}
                </tspan>
              </text>
            </a>
          )
        })}
      </svg>
      <div className="career-map-footer">
        <span>
          <ArrowDown size={11} aria-hidden="true" /> SCROLL THROUGH THE JOURNEY
        </span>
        <span className="career-map-progress" aria-hidden="true">
          <motion.span style={{ scaleX: travel }} />
        </span>
      </div>
    </div>
  )
}
