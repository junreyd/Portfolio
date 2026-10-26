import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Blocks, Braces, Cable, Code2, Database, Layers, Network, Zap } from 'lucide-react'
import { universeStars, workflowTechnologies } from '../../data/workflowVisual'
import { CodePlayground } from './CodePlayground'
import type { PlaygroundPresentation } from '../../types/playground'

const icons = {
  blocks: Blocks,
  braces: Braces,
  cable: Cable,
  code: Code2,
  database: Database,
  layers: Layers,
  network: Network,
  zap: Zap,
}
export function WorkflowVisual({
  onPresentation,
}: {
  onPresentation: (value: PlaygroundPresentation) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useReducedMotion()
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const running = inView && pageVisible && !reduced
  // Keep floating-label animations independent of every typed character.
  const technologyNodes = useMemo(
    () =>
      workflowTechnologies.map((technology, index) => {
        const Icon = icons[technology.icon]
        return (
          <motion.div
            key={technology.name}
            className={`app-node node-${technology.position}`}
            animate={
              running
                ? {
                    y: [0, -5, 0],
                    rotate: [technology.angle, technology.angle + 1.5, technology.angle],
                  }
                : { y: 0, rotate: technology.angle }
            }
            transition={
              running
                ? {
                    duration: 5 + index * 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.22,
                  }
                : { duration: reduced ? 0 : 0.3 }
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{technology.name}</span>
          </motion.div>
        )
      }),
    [running, reduced],
  )
  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return (
    <div ref={ref} className="workflow-visual" data-running={running}>
      <p className="sr-only">
        Animated illustration of business-focused code: automate repetitive tasks, connect Microsoft
        365 systems, and give teams more time for meaningful work. Technology labels surround the
        editor, with an orbital universe behind it.
      </p>
      <div className="visual-grid" aria-hidden="true" />
      <div className="visual-universe" aria-hidden="true">
        <div className="universe-halo" />
        {universeStars.map((star, index) => (
          <i
            key={index}
            className="universe-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
        {[1, 2, 3].map((orbit) => (
          <div key={orbit} className={`orbit-plane orbit-plane-${orbit}`}>
            <div className="orbit-track">
              <span className="orbit-planet" />
              <span className="orbit-moon" />
            </div>
          </div>
        ))}
        <div className="universe-boundary" />
      </div>
      {technologyNodes}
      <CodePlayground
        running={running}
        reduced={Boolean(reduced)}
        onPresentation={onPresentation}
      />
    </div>
  )
}
