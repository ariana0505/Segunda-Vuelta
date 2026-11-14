export type ListingMode = 'donacion' | 'intercambio'
export type ListingStatus = 'disponible' | 'reservada' | 'cerrada'
export type RequestStatus = 'pendiente' | 'aceptada' | 'encuentro_acordado' | 'rechazada' | 'sin_acuerdo'

export interface Listing {
  id: string
  title: string
  category: string
  size: string
  condition: string
  description: string
  zone: string
  mode: ListingMode
  image: string
  images?: string[]
  ownerId: string
  ownerName: string
  status: ListingStatus
  date: string
}

export interface ClothingRequest {
  id: string
  listingId: string
  requesterId: string
  requesterName: string
  message: string
  offeredListingId?: string
  requesterPhone: string
  ownerPhone?: string
  status: RequestStatus
  requesterAgreed: boolean
  ownerAgreed: boolean
}

export type View = 'catalog' | 'detail' | 'publish' | 'my-listings' | 'requests'
