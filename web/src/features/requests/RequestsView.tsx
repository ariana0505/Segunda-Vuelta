import { useState } from 'react'
import { DEMO_USER_ID } from '../../data/demo'
import type { ClothingRequest, Listing } from '../../types'
import { Icon } from '../../components/Icons'

type Result = { ok: boolean; message: string }
interface Props {
  requests: ClothingRequest[]
  listings: Listing[]
  onBrowse: () => void
  onMyListings: () => void
  onMessage: (result: Result) => void
  onSimulateAccept: (id: string) => Result
  onMarkAgreement: (id: string, otherPerson?: boolean) => Result
}

export function RequestsView({ requests, listings, onBrowse, onMyListings, onMessage, onSimulateAccept, onMarkAgreement }: Props) {
  const [tab, setTab] = useState<'todas' | 'enviadas' | 'recibidas'>('todas')
  const visible = requests.filter((item) => tab === 'todas' || (tab === 'enviadas' ? item.requesterId === DEMO_USER_ID : item.requesterId !== DEMO_USER_ID))

  return (
    <main className="shell dashboard-page">
      <div className="page-heading dashboard-heading">
        <div><p className="page-context">Conversaciones que empiezan con ropa</p><h1>Mis solicitudes</h1><p>Sigue tus propuestas y vuelve aquí cuando hayan acordado un encuentro.</p></div>
      </div>
      <div className="dashboard-tabs" role="tablist" aria-label="Tipo de solicitudes">
        <button role="tab" aria-selected={tab === 'todas'} className={tab === 'todas' ? 'active' : ''} onClick={() => setTab('todas')}>Todas</button>
        <button role="tab" aria-selected={tab === 'enviadas'} className={tab === 'enviadas' ? 'active' : ''} onClick={() => setTab('enviadas')}>Enviadas</button>
        <button role="tab" aria-selected={tab === 'recibidas'} className={tab === 'recibidas' ? 'active' : ''} onClick={() => setTab('recibidas')}>Recibidas</button>
      </div>
      {visible.length === 0 ? <div className="empty-state"><h2>Todavía no hay solicitudes aquí</h2><p>Explora el catálogo y encuentra una prenda para empezar.</p><button className="button button-dark" onClick={onBrowse}>Explorar prendas</button></div> : (
        <div className="requests-list">
          {visible.map((request) => {
            const listing = listings.find((item) => item.id === request.listingId)
            if (!listing) return null
            const isOwner = listing.ownerId === DEMO_USER_ID
            const myAgreement = isOwner ? request.ownerAgreed : request.requesterAgreed
            const otherAgreement = isOwner ? request.requesterAgreed : request.ownerAgreed
            const offered = listings.find((item) => item.id === request.offeredListingId)
            const otherName = isOwner ? request.requesterName : listing.ownerName
            return <article className="request-card" key={request.id}>
              <div className="request-card-photo"><img src={listing.image} alt={listing.title} /></div>
              <div className="request-card-content">
                <div className="request-card-header"><span className={`status-badge status-${request.status}`}>{request.status === 'pendiente' ? 'Pendiente' : request.status === 'aceptada' ? 'Aceptada' : request.status === 'encuentro_acordado' ? 'Encuentro acordado' : request.status === 'sin_acuerdo' ? 'Sin acuerdo' : 'Rechazada'}</span><span>{isOwner ? 'Solicitud recibida' : 'Solicitud enviada'}</span></div>
                <h2>{listing.title}</h2>
                <p>{isOwner ? `${request.requesterName} quiere ${listing.mode === 'donacion' ? 'recibir tu prenda' : 'intercambiar contigo'}.` : `Tu solicitud para la prenda de ${listing.ownerName}.`}</p>
                {offered && <p className="offered-line">Prenda ofrecida: <strong>{offered.title}</strong></p>}
                {request.status === 'pendiente' && (isOwner ?
                  <button className="subtle-link" onClick={onMyListings}>Responder desde Mis prendas <Icon name="arrow" size={16} /></button> :
                  <div className="demo-action"><p>En la demo puedes ver cómo luce una solicitud aceptada.</p><button className="button button-outline" onClick={() => onMessage(onSimulateAccept(request.id))}>Simular aceptación</button></div>
                )}
                {request.status === 'aceptada' && <div className="agreement-box">
                  <h3>Coordinen fuera de la app</h3>
                  <p>Solo ustedes dos pueden ver estos números. Hablen por llamada o WhatsApp y luego vuelvan para indicar que acordaron un encuentro.</p>
                  <div className="phone-pair"><div><span>Tu número</span><strong>{isOwner ? request.ownerPhone : request.requesterPhone}</strong></div><div><span>Número de {otherName}</span><strong>{isOwner ? request.requesterPhone : request.ownerPhone}</strong></div></div>
                  {!myAgreement ? <button className="button button-dark" onClick={() => onMessage(onMarkAgreement(request.id))}>Ya acordamos un encuentro <Icon name="check" size={17} /></button> : <p className="waiting-note"><Icon name="check" size={17} /> Tu confirmación está lista. Falta la de {otherName}.</p>}
                  {myAgreement && !otherAgreement && <button className="subtle-link demo-simulate" onClick={() => onMessage(onMarkAgreement(request.id, true))}>Simular confirmación de {otherName} (demo)</button>}
                </div>}
                {request.status === 'encuentro_acordado' && <div className="agreement-complete"><Icon name="check" size={19} /><span>Encuentro acordado. {offered ? 'Ambas prendas salieron' : 'La prenda salió'} del catálogo.</span></div>}
                {request.status === 'sin_acuerdo' && <p className="no-requests">No se coordinó un encuentro. La prenda puede volver a publicarse.</p>}
              </div>
            </article>
          })}
        </div>
      )}
    </main>
  )
}
