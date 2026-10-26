import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { PlaygroundPresentation } from '../../types/playground'

export function MeteorName({
  name,
  presentation,
}: {
  name: string
  presentation: PlaygroundPresentation
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 1 })
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(!document.hidden)
  const [launchId, setLaunchId] = useState<number | null>(null)
  const launchedRun = useRef<number | null>(null)
  const enabled = inView && visible && !reduced
  const { status, runId } = presentation
  const letters = Array.from(name)

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!enabled || (status !== 'success' && status !== 'error') || launchedRun.current === runId)
      return
    const timer = window.setTimeout(() => {
      launchedRun.current = runId
      setLaunchId(runId)
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [enabled, status, runId])

  return (
    <span
      ref={ref}
      className="meteor-name"
      data-animate={enabled && launchId !== null}
      data-launch={launchId ?? undefined}
    >
      <span className="sr-only">{name}</span>
      <span className="meteor-name-letters" aria-hidden="true" key={launchId}>
        {letters.map((letter, index) => (
          <span className="name-letter-anchor" key={index}>
            <span
              className="name-letter"
              style={
                { '--letter-delay': `${(letters.length - 1 - index) * 0.045}s` } as CSSProperties
              }
            >
              {letter}
            </span>
            {index === letters.length - 1 && (
              <span className="name-meteor-impact">
                <i className="name-meteor" />
                <i className="name-impact-ring" />
                {[0, 1, 2, 3].map((spark) => (
                  <i className={`name-impact-spark name-spark-${spark}`} key={spark} />
                ))}
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  )
}
