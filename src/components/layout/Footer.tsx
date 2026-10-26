import { ArrowUp } from 'lucide-react'
import { personal } from '../../data/personal'
import { navigation } from '../../data/navigation'
import { Container } from './Container'
import { SocialLinks } from '../ui/SocialLinks'
export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <a href="#home" className="logo" aria-label="Back to home">
            JD<span>.</span>
          </a>
          <nav aria-label="Footer navigation">
            {navigation
              .filter((item) => item.id !== 'home')
              .map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  {item.label}
                </a>
              ))}
          </nav>
          <SocialLinks />
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </p>
          <p>Built with care. Designed for real work.</p>
          <a href="#home" className="back-top">
            Back to top <ArrowUp size={15} />
          </a>
        </div>
      </Container>
    </footer>
  )
}
