// produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.index); // Rota para listar todos os produtos
router.get('/produto/fornecedor/:fornecedor_id', produtoController.getProdutosByFornecedor);
router.get('/editar/:id', produtoController.editarProduto);
router.post('/', produtoController.addProduto); // Rota para adicionar um novo produto
router.put('/:id', produtoController.updateProduto); // Corrigindo a rota para apontar para o método correto de atualização do produto
router.delete('/:id', produtoController.deleteProduto); // Rota para deletar um produto existente

module.exports = router;
