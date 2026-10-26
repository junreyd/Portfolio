import { technologies, type Technology } from './technologies'

export const skillCategories = [
  { id: 'microsoft', name: 'Microsoft & automation' },
  { id: 'web', name: 'Web development' },
  { id: 'systems', name: 'Connected systems' },
  { id: 'tools', name: 'Developer tools' },
] as const

export type SkillCategory = (typeof skillCategories)[number]['id']
export interface OrbitSkill extends Technology {
  category: SkillCategory
  aliases?: string[]
  exploring?: boolean
  darkLogo?: string
}

const microsoft = new Set([
  'sharepoint',
  'spfx',
  'microsoft365',
  'power-platform',
  'powerapps',
  'powerfx',
  'powerautomate',
  'dataverse',
  'powerbi',
  'functions',
  'logicapps',
  'aibuilder',
  'agents',
])
const systems = new Set([
  'rest',
  'graph',
  'salesforce',
  'xero',
  'business-central',
  'erpnext',
  'frappe',
])
const tools = new Set(['pnp', 'vite'])

export const orbitSkills: OrbitSkill[] = [
  ...technologies.map((technology): OrbitSkill => ({
    ...technology,
    category: microsoft.has(technology.id)
      ? 'microsoft'
      : systems.has(technology.id)
        ? 'systems'
        : tools.has(technology.id)
          ? 'tools'
          : 'web',
    ...(technology.id === 'react' ? { aliases: ['React'] } : {}),
    ...(technology.id === 'rest' ? { aliases: ['REST APIs'] } : {}),
    ...(technology.id === 'power-platform' ? { aliases: ['Power Platform integrations'] } : {}),
    ...(['erpnext', 'frappe'].includes(technology.id) ? { exploring: true } : {}),
  })),
  {
    id: 'sharepoint-server',
    name: 'SharePoint Server',
    logo: 'sharepoint.svg',
    category: 'microsoft',
    aliases: ['SharePoint 2013'],
  },
  { id: 'outlook-addins', name: 'Outlook add-ins', logo: 'outlook.svg', category: 'microsoft' },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    logo: 'bootstrap.svg',
    category: 'web',
    aliases: ['Bootstrap 3', 'Bootstrap 4'],
  },
  { id: 'git', name: 'Git', logo: 'git.svg', category: 'tools' },
  {
    id: 'github',
    name: 'GitHub',
    logo: 'github.svg',
    darkLogo: 'github-white.svg',
    category: 'tools',
  },
]
