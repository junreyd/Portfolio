import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { reveal } from '../../lib/animations'
export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reveal}
    >
      {children}
    </motion.div>
  )
}
