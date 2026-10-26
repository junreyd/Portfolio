export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span> / {eyebrow}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}
