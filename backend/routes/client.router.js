// Base path for admin
// /api/admins

const { Router } = require('express');
const { check, query } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');
const {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    borrarCliente,
    actualizarPlan,
    actualizarPassword,
    listaClientes,
    actualizarCatalogos
} = require('../controllers/client.controller');

const router = Router();

router.put('/catalogos/', [

], actualizarCatalogos);

// GET
router.get('/', [
    validarJWT,
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim(),
    validarCampos
], obtenerClientes);

// POST
router.post('/', [
    // check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    // check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    // check('nombreEmpresa', 'El nombre de la empresa es obligatorio.').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    // check('telefono', 'El teléfono es obligatorio.').not().isEmpty(),
    check('company', 'El argumento compañia es obligatorio').not().isEmpty(),
    // check('plan', 'El argumento plan es obligatorio').not().isEmpty(),
    // check('numProjects', 'El argumento nº de proyectos es obligatorio.').not().isEmpty(),
    // check('numCatalog', 'El argumento nº de catálogos es obligatorio').not().isEmpty(),
    // check('alta', 'El argumento alta es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearCliente);

router.post('/lista', [
    validarJWT,
], listaClientes);

// PUT
router.put('/:id', [
    validarJWT,
    // check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    // check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    // check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('company', 'El argumento compañia es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], actualizarCliente);

router.put('/plan/:id', [
    validarJWT,
    check('plan', 'El argumento plan es obligatorio').not().isEmpty(),
    // validarCampos,
    validarRol
], actualizarPlan);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('password', 'El argumento password es obligatorio').not().isEmpty().trim(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol,
], actualizarPassword);

// DELETE
router.delete('/:id', [
    validarJWT,
    check('id', 'The identifier is not valid').isMongoId(),
    validarCampos
], borrarCliente);

module.exports = router;