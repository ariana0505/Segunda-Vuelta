# Fases del proyecto — Segunda Vuelta

Plan de trabajo con las etapas en las que se hace un commit. Cada fase es una rama que termina en un Pull Request y un merge a `main`.

## Stack

- **Frontend:** React + TypeScript + Vite, desplegado en Vercel.
- **Backend:** FastAPI (autenticación y reglas de negocio).
- **Base de datos y fotos:** Supabase (Postgres y Storage). React nunca habla directo con la base de datos.

## Estructura de carpetas

```
/
├── web/    frontend React + Vite (se despliega en Vercel con Root Directory = web)
├── api/    backend FastAPI (se crea en la fase 4)
├── README.md, PRODUCT.md, faces.md, CHARTER.md
└── .gitignore
```

Cada parte tiene su propia configuración y el CI corre un job por carpeta.

## Reglas de Git

- **Rama:** una por cada cambio con intención propia. Se crea desde `main` actualizada al empezar la fase. Nunca se trabaja directo en `main`, salvo el commit inicial.
- **Commit:** uno por cada unidad que funciona y se explica en una línea. Debe ser atómico y el proyecto debe seguir compilando.
- **Formato del mensaje:** `tipo: descripción`. Tipos: `feat`, `fix`, `docs`, `ci`, `test`, `refactor`, `chore`.
- **Cierre de fase:** PR con al menos un comentario de review propio, CI en verde y merge a `main`.

## Fase 0 — `main` (commit directo)

- `chore: importar demo de interfaz`: código actual dentro de `web/`, más `.gitignore`, `README.md`, `PRODUCT.md`, `faces.md` y `.env.example`.

## Fase 1 — rama `docs/charter`

- `docs: añadir charter`: `CHARTER.md` con usuario concreto, problema y solución actual, qué hace y qué no la v1, métrica de éxito y tres lagunas técnicas.
- `docs: ampliar README`: problema, usuario, cómo ejecutar y stack.

## Fase 2 — rama `ci/build-check`

- `ci: workflow de build`: GitHub Actions con un job para `web/` que corre `npm ci`, `tsc -b` y `vite build`.
- `chore: añadir eslint y prettier`: configuración y script `npm run lint`.
- `ci: ejecutar lint en el workflow`: el CI también corre el lint.

## Fase 3 — rama `feat/router-ui`

- `feat: añadir react-router`: rutas `/`, `/prenda/:id`, `/publicar`, `/mis-prendas` y `/solicitudes`, en lugar del `useState<View>`.
- `refactor: separar layout y páginas`: `Layout` con header y footer, y carpeta `pages/`.
- `feat: estados de carga, vacío y error`: componentes reutilizables.
- `feat: buscador y filtros por talla y zona`: filtros nuevos en el catálogo.
- `fix: accesibilidad de formularios y avisos`: errores por campo, `role="alert"` y gestión del foco.

## Fase 4 — rama `feat/api-base`

- `chore: estructura del backend`: carpeta `api/` con FastAPI, `pyproject.toml`, configuración por variables de entorno y `/health`.
- `feat(db): conexión a supabase postgres`: SQLAlchemy, Alembic y sesión de base de datos.
- `feat(db): modelos y migración inicial`: `users`, `listings`, `listing_images`, `requests` y `contacts`, con enums de estado.
- `ci: tests y lint del backend`: job separado para `api/` con pytest y ruff.

## Fase 5 — rama `feat/auth-api`

- `feat(auth): registro y login`: hash de contraseña con argon2 o bcrypt y JWT con expiración.
- `feat(auth): dependencia de usuario actual`: `get_current_user` para proteger endpoints.
- `feat(auth): perfil`: `GET` y `PATCH /me`.
- `test(auth): registro, login y rutas protegidas`.

## Fase 6 — rama `feat/listings-api`

- `feat(api): catálogo público`: `GET /listings` con filtros por modalidad, categoría, talla, zona y texto, y paginación.
- `feat(api): publicar y editar prenda`: validación con Pydantic; solo el dueño edita o elimina.
- `feat(storage): subida de fotos`: validación de tipo y tamaño en el servidor y subida a Supabase Storage con la service key, que vive solo en el backend.
- `test: reglas de publicaciones`.

## Fase 7 — rama `feat/requests-api`

- `feat(api): crear solicitud`: valida disponibilidad, que la prenda no sea propia y, en un intercambio, que ofrezca una prenda suya.
- `feat(api): aceptar y rechazar`: transacción que reserva ambas prendas y rechaza las demás solicitudes; una prenda nunca tiene dos aceptadas.
- `feat(api): contacto protegido`: el teléfono solo se devuelve a los dos participantes tras aceptar.
- `feat(api): encuentro acordado y republicar`: confirmación de ambas personas, cierre de prendas y republicación.
- `test: reglas de solicitudes`: doble aceptación, permisos y teléfono.

## Fase 8 — rama `feat/frontend-integration`

- `feat: cliente http y manejo de sesión`: `fetch` con token, contexto de sesión y rutas protegidas.
- `feat: pantallas de registro y login`.
- `feat: catálogo, detalle y publicar desde la api`: sustituye `initialListings` y sube fotos por el backend.
- `feat: solicitudes y contacto desde la api`.
- `refactor: eliminar datos y simulaciones de la demo`: se retiran `demo.ts`, el banner y los botones de simulación.

## Fase 9 — rama `deploy/vercel`

- `chore: configuración de despliegue`: Root Directory = `web` en Vercel y `web/vercel.json` con reescritura de rutas para el SPA.
- `chore: despliegue del backend`: variables de entorno de producción y CORS restringido al dominio de Vercel.
- `docs: guía de despliegue`: variables de entorno y pasos en el README.
- `chore: metadatos y favicon`: título, descripción, Open Graph e icono.

Vercel se conecta al repo después del primer merge con CI en verde. El backend necesita su propio hosting (función serverless en Vercel, o Render, Railway o Fly.io).

## Evidencia para el historial de Git (C1)

No son commits extra; se aprovechan estos puntos:

- **Ramas paralelas y conflicto:** crear `feat/buscador` y `fix/accesibilidad` a la vez, ambas tocando `CatalogView.tsx`. Fusionar una y resolver a mano el conflicto al fusionar la otra.
- **Rebase interactivo:** en la fase 4, antes del PR, agrupar con `rebase -i` los commits sueltos de modelos y migración.
- **Revert:** si un cambio rompe `main`, usar `git revert` y documentarlo. No reescribir historial compartido.
- **PR con review propio:** dejar comentarios en los PR de las fases 4 y 7, que son los más delicados.

## Seguimiento

| Fase | Rama | PR | CI | Merge |
|---|---|---|---|---|
| 0 | `main` | — | — | [ ] |
| 1 | `docs/charter` | | | [ ] |
| 2 | `ci/build-check` | | | [ ] |
| 3 | `feat/router-ui` | | | [ ] |
| 4 | `feat/api-base` | | | [ ] |
| 5 | `feat/auth-api` | | | [ ] |
| 6 | `feat/listings-api` | | | [ ] |
| 7 | `feat/requests-api` | | | [ ] |
| 8 | `feat/frontend-integration` | | | [ ] |
| 9 | `deploy/vercel` | | | [ ] |
