// produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const upload = require('../multerConfig/multerConfig');

router.get('/', produtoController.index); // Rota para listar todos os produtos
router.get('/fornecedor/:fornecedor_id', produtoController.getProdutosByFornecedor);
router.get('/editar/:id', produtoController.editarProduto);
router.post('/', upload.single('img_produto'), produtoController.addProduto);
router.put('/:id', upload.single('img_produto'), produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto); // Rota para deletar um produto existente

module.exports = router;
