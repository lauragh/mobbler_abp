const { Router } = require('express');
const { obtenerModelos, crearModelo, actualizarModelo, borrarModelo, obtenerModelo, obtenerModelosFechas, obtenerModelosProyecto, obtenerModelosBaratos, obtenerModelosTags } = require('../controllers/modelo.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();



router.get('/project/', obtenerModelosProyecto);

router.get('/tag/', obtenerModelosTags);
router.get('/barato/', obtenerModelosBaratos);
router.get('/', [
    validarJWT,
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim()
], obtenerModelos);

router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], obtenerModelo);

// router.get('/', obtenerModelos, validarJWT);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('catalogo', 'El argumento catalogo es obligatorio').not().isEmpty(),
    check('descripcion', 'El argumento decripcion es obligatorio').not().isEmpty(),
    check('medida_ancho', 'El argumento medida_ancho es obligatorio').not().isEmpty(),
    check('medida_alto', 'El argumento medida_alto es obligatorio').not().isEmpty(),
    check('medida_largo', 'El argumento medida_largo es obligatorio').not().isEmpty(),
    check('tags', 'El argumento tags es obligatorio').not().isEmpty(),
    // check('archivo', 'El argumento archivo es obligatorio').not().isEmpty(),
    check('colores', 'El argumento colores es obligatorio').not().isEmpty(),
    // check('imagen', 'El argumento colores es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], crearModelo);


router.put('/:id', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('catalogo', 'El argumento catalogo es obligatorio').not().isEmpty(),
    check('descripcion', 'El argumento decripcion es obligatorio').not().isEmpty(),
    check('medida_ancho', 'El argumento medida_ancho es obligatorio').not().isEmpty(),
    check('medida_alto', 'El argumento medida_alto es obligatorio').not().isEmpty(),
    check('medida_largo', 'El argumento medida_largo es obligatorio').not().isEmpty(),
    check('tags', 'El argumento tags es obligatorio').not().isEmpty(),
    // check('archivo', 'El argumento archivo es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('colores', 'El argumento colores es obligatorio').not().isEmpty(),
    // check('imagen', 'El argumento colores es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], actualizarModelo);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], borrarModelo);

module.exports = router;