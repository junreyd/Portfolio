import type { SkillGroup } from '../types/portfolio'
export const skills: SkillGroup[] = [
  {
    id: 'microsoft',
    title: 'Microsoft ecosystem',
    description: 'Business tools, connected.',
    icon: 'microsoft',
    skills: [
      'SharePoint Online',
      'SharePoint Server',
      'SPFx',
      'Power Apps',
      'Power Automate',
      'Dataverse',
      'Microsoft 365',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend development',
    description: 'Interfaces with intention.',
    icon: 'frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    id: 'integration',
    title: 'Integration & development',
    description: 'Systems that work together.',
    icon: 'integration',
    skills: ['REST APIs', 'Microsoft Graph', 'Git', 'GitHub', 'Power Platform integrations'],
  },
  {
    id: 'platforms',
    title: 'Exploring new platforms',
    description: 'Always building on what I know.',
    icon: 'platforms',
    skills: ['ERPNext', 'Frappe HR'],
  },
]
