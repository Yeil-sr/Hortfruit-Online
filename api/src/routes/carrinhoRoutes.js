const express = require('express');
const router = express.Router();
const CarrinhoController = require('../controllers/carrinhoController');

router.post('/add', CarrinhoController.addItem);
router.put('/update', CarrinhoController.updateItem);
router.get('/total/:userId', CarrinhoController.calcularTotal);
router.delete('/clear/:userId', CarrinhoController.limparCarrinho);

module.exports = router;
