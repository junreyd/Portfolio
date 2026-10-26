import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { stagger } from '../../lib/animations'
export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
