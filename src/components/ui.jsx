/**
 * Peças de UI puramente visuais, reutilizadas em várias abas.
 * Nenhum componente aqui guarda estado de negócio ou faz chamadas de API —
 * eles só recebem dados prontos via props e renderizam.
 */

/** Selo colorido com ícone. Usado em cabeçalhos de card, listas e avatares. */
export function IconTile({ icon, tone = 'leitor', size = 'md' }) {
  return (
    <span className={`icon-tile icon-tile--${tone} icon-tile--${size}`} aria-hidden="true">
      <i className={`ti ${icon}`} />
    </span>
  );
}

/** Card com cabeçalho padronizado: selo colorido + título (+ subtítulo opcional). */
export function SectionCard({ icon, tone = 'leitor', title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`section-card ${className}`}>
      {(icon || title) && (
        <div className="section-card-header">
          {icon && <IconTile icon={icon} tone={tone} />}
          <div className="section-card-heading">
            {title && <h2>{title}</h2>}
            {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="section-card-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Linha de item (produto/nota) em formato de "chip": avatar + título/meta + valor.
 * Substitui as antigas linhas separadas por traço pontilhado.
 */
export function ListRow({ icon = 'ti-shopping-bag', tone = 'leitor', title, meta, value, valueSub, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className="list-row" onClick={onClick} type={onClick ? 'button' : undefined}>
      <IconTile icon={icon} tone={tone} size="sm" />
      <div className="list-row-body">
        <p className="list-row-title">{title}</p>
        {meta && <p className="list-row-meta">{meta}</p>}
      </div>
      {value != null && (
        <div className="list-row-value-stack">
          <span className="list-row-value">{value}</span>
          {valueSub && <span className="list-row-value-sub">{valueSub}</span>}
        </div>
      )}
    </Tag>
  );
}

/** Pequeno rótulo de estatística usado em resumos (ex: "5 notas registradas"). */
export function StatPill({ icon, children, tone = 'leitor' }) {
  return (
    <span className={`stat-pill stat-pill--${tone}`}>
      {icon && <i className={`ti ${icon}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
