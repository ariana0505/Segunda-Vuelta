# Segunda Vuelta — demo de interfaz

Prototipo navegable en React y TypeScript para explorar, publicar, solicitar y acordar encuentros para donaciones o intercambios de ropa. La interfaz usa datos de ejemplo en memoria; al recargar la página se reinician los cambios. El backend FastAPI se integrará con la interfaz en una etapa posterior.

Segunda Vuelta busca que las personas de Ica puedan organizarse para donar o intercambiar ropa en buen estado y darle una segunda vida. El proyecto está dirigido tanto a quienes tienen prendas para compartir como a quienes desean recibirlas o intercambiarlas. Consulta el [charter](CHARTER.md) para conocer el alcance y la meta inicial.

## Stack previsto

- Interfaz: React, TypeScript y Vite; despliegue previsto en Vercel.
- Backend: FastAPI para autenticación y reglas de negocio.
- Datos y fotos: PostgreSQL y Storage de Supabase, accesibles desde el backend.

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

## Backend en desarrollo

Desde `api/`, crea un entorno virtual e instala las dependencias con `pip install -e '.[dev]'`. Copia `api/.env.example` a `api/.env` y configura la URL de PostgreSQL y una clave JWT aleatoria de al menos 32 caracteres. Nunca compartas estos valores ni subas `.env` al repositorio.

Ejecuta `alembic upgrade head` para crear las tablas y `uvicorn app.main:app --reload` para iniciar la API. La documentación interactiva está en `/docs`. Las pruebas se ejecutan con `pytest` desde `api/`.

La API ofrece registro, inicio de sesión y perfil; la interfaz sigue usando datos de demostración hasta la fase de integración. La conexión real con Supabase debe configurarse y verificarse en el entorno de destino.

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
- `src/pages/`: pantallas de catálogo, prendas, publicación y solicitudes.
- `src/features/catalog/`: ficha resumida de una prenda.
- `src/components/`: navegación, pie de página e iconos compartidos.
- `src/styles/`: hojas separadas por área de la interfaz.

Las fotos incluidas son ejemplos de [Unsplash](https://unsplash.com/). Las personas, prendas y solicitudes de la demo son ficticias.
