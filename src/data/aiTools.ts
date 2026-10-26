export interface AITool {
  id: string
  name: string
  logo: string
}

export const aiTools: AITool[] = [
  { id: 'chatgpt', name: 'ChatGPT', logo: 'openai.svg' },
  { id: 'gemini', name: 'Google Gemini', logo: 'gemini-color.svg' },
  { id: 'claude', name: 'Claude', logo: 'claude-color.svg' },
  { id: 'deepseek', name: 'DeepSeek', logo: 'deepseek-color.svg' },
  { id: 'microsoft-copilot', name: 'Microsoft Copilot', logo: 'copilot-color.svg' },
  { id: 'meta-ai', name: 'Meta AI', logo: 'metaai-color.svg' },
  { id: 'grok', name: 'Grok', logo: 'grok.svg' },
  { id: 'perplexity', name: 'Perplexity AI', logo: 'perplexity-color.svg' },
  { id: 'midjourney', name: 'Midjourney', logo: 'midjourney.svg' },
  { id: 'dall-e-3', name: 'DALL-E 3', logo: 'dalle-color.svg' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', logo: 'stability-color.svg' },
  { id: 'adobe-firefly', name: 'Adobe Firefly', logo: 'adobefirefly-color.svg' },
  { id: 'canva-magic-studio', name: 'Canva Magic Studio', logo: 'canva.svg' },
  { id: 'sora', name: 'Sora', logo: 'sora-color.svg' },
  { id: 'runway', name: 'Runway', logo: 'runway.svg' },
  { id: 'heygen', name: 'HeyGen', logo: 'heygen.svg' },
  { id: 'suno', name: 'Suno', logo: 'suno.svg' },
  { id: 'elevenlabs', name: 'ElevenLabs', logo: 'elevenlabs.svg' },
  { id: 'github-copilot', name: 'GitHub Copilot', logo: 'githubcopilot.svg' },
  { id: 'v0', name: 'v0 by Vercel', logo: 'v0.svg' },
]
