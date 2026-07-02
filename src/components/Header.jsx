import { IconTile } from './ui';

export default function Header({ auth, onOpenLogin, onLogout }) {
  const initials = auth.loggedIn && auth.username
    ? auth.username.trim().slice(0, 2).toUpperCase()
    : null;

  return (
    <header className="shell-header">
      <div className="shell-header-row">
        <div className="shell-header-brand">
          <IconTile icon="ti-receipt-2" tone="leitor" size="lg" />
          <div>
            <p className="shell-header-eyebrow">Histórico de compras</p>
            <h1>{auth.loggedIn ? `Olá, ${auth.username}` : 'Suas notas, organizadas'}</h1>
          </div>
        </div>

        {auth.loggedIn ? (
          <div className="shell-account">
            <span className="shell-avatar" aria-hidden="true">{initials}</span>
            <button className="shell-logout-btn" onClick={onLogout} aria-label="Sair da conta">
              <i className="ti ti-logout" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button className="btn-entrar" onClick={onOpenLogin}>
            <i className="ti ti-login" aria-hidden="true" />
            <span>Entrar</span>
          </button>
        )}
      </div>

      <p className="shell-header-tagline">
        Leia notas fiscais por QR code e compare preços entre estabelecimentos
      </p>
    </header>
  );
}
