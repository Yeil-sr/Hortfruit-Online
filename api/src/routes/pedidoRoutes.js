const express = require('express');
const pedidoController = require('../controllers/pedidoController.js');
const router = express.Router();

router.post('/create', pedidoController.createPedido);
router.put('/atualizar/:pedidoId', pedidoController.atualizarPedido);
router.delete('/cancelar/:pedidoId', pedidoController.cancelarPedido);

module.exports = router;
