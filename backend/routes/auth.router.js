/*
Ruta base: /api/login
*/

const { Router } = require('express');
const { login, token, loginGoogle } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], token);

router.post('/', [
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.post('/google', [
    check('token', 'El argumento token de google es obligatorio').not().isEmpty(),
    validarCampos,
], loginGoogle);

module.exports = router;