import { useEffect, useRef } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import type { Project } from '../../types/portfolio'
import { ProjectGallery } from './ProjectGallery'
import { ButtonLink } from './Button'
export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!project || !dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [project])
  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose()
        }
      }}
    >
      {project && (
        <>
          <div className="dialog-toolbar">
            <span>{project.title}</span>
            <button
              className="icon-button dialog-close"
              onClick={onClose}
              aria-label="Close project details"
            >
              <X size={22} />
            </button>
          </div>
          <ProjectGallery project={project} key={project.id} />
          <div className="dialog-body">
            <p className="eyebrow">
              {project.category} / {project.status}
            </p>
            <h2 id="project-dialog-title">{project.title}</h2>
            <div className="badges">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <p className="dialog-role">
              <strong>My role</strong> {project.role}
            </p>
            {[
              { title: 'Overview', content: project.overview },
              { title: 'Business problem', content: project.problem },
              { title: 'My contribution', content: project.contribution },
            ].map((section) => (
              <div className="case-section" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
            <div className="case-section">
              <h3>Features</h3>
              <ul>
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            {project.architecture && (
              <div className="case-section project-architecture">
                <h3>How it works</h3>
                <ol>
                  {project.architecture.map((step) => (
                    <li key={step.title}>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="case-section">
              <h3>Outcome</h3>
              <p>{project.outcome}</p>
            </div>
            <div className="dialog-links">
              {project.githubUrl && (
                <ButtonLink
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  GitHub <ArrowUpRight size={16} />
                </ButtonLink>
              )}
              {project.demoUrl && (
                <ButtonLink href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Live demo <ArrowUpRight size={16} />
                </ButtonLink>
              )}
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}
