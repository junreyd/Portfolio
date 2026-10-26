import { motion } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useState } from 'react'
import type { PlaygroundPresentation } from '../types/playground'
import { ArrowDown, ArrowUpRight, Download, MoveRight } from 'lucide-react'
import { personal } from '../data/personal'
import { reveal } from '../lib/animations'
import { assetUrl } from '../lib/utils'
import { Container } from '../components/layout/Container'
import { StaggerContainer } from '../components/animations/StaggerContainer'
import { ButtonLink } from '../components/ui/Button'
import { SocialLinks } from '../components/ui/SocialLinks'
import { WorkflowVisual } from '../components/ui/WorkflowVisual'
import { HeroUniverse } from '../components/ui/HeroUniverse'
import { AnimatedResult } from '../components/ui/AnimatedResult'
import { MeteorName } from '../components/ui/MeteorName'
import { TechnologyCarousel } from '../components/ui/TechnologyCarousel'

export function Hero() {
  const reduced = useReducedMotion()
  const [codePresentation, setCodePresentation] = useState<PlaygroundPresentation>({
    status: 'writing',
    text: 'Built to make work simpler.',
    runId: 0,
  })
  return (
    <section id="home" className="hero">
      <HeroUniverse />
      <Container>
        <div className="hero-grid">
          <StaggerContainer className="hero-copy">
            <motion.p variants={reveal} className="eyebrow hero-eyebrow">
              <span className="status-dot" /> DEVELOPER · PROBLEM SOLVER · BUILDER
            </motion.p>
            <motion.p variants={reveal} className="hero-greeting">
              <span>
                Hi, I’m <MeteorName name={personal.name} presentation={codePresentation} />
              </span>
            </motion.p>
            <motion.h1 variants={reveal}>
              Business applications.
              <br />
              <AnimatedResult presentation={codePresentation} />
            </motion.h1>
            <motion.p variants={reveal} className="hero-title">
              {personal.title}
            </motion.p>
            <motion.p variants={reveal} className="hero-introduction">
              {personal.introduction}
            </motion.p>
            <motion.div variants={reveal} className="hero-buttons">
              <ButtonLink href="#projects">
                View my projects <ArrowUpRight size={18} />
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary">
                Contact me <MoveRight size={17} />
              </ButtonLink>
              <ButtonLink
                href={__CV_AVAILABLE__ ? assetUrl('resume/Junrey_Ducay_CV.pdf') : undefined}
                aria-disabled={!__CV_AVAILABLE__}
                download={__CV_AVAILABLE__ ? 'Junrey_Ducay_CV.pdf' : undefined}
                variant="text"
                className={!__CV_AVAILABLE__ ? 'cv-disabled' : ''}
                title={__CV_AVAILABLE__ ? 'Download professional CV' : 'CV will be available soon'}
              >
                <Download size={16} /> Download CV
                {!__CV_AVAILABLE__ && <span className="soon-label">soon</span>}
              </ButtonLink>
            </motion.div>
            <motion.div variants={reveal} className="hero-social">
              <SocialLinks />
              <span className="social-divider" />
              <span>Thoughtful code. Practical solutions.</span>
            </motion.div>
          </StaggerContainer>
          <motion.div
            className="hero-visual"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <WorkflowVisual onPresentation={setCodePresentation} />
          </motion.div>
        </div>
        <div className="hero-bottom">
          <div className="experience-highlight">
            <strong>
              {personal.experience}
              <span> years</span>
            </strong>{' '}
            <span>of professional experience</span>
          </div>
          <TechnologyCarousel />
          <a href="#about" className="scroll-cue" aria-label="Explore about Junrey">
            <ArrowDown size={17} />
            <span>SCROLL TO EXPLORE</span>
          </a>
        </div>
      </Container>
    </section>
  )
}
