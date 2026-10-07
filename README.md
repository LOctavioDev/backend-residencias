# Backend Residencias

API REST para el sistema de seguimiento de egresados. Gestiona el registro de egresados, su historial laboral y la autenticación del administrador, y expone los datos agregados que consumen las gráficas del panel de administración.

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-20-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?style=flat-square&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

## Contenido

- [Proyectos relacionados](#proyectos-relacionados)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Crear el usuario administrador](#crear-el-usuario-administrador)
- [Autenticación](#autenticación)
- [Referencia de la API](#referencia-de-la-api)
- [Modelo de datos](#modelo-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Limitaciones conocidas](#limitaciones-conocidas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Proyectos relacionados

| Proyecto | Descripción |
|---|---|
| [frontend-residencias](https://github.com/LOctavioDev/frontend-residencias) | Panel de administración (React + Vite) que consume esta API. |
| [backend-residencias](https://github.com/LOctavioDev/backend-residencias) | Este repositorio. |
| [script_migarte](https://github.com/LOctavioDev/script_migarte) | Script en Python para migrar registros desde una hoja de cálculo a MongoDB. |

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior y npm
- Una instancia de [MongoDB](https://www.mongodb.com/) 6 o superior (local, en Docker o en la nube)

## Instalación

```bash
git clone https://github.com/LOctavioDev/backend-residencias.git
cd backend-residencias
npm install
cp .env.example .env   # edita los valores
npm run dev
```

El servidor queda disponible en `http://localhost:11111` (o en el puerto definido en `PORT`). Una petición `GET /` responde `REST API Students`.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | No | Puerto HTTP. Por defecto `11111`. |
| `MONGO_URI` | Sí | Cadena de conexión a MongoDB, incluyendo el nombre de la base. Ejemplo: `mongodb://usuario:password@localhost:27017/residencias?authSource=admin` |
| `JWT_SECRET` | Sí | Secreto para firmar los tokens. Genera uno con `openssl rand -hex 32`. |
| `CLIENT_ID` | No | Client ID de Google OAuth. Solo es necesario para el inicio de sesión con Google. |

> Si la contraseña de MongoDB contiene caracteres especiales (`@`, `:`, `/`, `#`, etc.), debe ir codificada para URL dentro de `MONGO_URI`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática (nodemon + ts-node). |
| `npm run build` | Compila TypeScript a JavaScript en `dist/`. |
| `npm start` | Ejecuta la versión compilada (`dist/index.js`). Requiere `npm run build` antes. |
| `npm run create-admin -- <correo> <contraseña> [nombre]` | Crea o actualiza el usuario administrador. |

## Crear el usuario administrador

El panel solo permite el acceso a un usuario marcado como administrador. Para crearlo, o para cambiar su contraseña:

```bash
npm run create-admin -- admin@ejemplo.com "una-contraseña-segura" "Nombre del administrador"
```

El comando usa la conexión definida en `.env`. Si el correo ya existe, actualiza la contraseña y el nombre. La contraseña se guarda cifrada con bcrypt.

## Autenticación

La API usa JSON Web Tokens con una vigencia de 24 horas. Hay dos formas de obtener un token:

1. **Correo y contraseña:** `POST /auth/login`.
2. **Google OAuth:** `POST /auth/googleAuth` con el `credential` que entrega Google Identity Services. Solo se acepta si el correo de Google coincide con el del administrador y `CLIENT_ID` está configurado.

Las rutas protegidas esperan el token en el encabezado `auth-token`:

```http
GET /api HTTP/1.1
Host: localhost:11111
auth-token: <token>
```

Ejemplo de inicio de sesión:

```bash
curl -X POST http://localhost:11111/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ejemplo.com","password":"una-contraseña-segura"}'
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "name": "Nombre del administrador", "email": "admin@ejemplo.com" }
}
```

## Referencia de la API

### Autenticación (`/auth`)

| Método | Ruta | Protegida | Cuerpo | Descripción |
|---|---|---|---|---|
| `POST` | `/auth/login` | No | `{ email, password }` | Inicia sesión con correo y contraseña. Devuelve `token` y `user`. |
| `POST` | `/auth/googleAuth` | No | `{ tokenId }` | Inicia sesión con una credencial de Google. |
| `POST` | `/auth/singUp` | No | `{ email, password }` | Registra un usuario. |
| `POST` | `/auth/singIn` | No | `{ email }` | Ruta heredada; ver [Limitaciones conocidas](#limitaciones-conocidas). |
| `PUT` | `/auth/admin` | No | `{ email?, name? }` | Actualiza el correo o el nombre del administrador. |

### Egresados (`/api`)

Todas las rutas requieren el encabezado `auth-token`.

| Método | Ruta | Cuerpo | Descripción |
|---|---|---|---|
| `GET` | `/api` | | Lista todos los egresados. |
| `GET` | `/api/:control_number` | | Obtiene un egresado por número de control. |
| `POST` | `/api` | Documento de egresado | Crea un egresado. |
| `PUT` | `/api/:control_number` | Campos a actualizar | Actualiza un egresado. |
| `DELETE` | `/api/:control_number` | | Elimina un egresado. |
| `DELETE` | `/api/all` | | Elimina todos los egresados. |

### Historial laboral

| Método | Ruta | Cuerpo | Descripción |
|---|---|---|---|
| `GET` | `/api/:id/company-history` | | Devuelve el historial de empresas. |
| `PUT` | `/api/:control_number/company-history` | `{ name, startDateH, endDateH }` | Agrega una empresa al historial. |
| `PUT` | `/api/:control_number/company-history/edit` | `{ companyIndex, updatedCompany }` | Edita la empresa en la posición indicada. |
| `DELETE` | `/api/:control_number/company-history/delete` | `{ companyIndex }` | Elimina la empresa en la posición indicada. |

### Estadísticas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/students/city` | Egresados agrupados por estado de la empresa, con porcentaje. Responde `404` si no hay registros. |
| `GET` | `/api/students/generation` | Egresados agrupados por año de egreso. |
| `GET` | `/api/students/jobType` | Egresados agrupados por sector. |
| `GET` | `/api/students/activity` | Egresados agrupados por actividad actual (trabaja, estudia, etc.). |

### Códigos de respuesta

| Código | Significado |
|---|---|
| `200` / `201` | Operación correcta / recurso creado. |
| `400` | Datos inválidos. |
| `401` | Token ausente o inválido, o credenciales incorrectas. |
| `403` | El usuario no es administrador. |
| `404` | Recurso no encontrado. |
| `500` | Error interno; el cuerpo incluye `error` con el detalle. |

## Modelo de datos

### Egresado (`Student`)

Las fechas se guardan como marcas de tiempo Unix en segundos.

| Campo | Tipo | Notas |
|---|---|---|
| `control_number` | String | Obligatorio, único. |
| `career` | String | Obligatorio. |
| `name` | `{ first, last, middle? }` | Nombre y apellidos. |
| `generation` | `{ startDate, endDate }` | Periodo de la generación. |
| `email` | String | Obligatorio, único. |
| `curp` | String | Obligatorio, único. |
| `birthdate`, `graduation_date` | Number | Marca de tiempo Unix. |
| `activity` | `{ activities: String[] }` | Actividad actual. |
| `marital_status`, `gender`, `phone`, `home_address`, `cp` | String | Datos personales. |
| `student_city`, `student_municipality`, `student_state` | String | Domicilio del egresado. |
| `certificate`, `graduation_option`, `post_graduation` | String | Datos académicos. |
| `company` | Objeto | Empresa actual: nombre, jefe, dirección, contacto, salario, ubicación, puesto, nivel jerárquico. |
| `companyHistory` | Arreglo | Empresas anteriores: `{ name, startDateH, endDateH }`. |
| `working_condition` | `{ type }` | Condición laboral. |
| `sector`, `institution`, `profile`, `contact_source`, `studentAt` | String | Datos de seguimiento. |
| `updatedAt` | Date | Se asigna automáticamente al crear el registro. |

### Usuario (`User`)

| Campo | Tipo | Notas |
|---|---|---|
| `email` | String | Obligatorio, único. |
| `password` | String | Cifrada con bcrypt al guardar. |
| `name` | String | Opcional. |
| `googleId` | String | Se asigna al iniciar sesión con Google. |
| `isAdmin` | Boolean | Por defecto `true`. |

## Estructura del proyecto

```
src/
├── config/
│   ├── config.ts            Puerto y secreto JWT
│   └── db.ts                Conexión a MongoDB
├── controllers/
│   ├── authController.ts    Inicio de sesión, registro y administrador
│   └── studentController.ts CRUD de egresados, historial y estadísticas
├── models/
│   ├── Student.ts
│   └── User.ts
├── routes/
│   ├── authRoutes.ts        /auth
│   └── studentRoutes.ts     /api
├── scripts/
│   └── createAdmin.ts       npm run create-admin
├── services/
│   └── auth.service.ts      Generación de JWT
├── types/
│   └── express.d.ts         Tipos extendidos de Request
├── utils/
│   └── verifyToken.ts       Middleware de autenticación
├── logger.ts                Registro con Winston
└── index.ts                 Punto de entrada
```

Los registros se escriben en consola, en `combined.log` y, para errores, en `error.log`.

## Limitaciones conocidas

- `POST /auth/singIn` entrega un token válido sin verificar la contraseña. El panel no la utiliza; se recomienda eliminarla o protegerla antes de exponer la API fuera de una red de confianza.
- `PUT /auth/admin` no requiere token.
- CORS está abierto a cualquier origen.

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio: `git checkout -b feature/mi-cambio`.
3. Verifica que compile: `npm run build`.
4. Envía un pull request describiendo el cambio.

## Licencia

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE) para más información.

Copyright (c) 2024 Luis Octavio.
