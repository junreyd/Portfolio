import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react'
import type { Experience } from '../../types/portfolio'
export function ExperienceCard({ item }: { item: Experience }) {
  return (
    <article
      id={`experience-${item.id}`}
      data-experience-id={item.id}
      className={`experience-card ${item.placeholder ? 'experience-placeholder' : ''}`}
    >
      <div className="timeline-icon">
        <BriefcaseBusiness size={18} />
      </div>
      <div className="experience-date">
        {item.period}
        {item.current && <span className="tag current-tag">CURRENT ROLE</span>}
      </div>
      <h3>{item.title}</h3>
      <p className="company">
        {item.companyUrl ? (
          <a href={item.companyUrl} target="_blank" rel="noreferrer">
            {item.company}
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          item.company
        )}
      </p>
      <p className="experience-description">{item.description}</p>
      {item.responsibilities.length > 0 && (
        <ul>
          {item.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <div className="badges">
        {item.technologies.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </article>
  )
}
