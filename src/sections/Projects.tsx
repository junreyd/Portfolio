import { useState } from 'react'
import type { Project } from '../types/portfolio'
import { projects } from '../data/projects'
import { Container } from '../components/layout/Container'
import { FadeIn } from '../components/animations/FadeIn'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ProjectCarousel } from '../components/ui/ProjectCarousel'
import { ProjectDialog } from '../components/ui/ProjectDialog'
export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  return (
    <section id="projects" className="section section-tinted">
      <Container>
        <FadeIn className="projects-heading">
          <SectionHeading
            number="04"
            eyebrow="SELECTED PROJECTS"
            title="From business needs to better tools."
            description="Apps and tools I’ve built to help teams manage tasks, documents, orders, and everyday work."
          />
          <span className="project-count">
            {String(projects.length).padStart(2, '0')} <span>PROJECTS</span>
          </span>
        </FadeIn>
        <ProjectCarousel
          projects={projects}
          onSelect={setSelected}
          dialogOpen={selected !== null}
        />
      </Container>
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
