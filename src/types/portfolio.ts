export interface Experience {
  id: string
  company: string
  companyUrl?: string
  title: string
  period: string
  current?: boolean
  placeholder?: boolean
  description: string
  responsibilities: string[]
  technologies: string[]
}

export interface SkillGroup {
  id: string
  title: string
  description: string
  icon: 'microsoft' | 'frontend' | 'integration' | 'platforms'
  skills: string[]
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  technologies: string[]
  status: 'Project showcase' | 'Case study preview' | 'In progress'
  cardTechnologies?: string[]
  architecture?: { title: string; description: string }[]
  image: string
  imageAlt: string
  imageFit?: 'cover' | 'contain'
  previewInset?: { image: string; alt: string }
  gallery?: { image: string; alt: string; caption: string }[]
  role: string
  overview: string
  problem: string
  contribution: string
  features: string[]
  outcome: string
  githubUrl?: string
  demoUrl?: string
}
