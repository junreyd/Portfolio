import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, Phone } from 'lucide-react'
import { personal } from '../data/personal'
import { Container } from '../components/layout/Container'
import { FadeIn } from '../components/animations/FadeIn'
import { Button } from '../components/ui/Button'
import { SocialLinks } from '../components/ui/SocialLinks'
export function Contact() {
  const [copyStatus, setCopyStatus] = useState('')
  const copyEmail = async () => {
    if (!personal.email) return
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopyStatus('Email copied to clipboard.')
    } catch {
      setCopyStatus('Could not copy. Please select and copy the email address.')
    }
  }
  return (
    <section id="contact" className="section contact-section">
      <Container>
        <FadeIn className="contact-panel">
          <div className="contact-glow" aria-hidden="true" />
          <div className="contact-copy">
            <p className="eyebrow">
              <span>05</span> / LET’S CONNECT
            </p>
            <h2>
              Good solutions start
              <br />
              with a <span className="gradient-text">conversation.</span>
            </h2>
            <p>{personal.contactIntroduction}</p>
          </div>
          <div className="contact-links">
            <div className="contact-methods">
              <div className="email-card">
                <span className="contact-label">
                  <Mail size={17} /> EMAIL ME
                </span>
                {personal.email ? (
                  <a className="email-link" href={`mailto:${personal.email}`}>
                    {personal.email}
                    <ArrowUpRight size={21} />
                  </a>
                ) : (
                  <p className="email-placeholder">Email address coming soon</p>
                )}
                <Button variant="text" onClick={copyEmail} disabled={!personal.email}>
                  {copyStatus === 'Email copied to clipboard.' ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}{' '}
                  Copy email
                </Button>
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
              </div>
              <div className="phone-card">
                <span className="contact-label">
                  <Phone size={17} /> CALL ME
                </span>
                <a className="phone-link" href={`tel:${personal.phone.replace(/[^\d+]/g, '')}`}>
                  {personal.phone}
                </a>
              </div>
            </div>
            <div className="contact-social">
              <span className="contact-label">ELSEWHERE ON THE WEB</span>
              <SocialLinks labels />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
