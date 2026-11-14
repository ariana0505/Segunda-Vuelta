import { useState } from 'react'
import { DEMO_USER_ID } from './data/demo'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CatalogView } from './features/catalog/CatalogView'
import { ListingDetail } from './features/listings/ListingDetail'
import { MyListingsView } from './features/listings/MyListingsView'
import { PublishForm } from './features/publish/PublishForm'
import { RequestsView } from './features/requests/RequestsView'
import { useDemoMarketplace } from './hooks/useDemoMarketplace'
import type { View } from './types'

export default function App() {
  const marketplace = useDemoMarketplace()
  const [view, setView] = useState<View>('catalog')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null)
  const selected = marketplace.listings.find((item) => item.id === selectedId)
  const ownAvailable = marketplace.listings.filter((item) => item.ownerId === DEMO_USER_ID && item.status === 'disponible')
  const pendingCount = marketplace.requests.filter((item) =>
    item.status === 'pendiente' && marketplace.listings.find((listing) => listing.id === item.listingId)?.ownerId === DEMO_USER_ID,
  ).length

  function navigate(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openListing(id: string) {
    setSelectedId(id)
    navigate('detail')
  }

  function showMessage(message: string, kind: 'success' | 'error' = 'success') {
    setToast({ message, kind })
    window.setTimeout(() => setToast(null), 5000)
  }

  function handleResult(result: { ok: boolean; message: string }) {
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <div className="app-shell">
      <div className="demo-banner"><span className="demo-dot" /> DEMO INTERACTIVA <span className="banner-divider">·</span> Los datos son de ejemplo y se reinician al recargar.</div>
      <Header view={view} onNavigate={navigate} pendingCount={pendingCount} />
      {view === 'catalog' && <CatalogView listings={marketplace.listings} onOpen={openListing} onPublish={() => navigate('publish')} />}
      {view === 'detail' && selected && <ListingDetail key={selected.id} listing={selected} ownListings={ownAvailable} alreadyRequested={marketplace.requests.some((request) => request.listingId === selected.id && request.requesterId === DEMO_USER_ID && request.status !== 'rechazada')} onBack={() => navigate('catalog')} onMyListings={() => navigate('my-listings')} onRequest={marketplace.createRequest} onSuccess={(message) => { showMessage(message); navigate('requests') }} onError={(message) => showMessage(message, 'error')} />}
      {view === 'publish' && <PublishForm onPublish={marketplace.createListing} onSuccess={(message) => { showMessage(message); navigate('my-listings') }} onError={(message) => showMessage(message, 'error')} />}
      {view === 'my-listings' && <MyListingsView listings={marketplace.listings} requests={marketplace.requests} onPublish={() => navigate('publish')} onOpen={openListing} onRequests={() => navigate('requests')} onAccept={marketplace.acceptRequest} onReject={marketplace.rejectRequest} onRepost={marketplace.repostListing} onMessage={handleResult} />}
      {view === 'requests' && <RequestsView requests={marketplace.requests} listings={marketplace.listings} onBrowse={() => navigate('catalog')} onMyListings={() => navigate('my-listings')} onMessage={handleResult} onSimulateAccept={(id) => marketplace.acceptRequest(id, '988 234 567', true)} onMarkAgreement={marketplace.markAgreement} />}
      <Footer />
      {toast && <div className={`toast ${toast.kind}`} role="status">{toast.message}<button onClick={() => setToast(null)} aria-label="Cerrar aviso">×</button></div>}
    </div>
  )
}
