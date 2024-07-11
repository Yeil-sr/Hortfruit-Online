const express = require('express');
const path = require('path');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const upload = require('../multerConfig/multerConfig.js');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Importando o middleware


router.post('/',isAuthenticated,fornecedorController.create);
router.get('/:id',isAuthenticated, fornecedorController.findById);
router.put('/:id', isAuthenticated,fornecedorController.update);
router.delete('/', isAuthenticated,fornecedorController.delete);
router.get('/',isAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/fornecedor.html'));
});
// Rota para servir as partials
router.get('/partials/fornecedor:partial', (req, res) => {
    const partial = req.params.partial;
    res.sendFile(path.join(__dirname, '../views/partials/fornecedor', partial));
});

module.exports = router;