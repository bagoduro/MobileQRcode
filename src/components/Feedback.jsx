export function Loading({ text }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-icon" aria-hidden="true">
        <i className={`ti ${icon}`} />
      </span>
      <p>{text}</p>
    </div>
  );
}

export function Alert({ children, tone = 'danger' }) {
  const icon = tone === 'success' ? 'ti-check' : tone === 'info' ? 'ti-info-circle' : 'ti-alert-circle';
  const role = tone === 'danger' ? 'alert' : 'status';
  return (
    <div className={`alert alert-${tone}`} role={role} aria-live={tone === 'danger' ? 'assertive' : 'polite'}>
      <i className={`ti ${icon}`} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
