import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DEMO_USER_ID } from './data/demo'
import { Layout } from './components/Layout'
import { CatalogView } from './features/catalog/CatalogView'
import { ListingDetail } from './features/listings/ListingDetail'
import { MyListingsView } from './features/listings/MyListingsView'
import { PublishForm } from './features/publish/PublishForm'
import { RequestsView } from './features/requests/RequestsView'
import { useDemoMarketplace } from './hooks/useDemoMarketplace'
import type { View } from './types'

export default function App() {
  const marketplace = useDemoMarketplace()
  const location = useLocation()
  const go = useNavigate()
  const firstRender = useRef(true)
  const paths: Record<Exclude<View, 'detail'>, string> = { catalog: '/', publish: '/publicar', 'my-listings': '/mis-prendas', requests: '/solicitudes' }
  const selectedId = location.pathname.startsWith('/prenda/') ? decodeURIComponent(location.pathname.slice('/prenda/'.length)) : null
  const unknownPath = !selectedId && !Object.values(paths).includes(location.pathname)
  const view: View = selectedId ? 'detail' : (Object.entries(paths).find(([, path]) => path === location.pathname)?.[0] as View | undefined) ?? 'catalog'
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null)
  const selected = marketplace.listings.find((item) => item.id === selectedId)
  const ownAvailable = marketplace.listings.filter((item) => item.ownerId === DEMO_USER_ID && item.status === 'disponible')
  const pendingCount = marketplace.requests.filter((item) =>
    item.status === 'pendiente' && marketplace.listings.find((listing) => listing.id === item.listingId)?.ownerId === DEMO_USER_ID,
  ).length

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const main = document.querySelector('main')
    if (main) {
      main.tabIndex = -1
      main.focus({ preventScroll: true })
    }
  }, [location.pathname])

  function navigate(next: View) {
    if (next !== 'detail') go(paths[next])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openListing(id: string) {
    go(`/prenda/${encodeURIComponent(id)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showMessage(message: string, kind: 'success' | 'error' = 'success') {
    setToast({ message, kind })
    window.setTimeout(() => setToast(null), 5000)
  }

  function handleResult(result: { ok: boolean; message: string }) {
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <Layout view={view} onNavigate={navigate} pendingCount={pendingCount}>
      {unknownPath && <main className="shell empty-state"><h1>No encontramos esta página</h1><button className="button button-dark" onClick={() => navigate('catalog')}>Volver al catálogo</button></main>}
      {!unknownPath && view === 'catalog' && <CatalogView listings={marketplace.listings} onOpen={openListing} onPublish={() => navigate('publish')} />}
      {view === 'detail' && selected && <ListingDetail key={selected.id} listing={selected} ownListings={ownAvailable} alreadyRequested={marketplace.requests.some((request) => request.listingId === selected.id && request.requesterId === DEMO_USER_ID && request.status !== 'rechazada')} onBack={() => navigate('catalog')} onMyListings={() => navigate('my-listings')} onRequest={marketplace.createRequest} onSuccess={(message) => { showMessage(message); navigate('requests') }} onError={(message) => showMessage(message, 'error')} />}
      {view === 'detail' && !selected && <main className="shell empty-state"><h1>No encontramos esta prenda</h1><p>Es posible que ya no esté disponible.</p><button className="button button-dark" onClick={() => navigate('catalog')}>Volver al catálogo</button></main>}
      {view === 'publish' && <PublishForm onPublish={marketplace.createListing} onSuccess={(message) => { showMessage(message); navigate('my-listings') }} onError={(message) => showMessage(message, 'error')} />}
      {view === 'my-listings' && <MyListingsView listings={marketplace.listings} requests={marketplace.requests} onPublish={() => navigate('publish')} onOpen={openListing} onRequests={() => navigate('requests')} onAccept={marketplace.acceptRequest} onReject={marketplace.rejectRequest} onRepost={marketplace.repostListing} onMessage={handleResult} />}
      {view === 'requests' && <RequestsView requests={marketplace.requests} listings={marketplace.listings} onBrowse={() => navigate('catalog')} onMyListings={() => navigate('my-listings')} onMessage={handleResult} onSimulateAccept={(id) => marketplace.acceptRequest(id, '988 234 567', true)} onMarkAgreement={marketplace.markAgreement} />}
      {toast && <div className={`toast ${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'}>{toast.message}<button onClick={() => setToast(null)} aria-label="Cerrar aviso">×</button></div>}
    </Layout>
  )
}
