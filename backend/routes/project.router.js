const { Router } = require('express');
const { obtenerProyectos, borrarProyecto, obtenerProyecto, crearProyecto, actualizarProyecto, obtenerModelosProyecto, obtenerProyectosUsuario } = require('../controllers/project.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');

const router = Router();


router.get('/project/', obtenerModelosProyecto);
router.get('/', obtenerProyectos, validarJWT);
router.get('/usuario/', obtenerProyectosUsuario, validarJWT);


//PUT
router.put('/:id', [
    //validarJWT,
    // check('titulo', 'El campo nombre es obligatorio').not().isEmpty(),
    // check('descripcion', 'El campo decripcion es obligatorio').not().isEmpty(),
    // check('notas', 'El campo notas es obligatorio').not().isEmpty(),
    // check('nombre_creador', 'El campo creador es obligatorio').not().isEmpty(),
    // check('creador', 'El campo creador es obligatorio').not().isEmpty(),
    // check('clientes', 'El campo clientes es obligatorio').not().isEmpty(),
    // check('n_muebles', 'El campo numero de muebles es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRol,
    validarJWT
], actualizarProyecto);


router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], obtenerProyecto);

router.post('/', [
    check('titulo', 'El campo nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'El campo decripcion es obligatorio').not().isEmpty(),
    // check('notas', 'El campo notas es obligatorio').not().isEmpty(),
    check('nombre_creador', 'El campo creador es obligatorio').not().isEmpty(),
    check('creador', 'El campo creador es obligatorio').not().isEmpty(),
    // check('clientes', 'El campo clientes es obligatorio').not().isEmpty(),
    check('n_muebles', 'El campo numero de muebles es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], crearProyecto);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], borrarProyecto);







module.exports = router;