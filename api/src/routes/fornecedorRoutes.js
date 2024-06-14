const express = require('express');
const path = require('path');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');
const upload = require('../multerConfig/multerConfig.js');


router.post('/',fornecedorController.create);
router.get('/:id', fornecedorController.findById);
router.put('/:id', fornecedorController.update);
router.delete('/', fornecedorController.delete);
router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/fornecedor.html'));
});
// Rota para servir as partials
router.get('/partials/fornecedor:partial', (req, res) => {
    const partial = req.params.partial;
    res.sendFile(path.join(__dirname, '../views/partials/fornecedor', partial));
});

module.exports = router;