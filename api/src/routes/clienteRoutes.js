const express = require('express');
const router = express.Router();
const path = require('path');
const clienteController = require('../controllers/clienteController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Importando o middleware

router.post('/', isAuthenticated, clienteController.create); 
router.put('/:id', isAuthenticated, clienteController.update); 
router.delete('/:id', isAuthenticated, clienteController.delete); 

// Rota para servir as partials
router.get('/partials/cliente:partial', (req, res) => {
    const partial = req.params.partial;
    res.sendFile(path.join(__dirname, '../views/partials/cliente', partial));
});

router.get('/',  (req, res) => { 
    res.sendFile(path.join(__dirname, '../views/cliente.html'));
});

module.exports = router;
