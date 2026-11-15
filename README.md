# Segunda Vuelta — demo de interfaz

Prototipo navegable en React y TypeScript para explorar, publicar, solicitar y acordar encuentros para donaciones o intercambios de ropa. Usa datos de ejemplo en memoria; al recargar la página se reinician los cambios. El backend FastAPI y PostgreSQL se conectarán en una etapa posterior.

## Problema y usuario

Vecinas y vecinos de un barrio que quieren regalar o cambiar ropa hoy lo hacen en grupos de WhatsApp o Facebook, donde las publicaciones se pierden y el teléfono queda expuesto. Segunda Vuelta ofrece un catálogo con solicitudes y comparte el contacto solo entre las dos personas. Detalles en [CHARTER.md](CHARTER.md) y [PRODUCT.md](PRODUCT.md).

## Stack

React + TypeScript + Vite (Vercel) · FastAPI (autenticación y reglas de negocio) · Supabase (Postgres y Storage). El plan de ramas y commits está en [faces.md](faces.md).

## Ejecutar

```bash
cd web
npm install
npm run dev
```

Abre la dirección local que imprime Vite. Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Recorrido de la demo

1. Explora el catálogo y filtra prendas por modalidad o categoría.
2. Abre una prenda y envía una solicitud. Para intercambiar, selecciona una de tus prendas.
3. En **Mis solicitudes**, usa el control de simulación para ver cómo aparece una solicitud aceptada.
4. En **Mis prendas**, responde a la solicitud de ejemplo que recibió Ariana.
5. Después de aceptar, ambos números se muestran solo en la vista de la solicitud. Marca el encuentro acordado; el control de simulación representa la confirmación de la otra persona.
6. En **Publicar prenda**, selecciona hasta tres fotos existentes desde la galería o el escritorio. La demo no ofrece captura de cámara.

## Responsabilidades de los archivos

- `src/App.tsx`: compone las pantallas y muestra avisos.
- `src/hooks/useDemoMarketplace.ts`: mantiene el estado temporal y las reglas del recorrido de prueba.
- `src/data/demo.ts`: contiene exclusivamente publicaciones y solicitudes ficticias.
- `src/types.ts`: define los tipos compartidos.
- `src/features/catalog/`: catálogo y ficha resumida.
- `src/features/listings/`: detalle de prenda y publicaciones propias.
- `src/features/publish/`: formulario de publicación y selección de fotos.
- `src/features/requests/`: seguimiento de solicitudes y acuerdos.
- `src/components/`: navegación, pie de página e iconos compartidos.
- `src/styles/`: hojas separadas por área de la interfaz.

Las fotos incluidas son ejemplos de [Unsplash](https://unsplash.com/). Las personas, prendas y solicitudes de la demo son ficticias.
