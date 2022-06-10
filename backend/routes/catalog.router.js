/*
    Ruta base: /api/catalogos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');

const {
    obtenerCatalogos,
    crearCatalogo,
    actualizarCatalogo,
    borrarCatalogo,
    obtenerCatalogo,

} = require('../controllers/catalog.controller');

const router = Router();

// GET
router.get('/', obtenerCatalogos, validarJWT);

router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], obtenerCatalogo);

//POST
router.post('/', [
    check('num_modelos', 'El numero de modelos es obligatorio').not().isEmpty(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('fabricante', 'El nombre del fabricante es obligatorio.').not().isEmpty().trim(),
    check('precio', 'El precio obligatorio').not().isEmpty(),
    // check('imagen', 'La imagen es obligatoria').not().isEmpty(),
    validarCampos,
    validarRol,
    validarJWT
], crearCatalogo);

//PUT
router.put('/:id', [
    check('num_modelos', 'El numero de modelos es obligatorio').not().isEmpty(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('fabricante', 'El nombre del fabricante es obligatorio.').not().isEmpty().trim(),
    check('precio', 'El precio obligatorio').not().isEmpty(),
    // check('imagen', 'La imagen es obligatoria').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRol,
    validarJWT
], actualizarCatalogo);

// DELETE
router.delete('/:id', [
    //validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    validarJWT
], borrarCatalogo);


module.exports = router;