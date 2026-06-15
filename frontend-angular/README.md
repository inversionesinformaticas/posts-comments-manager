# Posts & Comments Manager — Frontend

SPA en Angular 18 para gestionar publicaciones y comentarios contra la API del backend.

---

## Stack

- Angular 18+
- TypeScript
- Bootstrap 5
- Angular Signals
- RxJS
- Reactive Forms

Requisito: backend en [http://localhost:3000](http://localhost:3000) y MongoDB activo. Ver [README raíz](../README.md).

---

## Instalación

```bash
cd frontend-angular
npm install
```

---

## Ejecución

```bash
npm start
```

Build de producción:

```bash
npm run build
```

---

## URL local

[http://localhost:4200/posts](http://localhost:4200/posts)

---

## Configuración de API

El frontend consume el backend mediante `apiUrl` en `src/environments/environment.ts`:

```typescript
apiUrl: 'http://localhost:3000'
```

Si el backend corre en otro host o puerto, actualizar ese valor antes de levantar la app.

---

## Funcionalidades UI

- Listado de publicaciones con paginación
- Búsqueda por título o autor
- Contador de comentarios por publicación
- Detalle de publicación con comentarios
- Crear, editar y eliminar publicaciones
- Crear y eliminar comentarios
- Estados de carga y empty states
- Mensajes de éxito y error
- Modal visual de confirmación antes de eliminar

### Pantallas

| Ruta | Función |
|------|---------|
| `/posts` | Listado, búsqueda, paginación y eliminación |
| `/posts/new` | Crear publicación |
| `/posts/:id` | Detalle, comentarios, crear/eliminar comentarios |
| `/posts/:id/edit` | Editar publicación |

---

## Paginación y búsqueda

La búsqueda y la paginación se resuelven en el backend con `GET /posts?page=&limit=&search=`. El frontend envía el término de búsqueda y la página actual; no filtra el listado en cliente.

---

## Angular Signals

Signals gestionan el estado de UI del listado: publicaciones cargadas, término de búsqueda, página actual, totales de paginación y estados de carga. Los `computed()` derivan condiciones de interfaz, como catálogo vacío o si la paginación está en la primera o última página.

---

## RxJS

Los servicios HTTP usan RxJS para consumir la API: peticiones con `switchMap`, validación de respuestas, manejo de errores con `catchError` y reintentos en lecturas. Un interceptor global delega los errores HTTP en `ErrorService`, que muestra mensajes en pantalla.

---

## Formularios reactivos

Los formularios de publicaciones y comentarios usan Reactive Forms con validaciones en cliente.

---

## Modal de confirmación

Las acciones de eliminación (publicaciones y comentarios) muestran un modal de confirmación antes de ejecutar la operación.

---

## Build

```bash
npm run build
```

Salida en `dist/frontend-angular/`.
