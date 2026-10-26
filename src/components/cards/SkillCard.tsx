import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Blocks, Braces, Cable, PanelsTopLeft } from 'lucide-react'
import type { SkillGroup } from '../../types/portfolio'
import { reveal } from '../../lib/animations'
const icons = { microsoft: Blocks, frontend: Braces, integration: Cable, platforms: PanelsTopLeft }
export function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const Icon = icons[group.icon]
  const reduced = useReducedMotion()
  return (
    <motion.article
      variants={reveal}
      className="skill-card"
      whileHover={reduced ? undefined : { y: -4 }}
    >
      <div className={`skill-icon skill-icon-${group.id}`}>
        <Icon size={23} />
      </div>
      <span className="skill-number">0{index + 1}</span>
      <h3>{group.title}</h3>
      <p>{group.description}</p>
      <div className="badges">
        {group.skills.map((skill) => (
          <motion.span key={skill} whileHover={reduced ? undefined : { y: -2 }}>
            {skill}
          </motion.span>
        ))}
      </div>
      {group.id === 'platforms' && (
        <span className="learning-label">
          <span className="status-dot" /> Currently expanding my skills
        </span>
      )}
    </motion.article>
  )
}
