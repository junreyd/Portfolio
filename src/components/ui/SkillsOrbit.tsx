import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from 'gsap'
import { ArrowUpRight, Braces, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { orbitSkills, skillCategories, type OrbitSkill } from '../../data/skillOrbit'
import { assetUrl } from '../../lib/utils'
import { FadeIn } from '../animations/FadeIn'
import { SectionHeading } from './SectionHeading'

function SkillMark({ skill }: { skill: OrbitSkill }) {
  if (skill.logo === 'rest') return <Braces aria-hidden="true" className="skills-rest-mark" />
  return (
    <span className="skills-brand-mark" data-brand={skill.id} aria-hidden="true">
      <img
        src={assetUrl(`images/technologies/${skill.logo}`)}
        alt=""
        width="96"
        height="96"
        draggable={false}
        className={skill.darkLogo ? 'skills-mark-light' : undefined}
      />
      {skill.darkLogo && (
        <img
          src={assetUrl(`images/technologies/${skill.darkLogo}`)}
          alt=""
          width="96"
          height="96"
          draggable={false}
          className="skills-mark-dark"
        />
      )}
    </span>
  )
}

const stars = Array.from({ length: 86 }, (_, index) => ({
  x: ((index * 127 + 31) % 640) + 10,
  y: ((index * 83 + 17) % 640) + 10,
  radius: index % 11 ? 0.7 : 1.4,
}))

export function SkillsOrbit() {
  const galaxy = useRef<HTMLDivElement>(null)
  const spotlight = useRef<HTMLDivElement>(null)
  const phase = useRef(0)
  const inView = useInView(galaxy, { amount: 0.2 })
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(!document.hidden)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [width, setWidth] = useState(660)
  const [selectedId, setSelectedId] = useState(orbitSkills[0].id)
  const [announce, setAnnounce] = useState(false)
  const pool = orbitSkills
  const activeIndex = Math.max(
    0,
    pool.findIndex((skill) => skill.id === selectedId),
  )
  const selected = pool[activeIndex]
  const compact = width < 560
  const pageIndex = compact ? Math.floor(activeIndex / 10) : 0
  const satellites = useMemo(() => {
    const items = compact ? pool.slice(pageIndex * 10, pageIndex * 10 + 10) : pool
    const ringCount = compact || items.length <= 16 ? 1 : items.length <= 30 ? 2 : 3
    const perRing = Math.ceil(items.length / ringCount)
    return items.map((skill, index) => {
      const ring = Math.floor(index / perRing)
      const size = Math.min(perRing, items.length - ring * perRing)
      return { skill, ring, angle: ((index % perRing) / size) * 360 - 90 }
    })
  }, [compact, pageIndex, pool])
  const layoutKey = satellites.map(({ skill }) => skill.id).join(',')
  const running = inView && visible && !hovered && !focused && !reduced

  useEffect(() => {
    const node = galaxy.current
    if (!node) return
    const measure = () => {
      setWidth(node.clientWidth)
      node.style.setProperty('--galaxy-size', `${node.clientWidth}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useLayoutEffect(() => {
    const root = galaxy.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit-slot]'))
    const driver = { angle: reduced ? 0 : phase.current }
    const draw = () => {
      phase.current = driver.angle % 360
      for (const node of nodes) {
        const ring = Number(node.dataset.ring)
        const angle =
          ((Number(node.dataset.angle) + driver.angle * (ring === 1 ? -1 : 1)) * Math.PI) / 180
        const radius = width * (compact ? 0.415 : [0.44, 0.33, 0.225][ring])
        gsap.set(node, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          xPercent: -50,
          yPercent: -50,
        })
      }
    }
    draw()
    if (!running) return
    const animation = gsap.to(driver, {
      angle: driver.angle + 360,
      duration: 72,
      repeat: -1,
      ease: 'none',
      onUpdate: draw,
    })
    return () => {
      animation.kill()
    }
  }, [compact, layoutKey, reduced, running, width])

  useLayoutEffect(() => {
    const node = spotlight.current
    if (!node || reduced || !inView || !visible || !selected) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.skills-center-logo',
        { autoAlpha: 0, y: 25, scale: 0.65, rotate: -12 },
        { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.skills-center-name',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.55, delay: 0.12, ease: 'power2.out' },
      )
      gsap.to('.skills-center-logo', {
        y: -5,
        duration: 1.8,
        delay: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, node)
    return () => context.revert()
  }, [inView, reduced, selected, visible])

  useEffect(() => {
    if (!running || pool.length < 2) return
    const interval = window.setInterval(() => {
      setAnnounce(false)
      setSelectedId((previous) => {
        const index = Math.max(
          0,
          pool.findIndex((skill) => skill.id === previous),
        )
        return pool[(index + 1) % pool.length].id
      })
    }, 3400)
    return () => window.clearInterval(interval)
  }, [pool, running])

  const choose = (skill: OrbitSkill) => {
    setAnnounce(true)
    setSelectedId(skill.id)
  }
  const move = (direction: number) => {
    if (pool.length) choose(pool[(activeIndex + direction + pool.length) % pool.length])
  }
  const categoryName = skillCategories.find((item) => item.id === selected?.category)?.name

  return (
    <div
      className="skills-explorer"
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setFocused(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className="skills-orbit-layout">
        <FadeIn className="skills-orbit-intro">
          <SectionHeading
            number="03"
            eyebrow="MY DEVELOPMENT TOOLKIT"
            title="The right tools. Thoughtfully applied."
            description="Microsoft 365 and Power Platform, modern web development, and the integrations that connect business systems."
          />
          <p className="skills-orbit-note">A connected toolkit. A universe of possibilities.</p>
          <div className="skills-toolkit-stats">
            <span>
              <strong>{orbitSkills.length}</strong> technologies
            </span>
            <span>
              <strong>{skillCategories.length}</strong> skill categories
            </span>
          </div>
          <p className="skills-orbit-hint">
            <Sparkles size={15} aria-hidden="true" /> Select a logo. Explore what I build with.
          </p>
          <a className="inline-link" href="#projects">
            See these skills in action <ArrowUpRight size={17} />
          </a>
          <div
            className="skills-orbit-controls"
            role="group"
            aria-label="Skills spotlight controls"
          >
            <button
              type="button"
              aria-label="Previous skill"
              onClick={() => move(-1)}
              disabled={pool.length < 2}
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              {pool.length ? String(activeIndex + 1).padStart(2, '0') : '00'}{' '}
              <span>/ {String(pool.length).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              aria-label="Next skill"
              onClick={() => move(1)}
              disabled={pool.length < 2}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </FadeIn>
        <div
          className="skills-galaxy"
          ref={galaxy}
          data-running={running}
          data-active-skill={selected?.id ?? ''}
          data-compact={compact}
        >
          <div className="skills-galaxy-glow" aria-hidden="true" />
          <svg className="skills-galaxy-stars" viewBox="0 0 660 660" fill="none" aria-hidden="true">
            {stars.map((star, index) => (
              <circle key={index} cx={star.x} cy={star.y} r={star.radius} />
            ))}
          </svg>
          <div className="skills-orbital-ring skills-orbital-ring-outer" aria-hidden="true" />
          {!compact && pool.length > 16 && (
            <div className="skills-orbital-ring skills-orbital-ring-middle" aria-hidden="true" />
          )}
          {!compact && pool.length > 30 && (
            <div className="skills-orbital-ring skills-orbital-ring-inner" aria-hidden="true" />
          )}
          <div
            className="skills-satellites"
            role="group"
            aria-label="Orbiting skill logos"
            onKeyDown={(event) => {
              if (
                !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                  event.key,
                ) ||
                !pool.length
              )
                return
              event.preventDefault()
              const index =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? pool.length - 1
                    : (activeIndex +
                        (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) +
                        pool.length) %
                      pool.length
              choose(pool[index])
              requestAnimationFrame(() =>
                galaxy.current
                  ?.querySelector<HTMLButtonElement>(`button[data-skill-id="${pool[index].id}"]`)
                  ?.focus({ preventScroll: true }),
              )
            }}
          >
            {satellites.map(({ skill, ring, angle }) => (
              <div
                className="skills-satellite"
                key={skill.id}
                data-orbit-slot={skill.id}
                data-ring={ring}
                data-angle={angle}
              >
                <button
                  type="button"
                  className="skills-orbit-node"
                  data-skill-id={skill.id}
                  aria-label={`Show ${skill.name}`}
                  aria-pressed={selected?.id === skill.id}
                  tabIndex={selected?.id === skill.id ? 0 : -1}
                  title={skill.name}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onClick={() => choose(skill)}
                >
                  <SkillMark skill={skill} />
                </button>
              </div>
            ))}
          </div>
          <div
            className="skills-spotlight"
            ref={spotlight}
            role="group"
            aria-label="Selected skill"
          >
            <>
              <p className="skills-center-category">{categoryName}</p>
              <div className="skills-center-logo">
                <SkillMark skill={selected} />
              </div>
              <h3
                className="skills-center-name"
                aria-live={announce ? 'polite' : 'off'}
                aria-atomic="true"
              >
                {selected.name}
              </h3>
              <span className="skills-center-status">
                {selected.exploring ? 'Currently exploring' : 'Part of my toolkit'}
              </span>
            </>
          </div>
        </div>
      </div>
    </div>
  )
}
