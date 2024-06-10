const express = require('express');
const router = express.Router();
const path = require('path');
const clienteController = require('../controllers/clienteController')

router.post('/', clienteController.create);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);
// Rota para servir as partials
router.get('/partials/cliente:partial', (req, res) => {
    const partial = req.params.partial;
    res.sendFile(path.join(__dirname, '../views/partials/cliente', partial));
});

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/cliente.html'));
});





module.exports = router;