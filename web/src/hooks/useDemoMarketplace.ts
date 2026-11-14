import { useState } from 'react'
import { DEMO_USER_ID, DEMO_USER_NAME, initialListings, initialRequests } from '../data/demo'
import type { ClothingRequest, Listing } from '../types'

type Result = { ok: true; message: string } | { ok: false; message: string }
type NewListing = Omit<Listing, 'id' | 'ownerId' | 'ownerName' | 'status' | 'date'>
type NewRequest = Pick<ClothingRequest, 'listingId' | 'message' | 'requesterPhone' | 'offeredListingId'>

export function useDemoMarketplace() {
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [requests, setRequests] = useState<ClothingRequest[]>(initialRequests)

  function createListing(values: NewListing): Result {
    setListings((current) => [{
      ...values,
      id: crypto.randomUUID(),
      ownerId: DEMO_USER_ID,
      ownerName: DEMO_USER_NAME,
      status: 'disponible',
      date: 'Recién publicada',
    }, ...current])
    return { ok: true, message: 'Tu prenda ya aparece en el catálogo.' }
  }

  function createRequest(values: NewRequest): Result {
    const listing = listings.find((item) => item.id === values.listingId)
    if (!listing || listing.status !== 'disponible') {
      return { ok: false, message: 'Esta prenda ya no está disponible.' }
    }
    if (listing.ownerId === DEMO_USER_ID) {
      return { ok: false, message: 'No puedes solicitar tu propia prenda.' }
    }
    if (requests.some((item) => item.listingId === values.listingId && item.requesterId === DEMO_USER_ID && item.status !== 'rechazada')) {
      return { ok: false, message: 'Ya enviaste una solicitud para esta prenda.' }
    }
    if (listing.mode === 'intercambio') {
      const offered = listings.find((item) => item.id === values.offeredListingId)
      if (!offered || offered.ownerId !== DEMO_USER_ID || offered.status !== 'disponible') {
        return { ok: false, message: 'Elige una de tus prendas disponibles para el intercambio.' }
      }
    }
    setRequests((current) => [{
      ...values,
      id: crypto.randomUUID(),
      requesterId: DEMO_USER_ID,
      requesterName: DEMO_USER_NAME,
      status: 'pendiente',
      requesterAgreed: false,
      ownerAgreed: false,
    }, ...current])
    return { ok: true, message: 'Solicitud enviada. Puedes seguirla en Mis solicitudes.' }
  }

  function acceptRequest(id: string, ownerPhone: string, simulate = false): Result {
    const request = requests.find((item) => item.id === id)
    const listing = listings.find((item) => item.id === request?.listingId)
    const offered = listings.find((item) => item.id === request?.offeredListingId)
    if (!request || !listing || request.status !== 'pendiente' || listing.status !== 'disponible') {
      return { ok: false, message: 'La solicitud ya no se puede aceptar.' }
    }
    if (request.offeredListingId && (!offered || offered.status !== 'disponible')) {
      return { ok: false, message: 'La prenda ofrecida ya no está disponible.' }
    }
    setRequests((current) => current.map((item) => {
      if (item.id === id) return { ...item, ownerPhone, status: 'aceptada' }
      if (item.listingId === listing.id && item.status === 'pendiente') return { ...item, status: 'rechazada' }
      return item
    }))
    setListings((current) => current.map((item) =>
      item.id === listing.id || item.id === request.offeredListingId
        ? { ...item, status: 'reservada' }
        : item,
    ))
    return { ok: true, message: simulate ? 'La otra persona aceptó la solicitud en la demo.' : 'Solicitud aceptada. Ya pueden comunicarse por teléfono.' }
  }

  function rejectRequest(id: string): Result {
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status: 'rechazada' } : item))
    return { ok: true, message: 'Solicitud rechazada.' }
  }

  function markAgreement(id: string, otherPerson = false): Result {
    const request = requests.find((item) => item.id === id)
    if (!request || request.status !== 'aceptada') {
      return { ok: false, message: 'Esta solicitud no tiene un encuentro pendiente.' }
    }
    const isOwner = listings.find((item) => item.id === request.listingId)?.ownerId === DEMO_USER_ID
    const ownerAgreed = otherPerson ? (isOwner ? request.ownerAgreed : true) : (isOwner ? true : request.ownerAgreed)
    const requesterAgreed = otherPerson ? (isOwner ? true : request.requesterAgreed) : (isOwner ? request.requesterAgreed : true)
    const completed = ownerAgreed && requesterAgreed
    setRequests((current) => current.map((item) => item.id === id
      ? { ...item, ownerAgreed, requesterAgreed, status: completed ? 'encuentro_acordado' : 'aceptada' }
      : item))
    if (completed) {
      setListings((current) => current.map((item) =>
        item.id === request.listingId || item.id === request.offeredListingId
          ? { ...item, status: 'cerrada' }
          : item,
      ))
    }
    return {
      ok: true,
      message: completed ? 'Encuentro acordado. Las prendas salieron del catálogo.' : 'Tu confirmación quedó registrada. Falta la de la otra persona.',
    }
  }

  function repostListing(id: string): Result {
    const listing = listings.find((item) => item.id === id)
    if (!listing || listing.ownerId !== DEMO_USER_ID) {
      return { ok: false, message: 'No encontramos esa publicación.' }
    }
    const accepted = requests.find((item) => item.listingId === id && item.status === 'aceptada')
    if (accepted) {
      setRequests((current) => current.map((item) => item.id === accepted.id ? { ...item, status: 'sin_acuerdo' } : item))
    }
    setListings((current) => [
      { ...listing, id: crypto.randomUUID(), status: 'disponible', date: 'Recién publicada' },
      ...current.map((item) => {
        if (item.id === id) return { ...item, status: 'cerrada' as const }
        if (accepted?.offeredListingId === item.id) return { ...item, status: 'disponible' as const }
        return item
      }),
    ])
    return { ok: true, message: 'La prenda volvió a publicarse; el anuncio anterior se cerró.' }
  }

  return { listings, requests, createListing, createRequest, acceptRequest, rejectRequest, markAgreement, repostListing }
}
