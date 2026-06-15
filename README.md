**Posts & Comments Manager**  
Aplicación full-stack para administrar publicaciones y comentarios, desarrollada con Angular, NestJS y MongoDB.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OYQ1AABSAwc8mi5wvkwZyCKCAACr4Z7a7BLfMzFYdAQDwF+da3dX+9QQAgNeuB6feBdUJcyS2AAAAAElFTkSuQmCC)  
**Tecnologías**  
- Angular 18+  
- TypeScript  
- Bootstrap 5  
- Angular Signals  
- RxJS  
- NestJS  
- MongoDB  
- Mongoose  
- Docker / Docker Compose  
- Jest / Supertest  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANElEQVR4nO3OQQmAABRAsSdYxKa/jL0MIR7FCt5E2BJsmZmt2gMA4C+Otbqr8+sJAACvXQ85SAYUQNBTfQAAAABJRU5ErkJggg==)  
**Estructura del proyecto**  
posts-comments-manager/  
 ├── backend-nest/  
 ├── frontend-angular/  
 ├── docker-compose.yml  
 └── README.md  
   
Documentación adicional:  
- [backend-nest/README.md](./backend-nest/README.md "./backend-nest/README.md")  
- [frontend-angular/README.md](./frontend-angular/README.md "./frontend-angular/README.md")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJGkPcrHpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJkELjbMzy0AAAAASUVORK5CYII=)  
**Requisitos**  
- Node.js 18 o superior (se recomienda Node 20 con NestJS 11)  
- npm  
- Docker  
- Docker Compose v1 o Docker Compose v2  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBACPykMH4NpGACyywEZJWQZeZ2aszAAD+4l6rrTo+jgAA8N71AL/CBEiG5xPoAAAAAElFTkSuQmCC)  
**Instalación**  
Clonar el repositorio e instalar dependencias en backend y frontend:  
git clone <url-del-repositorio>  
 cd posts-comments-manager  
   
 cd backend-nest  
 npm install  
   
 cd ../frontend-angular  
 npm install  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNBCkJfE1pYGfHAiAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse4dwF6o2O55YAAAAASUVORK5CYII=)  
**Levantar MongoDB**  
Desde la raíz del repositorio:  
**Docker Compose v2:**  
docker compose up -d  
   
**Docker Compose v1:**  
docker-compose up -d  
   
Si el comando docker compose no funciona, usar docker-compose.  
| | |  
|-|-|  
| **Parámetro** | **Valor** |   
| Contenedor | pcm-mongodb |   
| Puerto | 27017 |   
| Usuario / contraseña | admin / admin123 |   
| Base de datos | posts_comments_manager |   
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJGkPcrHpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJkELjbMzy0AAAAASUVORK5CYII=)  
**Ejecutar backend local**  
cd backend-nest  
 cp .env.example .env  
 npm install  
 npm run start:dev  
   
Backend: [http://localhost:3000](http://localhost:3000 "http://localhost:3000")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsScYxpg/h5VMYARvRrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA224BcUMk6pDAAAAAElFTkSuQmCC)  
**Ejecutar frontend**  
Con MongoDB y backend activos:  
cd frontend-angular  
 npm install  
 npm start  
   
Frontend: [http://localhost:4200/posts](http://localhost:4200/posts "http://localhost:4200/posts")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNBCkLfE07YGfHAiAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrse4eQF6VhvmPsAAAAASUVORK5CYII=)  
**Ejecutar backend con Docker**  
Opcional. El servicio backend usa el profile backend en docker-compose.yml, por lo que no se levanta con un up -d que solo incluya MongoDB.  
Desde la raíz del repositorio:  
**Docker Compose v2:**  
docker compose --profile backend up -d  
   
**Docker Compose v1:**  
docker-compose --profile backend up -d  
   
También puede indicarse el servicio por nombre:  
docker compose up -d mongodb backend  
 # o: docker-compose up -d mongodb backend  
   
El contenedor pcm-backend expone la API en [http://localhost:3000. El frontend se ejecuta localmente con npm start en frontend-angular/.](http://localhost:3000 "http://localhost:3000")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSd4NIGBzPXBmAawhhW8ibAl2DIze3UGAMBf3Gu1VcfXEwAAXrsehaQEN+8fLHEAAAAASUVORK5CYII=)  
**Funcionalidades**  
- Listar publicaciones  
- Crear publicación  
- Editar publicación  
- Eliminar publicación  
- Ver detalle de publicación  
- Crear comentarios  
- Eliminar comentarios  
- Contador de comentarios por publicación  
- Paginación real en publicaciones  
- Búsqueda por título o autor  
- Carga masiva de posts vía API  
- Manejo global de errores  
- Modal visual para confirmaciones  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBCkLfFR7wwIgHRiywEZJWQZeZ2ao9AAD+4lyruzq+ngAA8Nr1AOIEBeX8aGZPAAAAAElFTkSuQmCC)  
**API principal**  
**Posts**  
| | |  
|-|-|  
| **Método** | **Ruta** |   
| GET | /posts |   
| GET | /posts?page=1&limit=6 |   
| GET | /posts?page=1&limit=6&search=texto |   
| GET | /posts/:id |   
| POST | /posts |   
| PUT | /posts/:id |   
| DELETE | /posts/:id |   
| POST | /posts/bulk |   
   
**Comments**  
| | |  
|-|-|  
| **Método** | **Ruta** |   
| GET | /comments?postId={id} |   
| POST | /comments |   
| DELETE | /comments/:id |   
   
Todas las respuestas usan el formato ApiResponse. Detalle en [backend-nest/README.md.](./backend-nest/README.md "./backend-nest/README.md")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJOUPcjIpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJEEL8XMiYMAAAAASUVORK5CYII=)  
**Carga masiva**  
Archivo de ejemplo:  
backend-nest/examples/posts-bulk.example.json  
   
curl -X POST http://localhost:3000/posts/bulk \  
   -H "Content-Type: application/json" \  
   --data-binary @backend-nest/examples/posts-bulk.example.json  
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/kSGMYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qrBdGuSdJuAAAAAElFTkSuQmCC)  
**Postman**  
Colección disponible en:  
backend-nest/docs/postman/posts-comments-manager.postman_collection.json  
   
Variables de colección: baseUrl, postId, commentId.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AUBBAsUeCE4yeIiT9CRVMWGAjJK2CbjNzVGcAAPzF2qu7Wl9PAAB47XoA/vcF8exqpY4AAAAASUVORK5CYII=)  
**Pruebas**  
**Backend:**  
cd backend-nest  
 npm run build  
 npm test  
 npm run test:e2e  
   
**Frontend:**  
cd frontend-angular  
 npm run build  
   
npm run test:e2e del backend requiere MongoDB activo.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNhYMEBIpD4ArCJDyywEZJWQZeZOaorAAD+4l6rrTq/ngAA8Nr+AEqmA1hl45m5AAAAAElFTkSuQmCC)  
**Variables de entorno**  
El backend usa las variables definidas en:  
backend-nest/.env.example  
   
Copiar a .env antes de ejecutar. No subir .env al repositorio.  
   
| | |  
|-|-|  
| **Variable** | **Valor por defecto** |   
| PORT | 3000 |   
| MONGODB_URI | mongodb://admin:admin123@localhost:27017/posts_comments_manager?authSource=admin |   
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/kC1sYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qzBdC53Vr8AAAAAElFTkSuQmCC)  
**Notas**  
- node_modules, dist, .env, .angular, coverage y .cursor deben estar ignorados por git.  
- El repositorio debe mantenerse público para evaluación.  
