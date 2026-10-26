import { numberToWords } from '../lib/numberToWords'

// Both the numeric highlight and written bio use this calendar-year count.
const experience = new Date().getFullYear() - 2018 + 1

export const personal = {
  name: 'Junrey Ducay',
  title: 'Microsoft 365 & Business Applications Developer',
  introduction:
    'I develop business applications and automation solutions using Microsoft 365, SharePoint, Power Platform, and modern web technologies. My focus is building reliable solutions that simplify everyday work.',
  experience,
  email: 'ducjunrey@gmail.com', // Add your real email to activate mailto and copy actions.
  phone: '+6395-6601-1002',
  github: 'https://github.com/junreyd', // e.g. https://github.com/YOUR_USERNAME
  linkedin: 'https://www.linkedin.com/in/junreyd', // e.g. https://www.linkedin.com/in/YOUR_PROFILE
  photo: 'images/profile/myprofile-cutout.png', // Path relative to public/; the original photo is kept alongside it.
  photoAlt: 'Professional portrait of Junrey Ducay',
  about: [
    `I’m a business applications developer with ${numberToWords(experience)} years of experience turning everyday business challenges into practical, reliable solutions. I build with Microsoft 365, SharePoint, and Power Platform to connect systems, automate workflows, and help teams work more efficiently.`,
    'My approach brings together a business mindset, thoughtful user experiences, and maintainable code. I’m expanding my work with React, ERPNext, and AI to create connected applications that reduce manual effort and give teams more time for meaningful work.',
  ],
  principles: ['Practical solutions', 'Thoughtful user experiences', 'Maintainable development'],
  contactIntroduction:
    'Have a business process to simplify or an application to bring to life? I’d welcome a conversation about your team, your goals, and how I can help.',
}
