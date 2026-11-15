# Charter — Segunda Vuelta

Producto, reglas y flujo completos en [PRODUCT.md](PRODUCT.md). Este documento resume lo que hace válido el proyecto.

## Usuario

Vecinas y vecinos de un mismo barrio que tienen ropa en buen estado que ya no usan, o que buscan una prenda. Una misma persona puede publicar y solicitar.

## Problema y cómo se resuelve hoy

Hoy se comparte por grupos de WhatsApp o Facebook del barrio. Ahí las publicaciones se pierden entre otros mensajes, no se ve qué sigue disponible ni quién pidió primero, y el teléfono queda expuesto a todo el grupo.

## Versión 1

**Incluye:**
- Cuentas, con inicio de sesión.
- Publicar una prenda con una a tres fotos, talla, estado, zona aproximada y modalidad (donación o intercambio).
- Catálogo con filtros.
- Solicitudes: una prenda no puede tener dos solicitudes aceptadas, y en un intercambio se reservan ambas prendas.
- Teléfono visible solo para las dos personas, después de aceptar.
- Marcar «Encuentro acordado» y retirar las prendas del catálogo.

**Queda fuera:**
- Chat dentro de la aplicación (se coordinan fuera).
- Captura con cámara.
- Confirmación posterior de entrega.
- Pagos, valoraciones y notificaciones.

## Medida de éxito

Dos personas del barrio publican y acuerdan una donación o un intercambio real usando la aplicación.

## Decisiones tomadas

- **Stack:** React + TypeScript + Vite en Vercel; FastAPI para autenticación y reglas de negocio; Supabase (Postgres y Storage) accedido solo desde FastAPI.
- **Estructura del repo:** `web/` (frontend) y `api/` (backend, desde la fase 4).
- **Privacidad:** la ficha pública muestra solo una zona aproximada. El teléfono se entrega únicamente a las dos personas, tras aceptar la solicitud, y la regla se aplica en el servidor, no solo en la interfaz.
- **Flujo de trabajo:** una rama por fase, commits atómicos, Pull Request con review propio, CI en verde y merge a `main`. Plan completo en [faces.md](faces.md).

## Supuestos por confirmar

- Hoy el barrio lo resuelve con grupos de WhatsApp o Facebook.
- La primera comunidad es un solo barrio. Aún no está nombrado.
- La coordinación sigue siendo por teléfono, fuera de la aplicación.

## Decisiones abiertas

- Dónde se aloja FastAPI: Vercel (función serverless), Render, Railway o Fly.io.
- Dónde se guarda el JWT en el navegador: cookie `httpOnly` (más segura) o `localStorage`.
- Nombre definitivo del producto. «Segunda Vuelta» es provisional.
- Nombre del barrio y datos legales (privacidad de teléfonos y fotos), a definir antes de probar con personas reales.

## Tres cosas técnicas que todavía no sé hacer

1. **Autenticación con FastAPI:** hash de contraseñas, JWT con expiración y dónde guardarlo en el navegador de forma segura.
2. **Subida de fotos a Supabase Storage** desde FastAPI, validando tipo y tamaño en el servidor.
3. **Reglas de negocio con transacciones y migraciones:** evitar dos aceptaciones sobre la misma prenda con SQLAlchemy y Alembic, y desplegar el backend.
