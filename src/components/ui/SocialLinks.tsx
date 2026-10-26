import { ArrowUpRight } from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { personal } from '../../data/personal'
export function SocialLinks({ labels = false }: { labels?: boolean }) {
  return (
    <div className="social-links">
      {[
        { name: 'GitHub', url: personal.github, Icon: Github },
        { name: 'LinkedIn', url: personal.linkedin, Icon: Linkedin },
      ].map(({ name, url, Icon }) =>
        url ? (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} profile (opens in new tab)`}
          >
            <Icon size={18} />
            {labels && (
              <>
                {name}
                <ArrowUpRight size={14} />
              </>
            )}
          </a>
        ) : (
          <span
            key={name}
            className="social-placeholder"
            title={`${name} profile link will be added`}
          >
            <Icon size={18} />
            <span>
              {labels ? (
                `${name} · link coming soon`
              ) : (
                <span className="sr-only">{name} profile link coming soon</span>
              )}
            </span>
          </span>
        ),
      )}
    </div>
  )
}
