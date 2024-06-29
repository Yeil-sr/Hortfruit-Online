const express = require('express');
const pagamentoController = require('../controllers/pagamentoController.js');
const router = express.Router();

router.post('/processar', pagamentoController.processarPagamento);
router.delete('/cancelar/:pagamentoId', pagamentoController.cancelarPagamento);

module.exports = router;
