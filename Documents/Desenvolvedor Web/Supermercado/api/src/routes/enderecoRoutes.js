const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController.js')

router.post('/', enderecoController.create);
router.get('/:id', enderecoController.findById);
router.put('/:id', enderecoController.update);
router.delete('/:id', enderecoController.delete);

module.exports = router