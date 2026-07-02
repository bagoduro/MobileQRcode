import { feedback } from '../lib/feedback';

const TABS = [
  { id: 'leitor', label: 'Ler nota', icon: 'ti-qrcode', tone: 'leitor' },
  { id: 'buscar', label: 'Buscar', icon: 'ti-search', tone: 'buscar' },
  { id: 'recorrentes', label: 'Frequentes', icon: 'ti-repeat', tone: 'recorrentes' },
  { id: 'historico', label: 'Compras', icon: 'ti-receipt', tone: 'historico' },
  { id: 'mesclagens', label: 'Mesclagens', icon: 'ti-git-merge', tone: 'mesclagens', somenteLogado: true },
];

export default function TabNav({ active, onChange, isLoggedIn }) {
  const tabs = TABS.filter((tab) => !tab.somenteLogado || isLoggedIn);

  function handleClick(tabId) {
    if (tabId !== active) feedback.tap();
    onChange(tabId);
  }

  return (
    <nav className="dock" role="tablist" aria-label="Navegação principal">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={`dock-item ${isActive ? 'is-active' : ''}`}
            data-tone={tab.tone}
            onClick={() => handleClick(tab.id)}
          >
            <span className="dock-bubble">
              <i className={`ti ${tab.icon}`} aria-hidden="true" />
            </span>
            <span className="dock-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
