const { Router } = require('express');
const { obtenerPagos, obtenerPago, crearPago, actualizarPago, borrarPago, obtenerPagoCliente, obtenerPago2 } = require('../controllers/payment.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', obtenerPagos, validarJWT);

router.get('/client/', obtenerPago2, validarJWT);

router.get('/cliente/', [

    check('cliente', 'El argumento cliente es obligatorio').not().isEmpty(),
    //validarCampos,
    validarJWT
], obtenerPagoCliente);

router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], obtenerPago);

router.post('/', [
    check('companyia', 'El argumento compañía es obligatorio').not().isEmpty(),
    check('cliente', 'El argumento cliente es obligatorio').not().isEmpty(),
    check('plan', 'El argumento plan es obligatorio').not().isEmpty(),
    check('periodoIni', 'El argumento periodoIni es obligatorio').not().isEmpty(),
    check('periodoFin', 'El argumento periodoFin es obligatorio').not().isEmpty(),
    check('precio', 'El argumento precio es obligatorio').not().isEmpty(),
    // check('imagen', 'La imagen es obligatoria').not().isEmpty(),
    validarCampos,
    validarJWT
], crearPago);


router.put('/:id', [
    check('companyia', 'El argumento compañía es obligatorio').not().isEmpty(),
    check('plan', 'El argumento plan es obligatorio').not().isEmpty(),
    check('periodoIni', 'El argumento periodoIni es obligatorio').not().isEmpty(),
    check('periodoFin', 'El argumento periodoFin es obligatorio').not().isEmpty(),
    check('precio', 'El argumento precio es obligatorio').not().isEmpty(),
    // check('imagen', 'La imagen es obligatoria').not().isEmpty(),
    validarCampos,
    validarJWT
], actualizarPago);





router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], borrarPago);

module.exports = router;