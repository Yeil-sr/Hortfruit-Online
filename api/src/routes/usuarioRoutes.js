const express = require('express');
const usuarioController = require('../controllers/usuarioController.js');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware'); 


router.get('/user', usuarioController.getUser);
router.get('/user/:id', usuarioController.getUserById);
router.get('/user/email/:email', usuarioController.getUserByEmail);
router.post('/logout', usuarioController.logout);
router.post('/', usuarioController.createUser);
router.post('/login', usuarioController.authenticate);
router.post('/recuperar-senha', usuarioController.initiatePasswordReset);
router.post('/redefinir-senha', usuarioController.resetPassword);

module.exports = router;
