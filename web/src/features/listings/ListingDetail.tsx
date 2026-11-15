import { useRef, useState, type FormEvent } from 'react'
import { DEMO_USER_ID } from '../../data/demo'
import type { ClothingRequest, Listing } from '../../types'
import { Icon } from '../../components/Icons'

type RequestInput = Pick<ClothingRequest, 'listingId' | 'message' | 'requesterPhone' | 'offeredListingId'>
type Result = { ok: boolean; message: string }

interface Props {
  listing: Listing
  ownListings: Listing[]
  alreadyRequested: boolean
  onBack: () => void
  onMyListings: () => void
  onRequest: (values: RequestInput) => Result
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function ListingDetail({ listing, ownListings, alreadyRequested, onBack, onMyListings, onRequest, onSuccess, onError }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const phoneRef = useRef<HTMLInputElement>(null)
  const [offeredListingId, setOfferedListingId] = useState('')
  const isOwn = listing.ownerId === DEMO_USER_ID
  const canExchange = listing.mode === 'intercambio' && ownListings.length > 0

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (phone.replace(/\D/g, '').length < 8) {
      setPhoneError('Escribe un número de contacto válido con al menos 8 dígitos.')
      phoneRef.current?.focus()
      return
    }
    setPhoneError('')
    const result = onRequest({
      listingId: listing.id,
      message: message.trim(),
      requesterPhone: phone.trim(),
      ...(listing.mode === 'intercambio' ? { offeredListingId } : {}),
    })
    if (result.ok) onSuccess(result.message)
    else onError(result.message)
  }

  return (
    <main className="shell detail-page">
      <button className="back-link" onClick={onBack}><Icon name="back" size={18} /> Volver a explorar</button>
      <div className="detail-layout">
        <div>
          <div className="detail-image">
            <img src={(listing.images ?? [listing.image])[activeImage]} alt={listing.title} />
            <span className={`mode-badge ${listing.status === 'reservada' ? 'reserved' : listing.mode}`}>{listing.status === 'reservada' ? 'Reservada' : listing.mode === 'donacion' ? 'Donación' : 'Intercambio'}</span>
          </div>
          {(listing.images?.length ?? 0) > 1 && <div className="detail-thumbnails">{listing.images?.map((image, index) => <button key={index} className={activeImage === index ? 'selected' : ''} onClick={() => setActiveImage(index)} aria-label={`Ver foto ${index + 1}`}><img src={image} alt="" /></button>)}</div>}
        </div>
        <div className="detail-content">
          <p className="detail-category">{listing.category} · {listing.date}</p>
          <h1>{listing.title}</h1>
          <p className="detail-intro">{listing.description}</p>
          <dl className="detail-facts">
            <div><dt>Talla</dt><dd>{listing.size}</dd></div>
            <div><dt>Estado</dt><dd>{listing.condition}</dd></div>
            <div><dt>Zona</dt><dd>{listing.zone}</dd></div>
          </dl>
          <div className="owner-strip">
            <span className="owner-avatar">{listing.ownerName[0]}</span>
            <span><strong>Publicado por {listing.ownerName}</strong><small>El número se comparte tras aceptar la solicitud</small></span>
          </div>
          {isOwn ? (
            <div className="detail-action-box">
              <h2>Esta es tu publicación</h2>
              <p>Revisa las solicitudes que lleguen desde tu espacio de prendas.</p>
              <button className="button button-dark" onClick={onMyListings}>Ir a mis prendas <Icon name="arrow" size={18} /></button>
            </div>
          ) : alreadyRequested ? (
            <div className="detail-action-box">
              <h2>Ya solicitaste esta prenda</h2>
              <p>Consulta el estado desde Mis solicitudes.</p>
            </div>
          ) : listing.status !== 'disponible' ? (
            <div className="detail-action-box"><h2>Prenda reservada</h2><p>Por ahora no admite nuevas solicitudes.</p></div>
          ) : (
            <form className="request-form" onSubmit={submit}>
              <h2>{listing.mode === 'donacion' ? 'Solicitar esta prenda' : 'Proponer un intercambio'}</h2>
              <p>Cuéntale a {listing.ownerName} por qué te interesa.</p>
              {listing.mode === 'intercambio' && (
                <label className="form-field">Tu prenda para intercambiar
                  <select required value={offeredListingId} onChange={(event) => setOfferedListingId(event.target.value)} disabled={!canExchange}>
                    <option value="">Selecciona una prenda</option>
                    {ownListings.map((item) => <option key={item.id} value={item.id}>{item.title} · talla {item.size}</option>)}
                  </select>
                  {!canExchange && <small>Primero publica una prenda para poder intercambiar.</small>}
                </label>
              )}
              <label className="form-field">Mensaje
                <textarea required maxLength={280} rows={3} placeholder="Hola, me interesa esta prenda porque..." value={message} onChange={(event) => setMessage(event.target.value)} />
              </label>
              <label className="form-field">Tu número de contacto
                <input ref={phoneRef} required type="tel" inputMode="tel" placeholder="Ej. 999 123 456" value={phone} onChange={(event) => { setPhone(event.target.value); setPhoneError('') }} aria-invalid={!!phoneError} aria-describedby={phoneError ? 'phone-error' : undefined} />
                {phoneError && <small id="phone-error" role="alert">{phoneError}</small>}
                <small>Solo se mostrará a la otra persona si acepta tu solicitud.</small>
              </label>
              <button className="button button-coral button-wide" type="submit" disabled={listing.mode === 'intercambio' && !canExchange}>Enviar solicitud <Icon name="arrow" size={18} /></button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
