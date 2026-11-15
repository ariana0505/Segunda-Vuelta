import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Icon } from '../components/Icons'
import type { Listing } from '../types'

type NewListing = Omit<Listing, 'id' | 'ownerId' | 'ownerName' | 'status' | 'date'>
type Result = { ok: boolean; message: string }

interface Props {
  onPublish: (values: NewListing) => Result
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

const readImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(new Error('No pudimos leer una de las fotos.'))
  reader.readAsDataURL(file)
})

export function PublishForm({ onPublish, onSuccess, onError }: Props) {
  const [photos, setPhotos] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<Listing['mode']>('donacion')
  const [photoError, setPhotoError] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)

  function reportPhotoError(message: string) {
    setPhotoError(message)
    photoInput.current?.focus()
  }

  async function choosePhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    if (files.length > 3) {
      reportPhotoError('Puedes elegir hasta tres fotos.')
      event.target.value = ''
      return
    }
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      reportPhotoError('Elige fotos JPG, PNG o WebP de hasta 5 MB cada una.')
      event.target.value = ''
      return
    }
    try {
      setBusy(true)
      setPhotos(await Promise.all(files.map(readImage)))
      setPhotoError('')
    } catch {
      reportPhotoError('No pudimos leer una de las fotos. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (photos.length === 0) {
      reportPhotoError('Elige al menos una foto de tu galería o escritorio.')
      return
    }
    const data = new FormData(event.currentTarget)
    const result = onPublish({
      title: String(data.get('title')).trim(),
      category: String(data.get('category')),
      size: String(data.get('size')).trim(),
      condition: String(data.get('condition')),
      zone: String(data.get('zone')).trim(),
      description: String(data.get('description')).trim(),
      mode,
      image: photos[0],
      images: photos,
    })
    if (result.ok) onSuccess(result.message)
    else onError(result.message)
  }

  return (
    <main className="shell publish-page">
      <div className="page-heading publish-heading">
        <div>
          <p className="page-context">Compartir una prenda</p>
          <h1>Tu ropa puede empezar <em>otra historia.</em></h1>
          <p>Cuéntanos sobre esa pieza que está lista para alguien más.</p>
        </div>
        <div className="publish-decor" aria-hidden="true"><Icon name="arrow" size={62} /></div>
      </div>
      <form className="publish-layout" onSubmit={submit}>
        <div className="publish-main">
          <section className="form-section">
            <div className="form-section-heading"><span className="section-step">1</span><div><h2>Primero, las fotos</h2><p>Elige imágenes que ya tengas guardadas.</p></div></div>
            <label className="photo-picker">
              <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={choosePhotos} aria-label="Elegir fotos desde galería o escritorio" aria-invalid={!!photoError} aria-describedby={photoError ? 'photo-error' : undefined} />
              <span className="upload-icon"><Icon name="upload" size={26} /></span>
              <strong>Elegir fotos de mi galería o escritorio</strong>
              <small>JPG, PNG o WebP · de 1 a 3 fotos · máximo 5 MB por foto</small>
            </label>
            {photoError && <p id="photo-error" role="alert">{photoError}</p>}
            {photos.length > 0 && <div className="photo-previews">{photos.map((photo, index) => <img key={index} src={photo} alt={`Vista previa ${index + 1}`} />)}</div>}
          </section>
          <section className="form-section">
            <div className="form-section-heading"><span className="section-step">2</span><div><h2>Describe la prenda</h2><p>Los detalles ayudan a encontrarle a la persona indicada.</p></div></div>
            <div className="form-grid">
              <label className="form-field full">Nombre de la prenda<input name="title" required maxLength={60} placeholder="Ej. Chaqueta de mezclilla azul" /></label>
              <label className="form-field">Categoría<select name="category" required defaultValue=""><option value="" disabled>Seleccionar</option><option>Chaquetas</option><option>Abrigos</option><option>Tejidos</option><option>Camisetas</option><option>Pantalones</option><option>Vestidos</option><option>Otros</option></select></label>
              <label className="form-field">Talla<input name="size" required maxLength={15} placeholder="Ej. M, 28, única" /></label>
              <label className="form-field">Estado<select name="condition" required defaultValue=""><option value="" disabled>Seleccionar</option><option>Como nuevo</option><option>Muy buen estado</option><option>Buen estado</option></select></label>
              <label className="form-field">Zona aproximada<input name="zone" required maxLength={40} placeholder="Ej. Zona Centro" /></label>
              <label className="form-field full">Descripción<textarea name="description" required minLength={10} maxLength={400} rows={4} placeholder="¿Cómo es, cómo queda y qué debería saber la otra persona?" /></label>
            </div>
          </section>
          <section className="form-section">
            <div className="form-section-heading"><span className="section-step">3</span><div><h2>Elige cómo compartirla</h2><p>Escoge una opción para esta publicación.</p></div></div>
            <div className="choice-grid" role="group" aria-label="Modalidad de publicación">
              <button type="button" className={mode === 'donacion' ? 'choice-card selected' : 'choice-card'} onClick={() => setMode('donacion')} aria-pressed={mode === 'donacion'}><span className="choice-symbol"><Icon name="heart" size={25} /></span><strong>Donación</strong><small>Quiero regalar esta prenda.</small></button>
              <button type="button" className={mode === 'intercambio' ? 'choice-card selected' : 'choice-card'} onClick={() => setMode('intercambio')} aria-pressed={mode === 'intercambio'}><span className="choice-symbol"><Icon name="swap" size={25} /></span><strong>Intercambio</strong><small>Quiero cambiarla por otra.</small></button>
            </div>
          </section>
        </div>
        <aside className="publish-aside">
          <h2>Antes de publicar</h2>
          <p>Una buena foto y una descripción honesta hacen más fácil que tu prenda encuentre su próxima vuelta.</p>
          <ul><li><Icon name="check" size={17} /> La prenda está limpia y en buen estado.</li><li><Icon name="check" size={17} /> La talla y el estado son correctos.</li><li><Icon name="check" size={17} /> Solo se muestra tu zona aproximada.</li></ul>
          <button className="button button-coral button-wide" type="submit" disabled={busy}>{busy ? 'Preparando fotos...' : 'Publicar prenda'} <Icon name="arrow" size={19} /></button>
          <small>Prototipo: esta publicación vive solo durante la sesión actual.</small>
        </aside>
      </form>
    </main>
  )
}
