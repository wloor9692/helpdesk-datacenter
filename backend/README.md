# 🖥️ Help Desk API REST – Data Center UTM

**Autor:** Walter Alejandro Loor García  
**Asignatura:** Desarrollo de Sistemas Informáticos – Unidad 4  
**Universidad:** Universidad Técnica de Manabí  
**Actividad:** #8 – Desarrollo del Backend y Base de Datos (API REST)

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js   | v22+    | Runtime del servidor |
| Express   | v4.19   | Framework web |
| MongoDB   | Atlas   | Base de datos NoSQL |
| Mongoose  | v8.4    | ODM para MongoDB |
| dotenv    | v16     | Variables de entorno |
| cors      | v2.8    | Control de acceso cruzado |
| morgan    | v1.10   | Logger HTTP |
| express-validator | v7 | Validación de entradas |

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/wloor9692/helpdesk-datacenter.git
cd helpdesk-datacenter/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu cadena de conexión MongoDB Atlas

# 4. (Opcional) Cargar datos de prueba
node src/utils/seedData.js

# 5. Iniciar el servidor
npm start          # producción
npm run dev        # desarrollo (con nodemon)
```

---

## 📁 Estructura del proyecto

```
backend/
├── server.js                  # Punto de entrada
├── .env                       # Variables de entorno (NO subir a Git)
├── .env.example               # Plantilla de variables
├── package.json
└── src/
    ├── config/
    │   └── database.js        # Conexión a MongoDB
    ├── models/
    │   ├── Ticket.js          # Esquema de ticket
    │   └── Tecnico.js         # Esquema de técnico
    ├── controllers/
    │   ├── ticketController.js
    │   └── tecnicoController.js
    ├── routes/
    │   ├── ticketRoutes.js
    │   └── tecnicoRoutes.js
    ├── middlewares/
    │   ├── errorHandler.js    # Manejo centralizado de errores
    │   └── validate.js        # Middleware de validación
    └── utils/
        └── seedData.js        # Datos iniciales de prueba
```

---

## 📋 Endpoints de la API

### Base URL: `http://localhost:3000`

---

### 🎫 TICKETS – `/api/tickets`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/tickets` | Listar tickets (con filtros y paginación) |
| GET    | `/api/tickets/:id` | Obtener ticket por ID |
| GET    | `/api/tickets/codigo/:codigo` | Obtener por código (ej. TK-00001) |
| GET    | `/api/tickets/stats/resumen` | Estadísticas generales |
| POST   | `/api/tickets` | Crear nuevo ticket |
| PUT    | `/api/tickets/:id` | Actualizar ticket completo |
| PATCH  | `/api/tickets/:id/estado` | Cambiar estado |
| PATCH  | `/api/tickets/:id/asignar` | Asignar técnico |
| POST   | `/api/tickets/:id/notas` | Agregar nota interna |
| DELETE | `/api/tickets/:id` | Eliminar ticket |

#### Parámetros de filtrado (GET /api/tickets)

```
?estado=abierto|en-proceso|resuelto|cerrado
?prioridad=critica|alta|media|baja
?categoria=hardware-servidor|red-lan|software-bd|...
?busqueda=texto
?page=1&limit=10
?sort=-createdAt
```

---

### 👷 TÉCNICOS – `/api/tecnicos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/tecnicos` | Listar técnicos |
| GET    | `/api/tecnicos/:id` | Obtener por ID |
| POST   | `/api/tecnicos` | Registrar técnico |
| PUT    | `/api/tecnicos/:id` | Actualizar técnico |
| DELETE | `/api/tecnicos/:id` | Eliminar técnico |

---

## 📝 Ejemplos de uso con cURL

### Crear ticket
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "solicitante": {
      "nombre": "Walter Loor",
      "correo": "wloor@utm.edu.ec",
      "departamento": "Infraestructura TI"
    },
    "titulo": "Servidor de base de datos no responde",
    "descripcion": "El servidor SRV-DB-01 dejó de responder. Los servicios MySQL y PostgreSQL no inician desde las 08:25.",
    "categoria": "software-bd",
    "prioridad": "critica"
  }'
```

### Obtener todos los tickets críticos
```bash
curl "http://localhost:3000/api/tickets?prioridad=critica&estado=abierto"
```

### Cambiar estado de un ticket
```bash
curl -X PATCH http://localhost:3000/api/tickets/<ID>/estado \
  -H "Content-Type: application/json" \
  -d '{"estado": "en-proceso"}'
```

### Asignar técnico
```bash
curl -X PATCH http://localhost:3000/api/tickets/<ID>/asignar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ing. María López", "especialidad": "software"}'
```

### Estadísticas
```bash
curl http://localhost:3000/api/tickets/stats/resumen
```

---

## 🔗 Gestión con Gitflow

```bash
git checkout develop
git checkout -b feature/backend-api
# (desarrollar y probar)
git add .
git commit -m "feat: implementar API REST con Node.js, Express y MongoDB"
git push -u origin feature/backend-api
```

---

## ☁️ Despliegue en Render

1. Crear cuenta en [render.com](https://render.com)
2. New → Web Service → conectar repositorio GitHub
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agregar variables de entorno (MONGODB_URI, PORT, NODE_ENV)
