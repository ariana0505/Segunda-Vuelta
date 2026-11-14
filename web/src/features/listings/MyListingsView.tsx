import { useState, type FormEvent } from 'react'
import { DEMO_USER_ID } from '../../data/demo'
import type { ClothingRequest, Listing } from '../../types'
import { Icon } from '../../components/Icons'

type Result = { ok: boolean; message: string }
interface Props {
  listings: Listing[]
  requests: ClothingRequest[]
  onPublish: () => void
  onOpen: (id: string) => void
  onRequests: () => void
  onAccept: (id: string, phone: string) => Result
  onReject: (id: string) => Result
  onRepost: (id: string) => Result
  onMessage: (result: Result) => void
}

export function MyListingsView({ listings, requests, onPublish, onOpen, onRequests, onAccept, onReject, onRepost, onMessage }: Props) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const mine = listings.filter((item) => item.ownerId === DEMO_USER_ID)

  function accept(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    if (phone.replace(/\D/g, '').length < 8) {
      onMessage({ ok: false, message: 'Escribe un número de contacto válido.' })
      return
    }
    const result = onAccept(id, phone.trim())
    onMessage(result)
    if (result.ok) { setAcceptingId(null); setPhone('') }
  }

  return (
    <main className="shell dashboard-page">
      <div className="page-heading dashboard-heading">
        <div><p className="page-context">Tu espacio</p><h1>Mis prendas</h1><p>Cuida cada prenda desde que la publicas hasta que acuerdas un encuentro.</p></div>
        <button className="button button-coral" onClick={onPublish}><Icon name="plus" size={18} /> Publicar otra prenda</button>
      </div>
      {mine.length === 0 ? <div className="empty-state"><h2>Aún no has publicado prendas</h2><p>Empieza con esa pieza que está lista para otra historia.</p><button className="button button-dark" onClick={onPublish}>Publicar prenda</button></div> : (
        <div className="dashboard-list">
          {mine.map((listing) => {
            const related = requests.filter((item) => item.listingId === listing.id)
            const pending = related.filter((item) => item.status === 'pendiente')
            return (
              <article className="dashboard-card" key={listing.id}>
                <button className="dashboard-photo" onClick={() => onOpen(listing.id)} aria-label={`Ver ${listing.title}`}><img src={listing.image} alt={listing.title} /></button>
                <div className="dashboard-card-body">
                  <div className="dashboard-card-top"><div><span className={`status-badge status-${listing.status}`}>{listing.status === 'disponible' ? 'Disponible' : listing.status === 'reservada' ? 'Reservada' : 'Cerrada'}</span><h2>{listing.title}</h2><p>{listing.mode === 'donacion' ? 'Donación' : 'Intercambio'} · Talla {listing.size} · {listing.zone}</p></div><button className="subtle-link" onClick={() => onOpen(listing.id)}>Ver publicación <Icon name="arrow" size={16} /></button></div>
                  {pending.length > 0 ? <div className="incoming-list">
                    <strong>{pending.length} {pending.length === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}</strong>
                    {pending.map((request) => <div className="incoming-request" key={request.id}>
                      <div><span className="request-avatar">{request.requesterName[0]}</span><div><strong>{request.requesterName} quiere {listing.mode === 'donacion' ? 'recibirla' : 'intercambiar'}</strong><p>{request.message}</p>{request.offeredListingId && <small>Ofrece: {listings.find((item) => item.id === request.offeredListingId)?.title}</small>}</div></div>
                      {acceptingId === request.id ? <form className="accept-form" onSubmit={(event) => accept(event, request.id)}><label>Tu número de contacto<input type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Ej. 999 123 456" /></label><span>Se compartirá solo al aceptar.</span><div><button className="button button-dark" type="submit">Aceptar</button><button className="text-link" type="button" onClick={() => setAcceptingId(null)}>Volver</button></div></form> : <div className="request-actions"><button className="button button-dark" onClick={() => setAcceptingId(request.id)}>Aceptar solicitud</button><button className="button button-quiet" onClick={() => onMessage(onReject(request.id))}>Rechazar</button></div>}
                    </div>)}
                  </div> : related.some((item) => item.status === 'aceptada' || item.status === 'encuentro_acordado') ? <button className="inline-notice" onClick={onRequests}>Hay un acuerdo en curso. Ver en Solicitudes <Icon name="arrow" size={16} /></button> : <p className="no-requests">Aún no tiene solicitudes.</p>}
                  {listing.status === 'reservada' && <button className="subtle-link repost-link" onClick={() => onMessage(onRepost(listing.id))}>No se coordinó · volver a publicar</button>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
