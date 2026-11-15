import { useMemo, useState } from 'react'
import type { Listing, ListingMode } from '../../types'
import { Icon } from '../../components/Icons'
import { ListingCard } from './ListingCard'
import { ContentState } from '../../components/ContentState'

interface Props {
  listings: Listing[]
  onOpen: (id: string) => void
  onPublish: () => void
}

const categories = ['Todas', 'Chaquetas', 'Abrigos', 'Tejidos', 'Camisetas', 'Pantalones', 'Vestidos', 'Otros']

export function CatalogView({ listings, onOpen, onPublish }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [mode, setMode] = useState<'todas' | ListingMode>('todas')
  const [size, setSize] = useState('')
  const [zone, setZone] = useState('')

  const visible = useMemo(() => listings.filter((item) => {
    if (item.status === 'cerrada') return false
    if (category !== 'Todas' && item.category !== category) return false
    if (mode !== 'todas' && item.mode !== mode) return false
    if (size && item.size.toLocaleLowerCase('es') !== size.toLocaleLowerCase('es')) return false
    if (zone && !item.zone.toLocaleLowerCase('es').includes(zone.toLocaleLowerCase('es').trim())) return false
    const search = `${item.title} ${item.category} ${item.zone}`.toLocaleLowerCase('es')
    return search.includes(query.toLocaleLowerCase('es').trim())
  }), [listings, query, category, mode, size, zone])

  return (
    <main>
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-scribble" aria-hidden="true"><span /></div>
          <h1 id="hero-title">La ropa merece <em>otra historia.</em></h1>
          <p>Prendas que aún tienen mucho por dar. Encuentra algo especial, comparte lo que ya no usas y dale una segunda vuelta.</p>
          <div className="hero-actions">
            <a className="button button-coral" href="#catalogo">Explorar prendas <Icon name="arrow" size={19} /></a>
            <button className="text-link" onClick={onPublish}>Quiero compartir una prenda</button>
          </div>
          <span className="hero-footnote">Donar · Intercambiar · Volver a usar</span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-photo-frame">
            <img src="/images/jacket.jpg" alt="" />
          </div>
          <div className="hero-note">Una prenda nueva<br />para alguien más.</div>
          <span className="hero-orbit orbit-one" /><span className="hero-orbit orbit-two" />
        </div>
      </section>

      <section className="catalog-section shell" id="catalogo" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <h2 id="catalog-title">Encuentra tu próxima prenda</h2>
            <p>Explora piezas que otras personas quieren compartir.</p>
          </div>
            <span className="result-count">{visible.length} {visible.length === 1 ? 'prenda en el catálogo' : 'prendas en el catálogo'}</span>
        </div>
        <div className="filters">
          <label className="search-field">
            <Icon name="search" size={20} />
            <span className="sr-only">Buscar prendas</span>
            <input type="search" placeholder="Buscar una prenda..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="mode-filter" aria-label="Filtrar modalidad">
            <button className={mode === 'todas' ? 'selected' : ''} onClick={() => setMode('todas')}>Todas</button>
            <button className={mode === 'donacion' ? 'selected' : ''} onClick={() => setMode('donacion')}>Donación</button>
            <button className={mode === 'intercambio' ? 'selected' : ''} onClick={() => setMode('intercambio')}>Intercambio</button>
          </div>
        </div>
        <div className="category-list" aria-label="Filtrar categoría">
          {categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="filters">
          <label className="form-field">Talla<select value={size} onChange={(event) => setSize(event.target.value)}><option value="">Todas las tallas</option>{Array.from(new Set(listings.map((item) => item.size))).sort().map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="form-field">Zona<input value={zone} onChange={(event) => setZone(event.target.value)} placeholder="Buscar zona" /></label>
        </div>
        {visible.length > 0 ? (
          <div className="listing-grid">
            {visible.map((item) => <ListingCard key={item.id} listing={item} onOpen={onOpen} />)}
          </div>
        ) : (
          <ContentState kind="empty" title="No encontramos prendas con esos filtros" action={<button className="button button-dark" onClick={() => { setQuery(''); setCategory('Todas'); setMode('todas'); setSize(''); setZone('') }}>Ver todas las prendas</button>}>
            Prueba otra búsqueda o comparte la primera de esta categoría.
          </ContentState>
        )}
      </section>
    </main>
  )
}
