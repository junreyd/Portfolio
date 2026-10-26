import { MotionConfig } from 'motion/react'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Contact } from './sections/Contact'
export default function App() {
  const reduced = useReducedMotion()
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
