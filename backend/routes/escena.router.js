const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');


const {
    obtenerEscenas,
    obtenerEscena,
    crearEscena,
    borrarEscena,
    actualizarEscena,
    obtenerEscenasProyecto,
} = require('../controllers/escena.controller');

const router = Router();

// GET
router.get('/', obtenerEscenas, validarJWT);
router.get('/proyecto/', obtenerEscenasProyecto, validarJWT);


router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], obtenerEscena);

//POST
router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('proyecto_uid', 'El proyecto_uid obligatorio').not().isEmpty(),
    check('muebles', 'Los muebles son obligatorio').not().isEmpty().trim(),
    check('fechaC', 'La fehca obligatorio').not().isEmpty(),
    validarCampos,
    validarRol,
    validarJWT
], crearEscena);

//PUT
router.put('/:id', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('proyecto_uid', 'El proyecto_uid obligatorio').not().isEmpty(),
    check('muebles', 'Los muebles son obligatorio').not().isEmpty().trim(),
    check('fechaC', 'La fehca obligatorio').not().isEmpty(),
    validarCampos,
    validarRol,
    validarJWT
], actualizarEscena);

// DELETE
router.delete('/:id', [
    //validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    validarJWT
], borrarEscena);

module.exports = router;