const express = require('express');
const usuarioController = require('../controllers/usuarioController.js');
const router = express.Router();

router.get('/user', usuarioController.getUser);
router.post('/logout', usuarioController.logout);
router.post('/', usuarioController.createUser);
router.post('/login', usuarioController.authenticate);
router.post('/recuperar-senha', usuarioController.initiatePasswordReset);
router.post('/redefinir-senha', usuarioController.resetPassword);

module.exports = router;
