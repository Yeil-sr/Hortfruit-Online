const express = require('express');
const pedidoController = require('../controllers/pedidoController.js');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware'); 

router.post('/create', isAuthenticated, pedidoController.createPedido); 
router.put('/atualizar/:pedidoId', isAuthenticated, pedidoController.atualizarPedido); 
router.delete('/cancelar/:pedidoId', isAuthenticated, pedidoController.cancelarPedido); 

module.exports = router;
