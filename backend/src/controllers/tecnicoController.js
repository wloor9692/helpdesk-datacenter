const Tecnico = require('../models/Tecnico');

const ok = (res, data, message = 'OK', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

// GET /api/tecnicos
exports.getTecnicos = async (req, res, next) => {
  try {
    const { disponible, especialidad } = req.query;
    const filtro = {};
    if (disponible  !== undefined) filtro.disponible  = disponible === 'true';
    if (especialidad) filtro.especialidad = especialidad;

    const tecnicos = await Tecnico.find(filtro).sort('nombre');
    ok(res, tecnicos, 'Técnicos obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

// GET /api/tecnicos/:id
exports.getTecnicoById = async (req, res, next) => {
  try {
    const tecnico = await Tecnico.findById(req.params.id);
    if (!tecnico) return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
    ok(res, tecnico);
  } catch (error) {
    next(error);
  }
};

// POST /api/tecnicos
exports.createTecnico = async (req, res, next) => {
  try {
    const tecnico = await Tecnico.create(req.body);
    ok(res, tecnico, 'Técnico registrado correctamente', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tecnicos/:id
exports.updateTecnico = async (req, res, next) => {
  try {
    const tecnico = await Tecnico.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!tecnico) return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
    ok(res, tecnico, 'Técnico actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tecnicos/:id
exports.deleteTecnico = async (req, res, next) => {
  try {
    const tecnico = await Tecnico.findByIdAndDelete(req.params.id);
    if (!tecnico) return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
    ok(res, { id: req.params.id }, 'Técnico eliminado correctamente');
  } catch (error) {
    next(error);
  }
};
