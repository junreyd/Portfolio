import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from 'gsap'
import { strokeGlyphs } from '../../lib/strokeGlyphs'
import type { PlaygroundPresentation } from '../../types/playground'

type Phase = 'text' | 'erasing' | 'hidden' | 'drawing'

export function AnimatedResult({ presentation }: { presentation: PlaygroundPresentation }) {
  const reduced = useReducedMotion()
  const target = useRef<HTMLSpanElement>(null)
  const inView = useInView(target, { amount: 0.25 })
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [visibleText, setVisibleText] = useState(presentation.text)
  const [phase, setPhase] = useState<Phase>('text')
  const completedRun = useRef<number | null>(null)
  const latestResult = useRef(presentation.text)
  const maskPrefix = useId().replace(/:/g, '') + '-result-mask'
  const { status, text, runId } = presentation

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const finished = status === 'success' || status === 'error'
      const newCompletion = finished && completedRun.current !== runId
      if (finished) {
        latestResult.current = text
        completedRun.current = runId
      }
      if (newCompletion && !reduced && inView && pageVisible) setPhase('erasing')
      else {
        setPhase('text')
        setVisibleText(latestResult.current)
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [status, text, runId, reduced, inView, pageVisible])

  useLayoutEffect(() => {
    if (phase === 'text' || reduced || !inView || !pageVisible) return
    const context = gsap.context(() => {
      if (phase === 'hidden') {
        // The reference holds an empty frame for about 0.6 seconds.
        gsap.delayedCall(0.6, () => {
          setVisibleText(latestResult.current)
          setPhase('drawing')
        })
        return
      }

      const erasing = phase === 'erasing'
      const duration = erasing ? 1.08 : 0.96
      const timeline = gsap.timeline({
        onComplete: () => setPhase(erasing ? 'hidden' : 'text'),
      })
      timeline.to({}, { duration }, 0)
      const letters = gsap.utils.toArray<SVGSVGElement>('.result-stroke-letter', target.current)
      letters.forEach((letter, index) => {
        const paths = Array.from(letter.querySelectorAll('path'))
        const lengths = paths.map((path) => path.getTotalLength())
        const total = lengths.reduce((sum, length) => sum + length, 0)
        const feather = letter.querySelector('feGaussianBlur')
        const progress = { value: erasing ? 0 : 1 }
        let preceding = 0
        const strokes = paths.map((path, pathIndex) => {
          const length = lengths[pathIndex]
          const start = preceding
          gsap.set(path, {
            strokeDasharray: `${length + 28} ${length + 56}`,
            strokeDashoffset: erasing ? 0 : -(length + 28),
            opacity: 1,
          })
          preceding += length
          return { path, length, start }
        })
        if (feather) gsap.set(feather, { attr: { stdDeviation: 0 } })
        timeline.to(
          progress,
          {
            value: erasing ? 1 : 0,
            duration,
            // Ease the whole letter continuously, rather than stopping at each stroke.
            ease: 'sine.inOut',
            onUpdate: () => {
              const distance = progress.value * total
              strokes.forEach(({ path, length, start }) => {
                const amount = Math.min(1, Math.max(0, (distance - start) / length))
                path.style.strokeDashoffset = String(-(length + 28) * amount)
              })
              // Feather only the moving mask edge; complete text remains sharp.
              feather?.setAttribute(
                'stdDeviation',
                String(2.2 * Math.sin(Math.PI * progress.value)),
              )
            },
          },
          (index % 4) * 0.012,
        )
      })
      // Preserve arbitrary visitor output, including symbols outside the stroke alphabet.
      const fallback = gsap.utils.toArray<HTMLElement>('.result-fallback', target.current)
      if (fallback.length) {
        timeline.fromTo(
          fallback,
          {
            clipPath: erasing ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
          },
          {
            clipPath: erasing ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)',
            duration,
            ease: 'sine.inOut',
          },
          0,
        )
      }
    }, target)
    return () => context.revert()
  }, [phase, visibleText, reduced, inView, pageVisible])

  return (
    <span
      ref={target}
      className="hero-code-result animated-result"
      data-phase={phase}
      data-status={status}
      data-animation="gsap-stroke"
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {status === 'running' ? 'Running code.' : visibleText}
      </span>
      <span className="result-words" aria-hidden="true">
        {visibleText.split(' ').map((word, wordIndex) => (
          <span className="result-word" key={wordIndex + ':' + word}>
            {Array.from(word).map((letter, index) => {
              const glyph = strokeGlyphs[letter]
              const maskId = `${maskPrefix}-${wordIndex}-${index}`
              return (
                <span className={`result-glyph${glyph ? ' result-vector-glyph' : ''}`} key={index}>
                  <span
                    className={glyph ? 'result-letter' : 'result-letter result-fallback'}
                    style={
                      glyph ? ({ '--glyph-mask': `url("#${maskId}")` } as CSSProperties) : undefined
                    }
                  >
                    {letter}
                  </span>
                  {glyph && (
                    <svg className="result-stroke-letter" width="0" height="0" focusable="false">
                      <defs>
                        <filter
                          id={`${maskId}-soft`}
                          filterUnits="userSpaceOnUse"
                          x="-60"
                          y="-60"
                          width={glyph.width + 120}
                          height="220"
                          colorInterpolationFilters="sRGB"
                        >
                          <feGaussianBlur stdDeviation="0" />
                        </filter>
                        <mask
                          id={maskId}
                          x="0"
                          y="0"
                          width="1"
                          height="1"
                          maskUnits="objectBoundingBox"
                          maskContentUnits="objectBoundingBox"
                        >
                          <g
                            transform={`scale(${1 / glyph.width} 0.01)`}
                            fill="none"
                            stroke="white"
                            strokeWidth="48"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter={`url(#${maskId}-soft)`}
                          >
                            {glyph.strokes.map((path, strokeIndex) => (
                              <path key={strokeIndex} d={path} />
                            ))}
                          </g>
                        </mask>
                      </defs>
                    </svg>
                  )}
                </span>
              )
            })}{' '}
          </span>
        ))}
      </span>
    </span>
  )
}
