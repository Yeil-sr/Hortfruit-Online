const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const upload = require('../multerConfig/multerConfig');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Importando o middleware

router.get('/', produtoController.index); 
router.get('/fornecedor/:fornecedor_id', isAuthenticated, produtoController.getProdutosByFornecedor); 
router.get('/editar/:id', isAuthenticated, produtoController.editarProduto); 
router.get('/:id/', produtoController.getProdutoById); 
router.get('/imagem/produto/:id', produtoController.getPictureByProdutoId); 
router.post('/', isAuthenticated, upload.single('img_produto'), produtoController.addProduto); 
router.put('/:id', isAuthenticated, upload.single('img_produto'), produtoController.updateProduto); 
router.delete('/:id', isAuthenticated, produtoController.deleteProduto); 

module.exports = router;
