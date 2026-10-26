import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import './styles/profile-portrait.css'
import './styles/skills-orbit.css'
import './styles/project-carousel.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
