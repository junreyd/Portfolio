import type { Variants } from 'motion/react'
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}
