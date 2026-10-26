import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { Container } from './Container'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    )
    navigation.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])
  return (
    <header
      ref={headerRef}
      className="site-header"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          setOpen(false)
      }}
    >
      <Container className="header-inner">
        <a
          className="logo"
          href="#home"
          aria-label="Junrey Ducay, home"
          onClick={() => setOpen(false)}
        >
          JD<span>.</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={active === item.id ? 'active' : ''}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="header-contact" href="#contact" onClick={() => setOpen(false)}>
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            ref={toggleRef}
            className="icon-button menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.24 }}
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
