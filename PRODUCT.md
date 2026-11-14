# Segunda Vuelta

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Confirmado por la usuaria: React para la interfaz y Python con FastAPI para el backend.
- FastAPI lleva la autenticación y las reglas de negocio. La interfaz nunca accede directo a la base de datos.
- Decidido: PostgreSQL alojado en Supabase y Supabase Storage para las fotos, accedidos solo desde FastAPI.
- Destino de la interfaz: Vercel.
- Pendiente: dónde se aloja el backend FastAPI.

## Users

- Personas que tienen ropa en buen estado para donar o intercambiar.
- Personas que buscan una prenda para recibir o intercambiar.
- Una misma cuenta puede publicar y solicitar prendas.
- La primera comunidad concreta de uso sigue por definir.

## Product Purpose

Facilitar donaciones e intercambios de ropa mediante publicaciones disponibles, solicitudes y coordinación entre las dos personas. La primera prueba de utilidad es que dos personas publiquen y acuerden una donación o un intercambio real.

## Operating Context

1. La persona inicia sesión y publica una prenda con una a tres fotos que ya tiene en la galería del teléfono o en el escritorio. Añade nombre, categoría, talla, estado, descripción, zona aproximada y modalidad de donación o intercambio.
2. Otra persona explora el catálogo y solicita una prenda disponible. Para un intercambio, indica cuál de sus prendas ofrece.
3. Quien publicó acepta una solicitud. Una prenda no puede tener dos solicitudes aceptadas. En un intercambio se reservan ambas prendas.
4. Las dos personas proporcionan un número de contacto. Solo ellas lo ven después de aceptar la solicitud y coordinan fuera de la aplicación.
5. Ambas vuelven y marcan «Encuentro acordado». Las prendas desaparecen del catálogo público, pero siguen visibles en la solicitud de sus participantes.
6. Si no llegan a coordinar, quien publicó puede subir la prenda de nuevo. La publicación anterior se cierra automáticamente para evitar duplicados.

## Capabilities and Constraints

- Cuentas, publicaciones, catálogo filtrable, solicitudes y seguimiento de estados.
- No hay captura directa con cámara dentro de la aplicación; se eligen fotos existentes.
- La ficha pública muestra solo una zona aproximada, nunca el número de contacto ni una dirección exacta.
- No se registra una confirmación posterior de entrega.
- Cada archivo del proyecto tendrá una responsabilidad concreta; la interfaz, validación, reglas de negocio y persistencia se mantendrán separadas.

## Brand Commitments

- «Segunda Vuelta» es un nombre provisional.
- La interfaz estará en español.

## Evidence on Hand

- Flujos y reglas confirmados en la conversación con la usuaria.
- No hay fotografías, publicaciones reales ni identidad visual aportadas todavía.

## Product Principles

- Publicar una prenda debe ser sencillo desde el teléfono o una computadora.
- El catálogo debe mostrar con claridad qué prendas pueden solicitarse.
- Una solicitud aceptada no puede producir dos acuerdos sobre la misma prenda.
- Los números de contacto solo se comparten entre las dos personas participantes.
