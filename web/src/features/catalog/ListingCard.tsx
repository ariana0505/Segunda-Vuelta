import type { Listing } from '../../types'
import { Icon } from '../../components/Icons'

interface Props {
  listing: Listing
  onOpen: (id: string) => void
}

export function ListingCard({ listing, onOpen }: Props) {
  return (
    <button className="listing-card" onClick={() => onOpen(listing.id)} aria-label={`Ver ${listing.title}`}>
      <span className="listing-image-wrap">
        <img src={listing.image} alt={listing.title} loading="lazy" />
        <span className={`mode-badge ${listing.status === 'reservada' ? 'reserved' : listing.mode}`}>{listing.status === 'reservada' ? 'Reservada' : listing.mode === 'donacion' ? 'Donación' : 'Intercambio'}</span>
      </span>
      <span className="listing-card-info">
        <span className="listing-title-row"><strong>{listing.title}</strong><Icon name="arrow" size={19} /></span>
        <span className="listing-meta"><span>Talla {listing.size}</span><span className="meta-dot" /><span>{listing.zone}</span></span>
        <span className="listing-owner">Publicado por {listing.ownerName}</span>
      </span>
    </button>
  )
}
