const Card = ({ title, subtitle, actions, children, className = '' }) => {
  return (
    <article
      className={[
        'surface-card p-4 soft-enter sm:p-5',
        className,
      ].join(' ')}
    >
      {(title || subtitle || actions) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h2 className="font-display text-[1.25rem] leading-tight text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </article>
  )
}

export default Card
