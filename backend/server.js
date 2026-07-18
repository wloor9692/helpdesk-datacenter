// ══════════════════════════════════════════════════════════════
//  Help Desk API REST – Servidor principal
//  Autor: Walter Alejandro Loor García
//  Asignatura: Desarrollo de Sistemas Informáticos – UTM
// ══════════════════════════════════════════════════════════════

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const connectDB  = require('./src/config/database');
const { errorHandler, notFound } = require('./src/middlewares/errorHandler');

// ── Rutas ────────────────────────────────────────────────────
const ticketRoutes  = require('./src/routes/ticketRoutes');
const tecnicoRoutes = require('./src/routes/tecnicoRoutes');

// ── Conectar a base de datos ─────────────────────────────────
connectDB();

// ── Inicializar Express ──────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ─────────────────────────────────────

// CORS — permite solicitudes desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger HTTP (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Ruta raíz – verificación de salud ───────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🖥️  Help Desk API REST – Sistema de Gestión de Incidentes',
    version: '1.0.0',
    autor:   'Walter Alejandro Loor García',
    universidad: 'Universidad Técnica de Manabí',
    endpoints: {
      tickets:  '/api/tickets',
      tecnicos: '/api/tecnicos',
      stats:    '/api/tickets/stats/resumen',
      health:   '/api/health',
    },
  });
});

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status:  'OK',
    uptime:  `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Rutas de la API ──────────────────────────────────────────
app.use('/api/tickets',  ticketRoutes);
app.use('/api/tecnicos', tecnicoRoutes);

// ── Manejo de rutas no encontradas ──────────────────────────
app.use(notFound);

// ── Manejo centralizado de errores ──────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📦 Entorno: ${process.env.NODE_ENV}`);
  console.log('═══════════════════════════════════════════');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err.message);
  process.exit(1);
});

module.exports = app;
