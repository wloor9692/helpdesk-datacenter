const Ticket = require('../models/Ticket');

// ── Helper: respuesta de éxito ───────────────────────────────
const ok = (res, data, message = 'OK', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

// ══════════════════════════════════════════════════════════════
//  GET /api/tickets
//  Obtener todos los tickets con filtros, paginación y orden
// ══════════════════════════════════════════════════════════════
exports.getTickets = async (req, res, next) => {
  try {
    const {
      estado,
      prioridad,
      categoria,
      busqueda,
      page  = 1,
      limit = 10,
      sort  = '-createdAt',
    } = req.query;

    // Construir filtro dinámico
    const filtro = {};
    if (estado)    filtro.estado    = estado;
    if (prioridad) filtro.prioridad = prioridad;
    if (categoria) filtro.categoria = categoria;
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { codigo: { $regex: busqueda, $options: 'i' } },
        { 'solicitante.nombre': { $regex: busqueda, $options: 'i' } },
        { 'tecnicoAsignado.nombre': { $regex: busqueda, $options: 'i' } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Ticket.countDocuments(filtro);

    const tickets = await Ticket.find(filtro)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    ok(res, {
      tickets,
      paginacion: {
        total,
        pagina:       Number(page),
        porPagina:    Number(limit),
        totalPaginas: Math.ceil(total / Number(limit)),
      },
    }, 'Tickets obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  GET /api/tickets/:id
//  Obtener un ticket por su _id de MongoDB
// ══════════════════════════════════════════════════════════════
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }
    ok(res, ticket, 'Ticket obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  GET /api/tickets/codigo/:codigo
//  Obtener un ticket por código legible (ej. TK-00001)
// ══════════════════════════════════════════════════════════════
exports.getTicketByCodigo = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({
      codigo: req.params.codigo.toUpperCase(),
    });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }
    ok(res, ticket, 'Ticket obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  POST /api/tickets
//  Crear un nuevo ticket
// ══════════════════════════════════════════════════════════════
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create(req.body);
    ok(res, ticket, 'Ticket creado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  PUT /api/tickets/:id
//  Actualizar un ticket completo
// ══════════════════════════════════════════════════════════════
exports.updateTicket = async (req, res, next) => {
  try {
    // Evitar modificar el código generado automáticamente
    delete req.body.codigo;

    // Si se marca como resuelto, registrar fecha
    if (req.body.estado === 'resuelto' && !req.body.fechaResolucion) {
      req.body.fechaResolucion = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    ok(res, ticket, 'Ticket actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  PATCH /api/tickets/:id/estado
//  Cambiar solo el estado del ticket
// ══════════════════════════════════════════════════════════════
exports.updateEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const ESTADOS_VALIDOS = ['abierto', 'en-proceso', 'resuelto', 'cerrado'];

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`,
      });
    }

    const update = { estado };
    if (estado === 'resuelto') update.fechaResolucion = new Date();

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    ok(res, ticket, `Estado actualizado a: ${estado}`);
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  PATCH /api/tickets/:id/asignar
//  Asignar técnico a un ticket
// ══════════════════════════════════════════════════════════════
exports.asignarTecnico = async (req, res, next) => {
  try {
    const { nombre, especialidad } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del técnico es obligatorio',
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        tecnicoAsignado: { nombre, especialidad: especialidad || '' },
        estado: 'en-proceso',
      },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    ok(res, ticket, `Ticket asignado a: ${nombre}`);
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  POST /api/tickets/:id/notas
//  Agregar una nota interna al ticket
// ══════════════════════════════════════════════════════════════
exports.addNota = async (req, res, next) => {
  try {
    const { texto, autor } = req.body;

    if (!texto || texto.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'La nota debe tener al menos 3 caracteres',
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { notas: { texto, autor: autor || 'Técnico', fecha: new Date() } } },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    ok(res, ticket, 'Nota agregada correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  DELETE /api/tickets/:id
//  Eliminar un ticket
// ══════════════════════════════════════════════════════════════
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    ok(res, { id: req.params.id }, 'Ticket eliminado correctamente');
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  GET /api/tickets/stats/resumen
//  Estadísticas generales del sistema
// ══════════════════════════════════════════════════════════════
exports.getStats = async (req, res, next) => {
  try {
    const [
      total,
      porEstado,
      porPrioridad,
      porCategoria,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.aggregate([
        { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $group: { _id: '$prioridad', cantidad: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $group: { _id: '$categoria', cantidad: { $sum: 1 } } },
      ]),
    ]);

    ok(res, { total, porEstado, porPrioridad, porCategoria }, 'Estadísticas obtenidas');
  } catch (error) {
    next(error);
  }
};
