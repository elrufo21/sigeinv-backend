# Modulo `categories`: Mapa de arquitectura y responsabilidades

Este documento describe, en detalle, como esta organizado el CRUD de categorias, que responsabilidad tiene cada archivo y como fluye una peticion desde HTTP hasta base de datos.

## 1) Estructura de carpetas y archivos

```text
src/
  modules/
    categories/
      category.routes.js
      categories.controller.js
      categories.service.js
      categories.repository.js
      categories.schema.js
      auth.schema.js
```

Archivos compartidos que tambien participan en el flujo de `categories`:

```text
src/
  app/
    app.js
    routes.js
  middlewares/
    not-found.middleware.js
    error.middleware.js
  lib/
    validate.js
    http-error.js
    prisma.js
```

## 2) Capa por capa

### `src/modules/categories/category.routes.js`

Responsabilidad:

- Definir endpoints HTTP del recurso `categories`.
- Asociar cada ruta con su funcion del controller.
- No contiene logica de negocio ni acceso a DB.

Endpoints definidos:

- `POST /api/categories` -> crear categoria
- `GET /api/categories` -> listar categorias
- `GET /api/categories/:id` -> obtener categoria por id
- `PATCH /api/categories/:id` -> actualizar categoria
- `DELETE /api/categories/:id` -> eliminar categoria

### `src/modules/categories/categories.controller.js`

Responsabilidad:

- Traducir HTTP <-> capa de negocio.
- Validar `req.params` y `req.body` usando schemas de Zod.
- Elegir codigos de estado HTTP (`200`, `201`, `204`).
- Delegar reglas de negocio al service.
- Pasar errores a `next(error)` para que los resuelva el middleware global.

No debe hacer:

- Queries directas con Prisma.
- Reglas de negocio complejas.

### `src/modules/categories/categories.service.js`

Responsabilidad:

- Contener reglas de negocio del dominio `Category`.
- Coordinar llamadas al repository.
- Lanzar errores de dominio/negocio (`404`, `409`) usando `HttpError`.

Reglas actuales implementadas:

- No se puede crear categoria con nombre duplicado.
- No se puede actualizar a un nombre que ya use otra categoria.
- No se puede operar una categoria inexistente.
- No se puede eliminar categoria con productos asociados.

### `src/modules/categories/categories.repository.js`

Responsabilidad:

- Encapsular acceso a datos con Prisma.
- Exponer operaciones de lectura/escritura sobre la tabla `Category`.
- Mantener queries reutilizables y aisladas del resto del modulo.

Operaciones actuales:

- `findAllCategories`
- `findCategoryById`
- `findCategoryByName`
- `createCategory`
- `updateCategory`
- `hasRelatedProducts`
- `deleteCategory`

Detalle importante:

- Retorna `_count.products` para que el cliente pueda saber si una categoria tiene productos relacionados.

### `src/modules/categories/categories.schema.js`

Responsabilidad:

- Definir contratos de entrada (validacion) con Zod.
- Centralizar reglas de formato/tipo para evitar duplicacion.

Schemas actuales:

- `categoryIdParamSchema`: valida `:id` como entero positivo.
- `createCategorySchema`: exige `name` (2 a 80 chars, trim).
- `updateCategorySchema`: permite campos parciales y exige al menos uno.

### `src/modules/categories/auth.schema.js`

Estado actual:

- Archivo presente pero vacio/no utilizado por el modulo `categories`.

Recomendacion:

- Eliminarlo si no se va a usar, o renombrarlo si su objetivo era otro (por ejemplo `categories.auth.schema.js` para permisos futuros).

## 3) Archivos compartidos involucrados en `categories`

### `src/app/routes.js`

- Monta el subrouter: `router.use("/categories", categoryRoutes)`.

### `src/app/app.js`

- Registra middlewares globales y monta `/api`.
- Orden clave:
  1. parsing y seguridad (`cors`, `helmet`, `morgan`, `express.json`)
  2. rutas de negocio (`/api`)
  3. `notFoundMiddleware`
  4. `errorMiddleware`

### `src/lib/validate.js`

- Helper `parseSchema(schema, value, message)`:
  - ejecuta `safeParse`
  - si falla, lanza `HttpError(400)` con `details` amigables.

### `src/lib/http-error.js`

- Clase `HttpError` para estandarizar errores con `statusCode`.
- Factories: `badRequest`, `notFound`, `conflict`.

### `src/middlewares/not-found.middleware.js`

- Si ninguna ruta coincide, genera `404` uniforme.

### `src/middlewares/error.middleware.js`

- Handler global de errores.
- Convierte errores de dominio/Prisma en respuestas JSON consistentes.

### `src/lib/prisma.js`

- Cliente Prisma compartido.
- `repository` consume este cliente para interactuar con PostgreSQL.

## 4) Flujo completo de una peticion (ejemplo: `PATCH /api/categories/:id`)

1. Llega request a Express.
2. `app.js` la enruta a `/api`.
3. `routes.js` deriva a `/categories`.
4. `category.routes.js` ejecuta `updateCategory` del controller.
5. `categories.controller.js`:
   - valida `id` y `body` con `categories.schema.js`
   - llama `updateExistingCategory` del service
6. `categories.service.js`:
   - verifica que exista categoria
   - valida regla de nombre unico
   - llama `updateCategory` del repository
7. `categories.repository.js`:
   - ejecuta query Prisma `update`
   - retorna DTO seleccionado
8. Controller responde `200`.
9. Si hay error en cualquier punto:
   - pasa por `next(error)`
   - `error.middleware.js` produce respuesta estandar.

## 5) Contrato de respuesta recomendado (actual)

Respuestas exitosas:

- `200/201`: `{ ok: true, data: ... }`
- `204`: sin body

Respuestas de error:

- `{ ok: false, message, details? }`
- En desarrollo puede incluir `stack`.

## 6) Por que esta separacion es escalable

- Permite cambiar Prisma por otra capa de datos sin tocar controller.
- Facilita test unitarios:
  - service: mock de repository
  - controller: mock de service
- Evita mezclar validacion, negocio y DB en el mismo archivo.
- Simplifica agregar features futuras:
  - paginacion y filtros en `findAllCategories`
  - soft delete
  - auditoria
  - autorizacion por roles

## 7) Guia rapida para agregar nuevas funcionalidades en `categories`

1. Definir/actualizar schema en `categories.schema.js`.
2. Agregar regla de negocio en `categories.service.js`.
3. Crear/ajustar query en `categories.repository.js`.
4. Exponer endpoint en `categories.controller.js`.
5. Registrar ruta en `category.routes.js`.
6. Verificar que errores salgan por `error.middleware.js`.

## Endpoint productos.

### Tener en cuenta que:

1. Los modelos ya los tenemos creados, guiardos a base de ahi.
