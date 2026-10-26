import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import type { Project } from '../../types/portfolio'
import { assetUrl } from '../../lib/utils'

export function ProjectGallery({ project }: { project: Project }) {
  const [active, setActive] = useState(() =>
    Math.max(0, project.gallery?.findIndex((item) => item.image === project.image) ?? 0),
  )
  const [expanded, setExpanded] = useState(false)
  const images = project.gallery ?? [
    { image: project.image, alt: project.imageAlt, caption: project.title },
  ]
  const selected = images[active]
  return (
    <div className={`project-gallery ${expanded ? 'is-expanded' : ''}`}>
      <figure>
        <div className="project-gallery-stage">
          <img
            className="dialog-image"
            src={assetUrl(selected.image)}
            alt={selected.alt}
            width={1200}
            height={675}
          />
        </div>
        <figcaption>
          <span>{selected.caption}</span>
          <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {expanded ? 'Fit image' : 'Enlarge image'}
          </button>
        </figcaption>
      </figure>
      {images.length > 1 && (
        <div className="project-gallery-thumbnails" aria-label="Project screenshots">
          {images.map((item, index) => (
            <button
              key={item.image}
              onClick={() => setActive(index)}
              aria-label={`Show screenshot ${index + 1}: ${item.caption}`}
              aria-pressed={active === index}
            >
              <img src={assetUrl(item.image)} alt="" width={120} height={75} loading="lazy" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
