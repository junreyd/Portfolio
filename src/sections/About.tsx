import { ArrowUpRight, Check } from 'lucide-react'
import { personal } from '../data/personal'
import { assetUrl } from '../lib/utils'
import { Container } from '../components/layout/Container'
import { FadeIn } from '../components/animations/FadeIn'
import { SectionHeading } from '../components/ui/SectionHeading'
export function About() {
  return (
    <section id="about" className="section about-showcase">
      <Container>
        <div className="about-grid about-showcase-grid">
          <FadeIn className="about-copy">
            <SectionHeading
              number="01"
              eyebrow="A LITTLE ABOUT ME"
              title="A developer with a business mindset."
            />
            {personal.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="principles">
              {personal.principles.map((item) => (
                <span key={item}>
                  <Check size={15} />
                  {item}
                </span>
              ))}
            </div>
            <a className="inline-link" href="#experience">
              Explore my experience <ArrowUpRight size={17} />
            </a>
          </FadeIn>
          <FadeIn className="about-portrait-frame">
            <figure className="about-portrait-stage">
              {personal.photo ? (
                <img
                  className="about-portrait-photo"
                  src={assetUrl(personal.photo)}
                  alt={personal.photoAlt}
                  width={1136}
                  height={1384}
                  loading="lazy"
                />
              ) : (
                <div
                  className="about-portrait-monogram"
                  role="img"
                  aria-label="Junrey Ducay monogram"
                >
                  JD<span>.</span>
                </div>
              )}
              <figcaption className="about-portrait-caption">
                <div>
                  <strong>{personal.name}</strong>
                  <span>Turning business needs into working solutions.</span>
                </div>
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
