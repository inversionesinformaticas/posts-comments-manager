# Posts & Comments Manager — Backend

API REST con NestJS, MongoDB y Mongoose para gestionar publicaciones y comentarios.

---

## Stack

- NestJS 11
- TypeScript
- MongoDB 7
- Mongoose
- class-validator
- Jest / Supertest
- Docker (opcional)

---

## Variables de entorno

Copiar el archivo de ejemplo antes de ejecutar:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://admin:admin123@localhost:27017/posts_comments_manager?authSource=admin` |

No subir `.env` al repositorio.

---

## MongoDB con Docker Compose

Desde la raíz del repositorio:

**Docker Compose v2:**

```bash
docker compose up -d
```

**Docker Compose v1:**

```bash
docker-compose up -d
```

Si el comando `docker compose` no funciona, usar `docker-compose`.

| Parámetro | Valor |
|-----------|-------|
| Contenedor | `pcm-mongodb` |
| Puerto | `27017` |
| Usuario / contraseña | `admin` / `admin123` |
| Base de datos | `posts_comments_manager` |

---

## Ejecución local

```bash
cd backend-nest
npm install
cp .env.example .env
npm run start:dev
```

API disponible en [http://localhost:3000](http://localhost:3000).

---

## Ejecución con Docker

Alternativa opcional al desarrollo local. El servicio `backend` usa el profile `backend` definido en `docker-compose.yml`.

Desde la raíz del repositorio:

**Docker Compose v2:**

```bash
docker compose --profile backend up -d
```

**Docker Compose v1:**

```bash
docker-compose --profile backend up -d
```

También puede levantarse indicando los servicios:

```bash
docker compose up -d mongodb backend
# o: docker-compose up -d mongodb backend
```

El contenedor `pcm-backend` expone el puerto `3000` y usa:

| Variable | Valor en Docker |
|----------|-----------------|
| `PORT` | `3000` |
| `MONGODB_URI` | `mongodb://admin:admin123@mongodb:27017/posts_comments_manager?authSource=admin` |

---

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/posts` | Listar todos los posts |
| GET | `/posts?page=1&limit=6` | Listar posts paginados |
| GET | `/posts?page=1&limit=6&search=texto` | Buscar por título o autor |
| GET | `/posts/:id` | Obtener un post por ID |
| POST | `/posts` | Crear un post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post y sus comentarios |
| POST | `/posts/bulk` | Crear múltiples posts |
| GET | `/comments?postId={id}` | Listar comentarios de un post |
| POST | `/comments` | Crear un comentario |
| DELETE | `/comments/:id` | Eliminar un comentario |

### Formato de respuesta

```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "statusCode": 200,
  "data": []
}
```

Los errores se estandarizan con `GlobalExceptionFilter`.

### Paginación y `commentCount`

`GET /posts` sin query params devuelve un arreglo completo en `data`. Si se envían `page` y/o `limit`, la respuesta incluye `items` y `pagination`. Cada post incluye `commentCount`, calculado desde la colección `comments` y no persistido en la base de datos.

---

## Bulk upload

Archivo de ejemplo:

```
examples/posts-bulk.example.json
```

```bash
curl -X POST http://localhost:3000/posts/bulk \
  -H "Content-Type: application/json" \
  --data-binary @examples/posts-bulk.example.json
```

Desde la raíz del repositorio, usar `backend-nest/examples/posts-bulk.example.json`.

---

## Postman

```
docs/postman/posts-comments-manager.postman_collection.json
```

Variables de colección: `baseUrl`, `postId`, `commentId`.

---

## Tests

```bash
cd backend-nest
npm run build
npm test
npm run test:e2e
```

`npm run test:e2e` requiere MongoDB activo (por ejemplo con `docker compose up -d` desde la raíz del repositorio).

---

## Build

```bash
npm run build
npm run start:prod
```

`start:prod` ejecuta el build compilado en `dist/`.
