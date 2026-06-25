import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import AuthModal from './components/AuthModal';
import LeitorTab from './tabs/LeitorTab';
import BuscarTab from './tabs/BuscarTab';
import RecorrentesTab from './tabs/RecorrentesTab';
import HistoricoTab from './tabs/HistoricoTab';
import MesclagensTab from './tabs/MesclagensTab';
import { authMe, clearToken, getToken } from './lib/api';
import './App.css';

// Ordem das abas para navegação por swipe (deve refletir a ordem visual em TabNav).
const TAB_ORDER = ['leitor', 'buscar', 'recorrentes', 'historico', 'mesclagens'];
const SWIPE_THRESHOLD = 60; // pixels mínimos para considerar um swipe válido
const SWIPE_MAX_VERTICAL = 60; // tolerância vertical para não confundir com scroll

export default function App() {
  const [activeTab, setActiveTab] = useState('leitor');
  const [auth, setAuth] = useState({ loggedIn: false, username: '', checked: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [jumpToProduct, setJumpToProduct] = useState(null);
  const touchStart = useRef(null);

  useEffect(() => {
    async function checkAuth() {
      if (!getToken()) {
        setAuth({ loggedIn: false, username: '', checked: true });
        return;
      }
      try {
        const data = await authMe();
        if (data.loggedIn) {
          setAuth({ loggedIn: true, username: data.user.username, checked: true });
        } else {
          clearToken();
          setAuth({ loggedIn: false, username: '', checked: true });
        }
      } catch {
        setAuth({ loggedIn: false, username: '', checked: true });
      }
    }
    checkAuth();
  }, []);

  function handleAuthenticated(username) {
    setAuth({ loggedIn: true, username, checked: true });
    setShowAuthModal(false);
  }

  function handleLogout() {
    clearToken();
    setAuth({ loggedIn: false, username: '', checked: true });
    if (activeTab === 'mesclagens') setActiveTab('buscar');
  }

  function handleVerProdutoRecorrente(descricao) {
    setJumpToProduct(descricao);
    setActiveTab('buscar');
  }

  // Lista de abas visíveis na ordem atual (depende de estar logado ou não,
  // pois "mesclagens" só aparece para usuários autenticados).
  function visibleTabs() {
    return TAB_ORDER.filter((id) => id !== 'mesclagens' || auth.loggedIn);
  }

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_MAX_VERTICAL) return;

    const tabs = visibleTabs();
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex === -1) return;

    if (dx < 0 && currentIndex < tabs.length - 1) {
      // Swipe para a esquerda → próxima aba
      setActiveTab(tabs[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      // Swipe para a direita → aba anterior
      setActiveTab(tabs[currentIndex - 1]);
    }
  }

  return (
    <div
      className={`app ${auth.loggedIn ? 'autenticado' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header auth={auth} onOpenLogin={() => setShowAuthModal(true)} onLogout={handleLogout} />

      <TabNav active={activeTab} onChange={setActiveTab} isLoggedIn={auth.loggedIn} />

      <div className="tab-content" key={activeTab}>
        {activeTab === 'leitor' && <LeitorTab />}
        {activeTab === 'buscar' && (
          <BuscarTab
            isLoggedIn={auth.loggedIn}
            jumpToProduct={jumpToProduct}
            onJumpConsumed={() => setJumpToProduct(null)}
          />
        )}
        {activeTab === 'recorrentes' && <RecorrentesTab onVerProduto={handleVerProdutoRecorrente} />}
        {activeTab === 'historico' && <HistoricoTab />}
        {activeTab === 'mesclagens' && auth.loggedIn && <MesclagensTab />}
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onAuthenticated={handleAuthenticated} />
      )}
    </div>
  );
}
