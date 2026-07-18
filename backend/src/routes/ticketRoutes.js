const express = require('express');
const { body, param } = require('express-validator');
const router     = express.Router();
const controller = require('../controllers/ticketController');
const validate   = require('../middlewares/validate');

// ── Validaciones reutilizables ───────────────────────────────
const ticketRules = [
  body('solicitante.nombre')
    .trim().notEmpty().withMessage('El nombre del solicitante es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('solicitante.correo')
    .trim().notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Formato de correo inválido'),

  body('titulo')
    .trim().notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 5, max: 150 }).withMessage('Entre 5 y 150 caracteres'),

  body('descripcion')
    .trim().notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 20 }).withMessage('Mínimo 20 caracteres'),

  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isIn([
      'hardware-servidor','hardware-almacenamiento','hardware-periferico',
      'red-lan','red-wan','red-vpn',
      'software-so','software-bd','software-aplicacion','software-seguridad',
    ]).withMessage('Categoría no válida'),

  body('prioridad')
    .optional()
    .isIn(['critica','alta','media','baja']).withMessage('Prioridad no válida'),
];

const idRule = param('id').isMongoId().withMessage('ID inválido');

// ── Rutas ────────────────────────────────────────────────────

// Estadísticas (debe ir antes de /:id para no confundirse)
router.get('/stats/resumen', controller.getStats);

// Buscar por código legible
router.get('/codigo/:codigo', controller.getTicketByCodigo);

// CRUD estándar
router.get('/',    controller.getTickets);
router.get('/:id', [idRule, validate], controller.getTicketById);

router.post('/', [...ticketRules, validate], controller.createTicket);

router.put('/:id', [idRule, validate], controller.updateTicket);

// Acciones parciales
router.patch('/:id/estado',  [idRule, validate], controller.updateEstado);
router.patch('/:id/asignar', [idRule, validate], controller.asignarTecnico);
router.post( '/:id/notas',   [idRule, validate], controller.addNota);

router.delete('/:id', [idRule, validate], controller.deleteTicket);

module.exports = router;
