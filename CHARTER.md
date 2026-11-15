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

## Tres cosas técnicas que todavía no sé hacer

1. **Autenticación con FastAPI:** hash de contraseñas, JWT con expiración y dónde guardarlo en el navegador de forma segura.
2. **Subida de fotos a Supabase Storage** desde FastAPI, validando tipo y tamaño en el servidor.
3. **Reglas de negocio con transacciones y migraciones:** evitar dos aceptaciones sobre la misma prenda con SQLAlchemy y Alembic, y desplegar el backend.
