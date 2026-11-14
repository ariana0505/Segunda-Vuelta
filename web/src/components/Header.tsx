import type { View } from '../types'
import { Icon } from './Icons'

interface Props {
  view: View
  onNavigate: (view: View) => void
  pendingCount: number
}

export function Header({ view, onNavigate, pendingCount }: Props) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => onNavigate('catalog')} aria-label="Segunda Vuelta, ir al inicio">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>segunda<span className="brand-serif">vuelta</span><span className="brand-dot">.</span></span>
        </button>
        <nav className="main-nav" aria-label="Navegación principal">
          <button className={view === 'catalog' || view === 'detail' ? 'active' : ''} onClick={() => onNavigate('catalog')}>Explorar</button>
          <button className={view === 'my-listings' ? 'active' : ''} onClick={() => onNavigate('my-listings')}>Mis prendas</button>
          <button className={view === 'requests' ? 'active' : ''} onClick={() => onNavigate('requests')}>
            Solicitudes {pendingCount > 0 && <span className="nav-count">{pendingCount}</span>}
          </button>
        </nav>
        <div className="header-actions">
          <span className="demo-user" title="Cuenta de prueba">A</span>
          <button className="button button-dark header-publish" onClick={() => onNavigate('publish')}><Icon name="plus" size={17} /> Publicar prenda</button>
        </div>
      </div>
    </header>
  )
}
