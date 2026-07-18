const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/tecnicoController');

router.get('/',    controller.getTecnicos);
router.get('/:id', controller.getTecnicoById);
router.post('/',   controller.createTecnico);
router.put('/:id', controller.updateTecnico);
router.delete('/:id', controller.deleteTecnico);

module.exports = router;
