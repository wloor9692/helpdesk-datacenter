const { validationResult } = require('express-validator');

// Middleware que evalúa los resultados de express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(e => ({
        campo: e.path,
        mensaje: e.msg,
        valor: e.value,
      })),
    });
  }
  next();
};

module.exports = validate;
