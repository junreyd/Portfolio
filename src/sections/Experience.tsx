import { useRef } from 'react'
import { experience } from '../data/experience'
import { personal } from '../data/personal'
import { numberToWords } from '../lib/numberToWords'
import { Container } from '../components/layout/Container'
import { FadeIn } from '../components/animations/FadeIn'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ExperienceCard } from '../components/cards/ExperienceCard'
import { CareerConstellation } from '../components/ui/CareerConstellation'
export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  return (
    <section id="experience" className="section section-tinted">
      <Container className="experience-grid">
        <div className="experience-aside">
          <FadeIn>
            <SectionHeading
              number="02"
              eyebrow="THE JOURNEY SO FAR"
              title="Experience that connects the dots."
              description={`Bringing ${numberToWords(personal.experience)} years of experience in enterprise technology, business applications, and the processes behind them.`}
            />
          </FadeIn>
          <CareerConstellation items={experience} timelineRef={timelineRef} />
        </div>
        <div className="timeline" ref={timelineRef}>
          {experience.map((item) => (
            <FadeIn key={item.id}>
              <ExperienceCard item={item} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
