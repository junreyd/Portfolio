import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Project } from '../../types/portfolio'
import { assetUrl } from '../../lib/utils'
export function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project
  index: number
  onSelect: (project: Project) => void
}) {
  const reduced = useReducedMotion()
  return (
    <motion.article whileHover={reduced ? undefined : { y: -5 }} className="project-card">
      <button
        className={`project-image project-image-${project.id}`}
        onClick={() => onSelect(project)}
        aria-label={`View screenshots of ${project.title}`}
      >
        <span className="project-screenshot-frame">
          <img
            src={assetUrl(project.image)}
            alt={project.imageAlt}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            style={{ objectFit: project.imageFit ?? 'cover' }}
          />
        </span>
        {project.previewInset && (
          <span className="project-mobile-preview">
            <img
              src={assetUrl(project.previewInset.image)}
              alt={project.previewInset.alt}
              width={564}
              height={998}
              loading="lazy"
              decoding="async"
            />
          </span>
        )}
        <span className="image-label">
          {project.gallery ? `${project.gallery.length} SCREENS` : 'PROJECT SCREENSHOT'}{' '}
          <ArrowUpRight size={11} />
        </span>
      </button>
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span
            className={`project-status ${project.status === 'In progress' ? 'in-progress' : ''}`}
          >
            <span />
            {project.status}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="badges">
          {(project.cardTechnologies ?? project.technologies).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="project-bottom">
          <span className="project-index">PROJECT / {String(index + 1).padStart(2, '0')}</span>
          <button
            onClick={() => onSelect(project)}
            aria-label={`View details for ${project.title}`}
          >
            View details <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
