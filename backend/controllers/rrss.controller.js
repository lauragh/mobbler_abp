// const Proyecto = require('../models/project.model');
// const { validarCampos } = require('../middleware/validar-campos');
// const { response, query } = require('express');
// const { infoToken } = require('../helpers/infotoken');


// const crearProyecto = async(req, res = response) => {
//     const proyecto = new Proyecto(req.body);
//     const uid = req.params.id;
//     const token = req.header('x-token');

//     if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
//         return res.status(400).json({
//             ok: false,
//             msg: 'No tiene permisos para crear proyecto',
//         });
//     }
//     try {
//         const existeModelo = await Proyecto.findById(uid);
//         if (existeModelo) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'Proyecto ya existe',
//             });
//         } else {
//             await proyecto.save();
//             res.json({
//                 ok: true,
//                 msg: 'Se ha creado proyecto',
//                 proyecto
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             ok: false,
//             msg: 'Error creando proyecto',
//         });
//     }
// }

// const borrarProyecto = async(req, res = response) => {
//     const uid = req.params.id;
//     const token = req.header('x-token');

//     if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
//         return res.status(400).json({
//             ok: false,
//             msg: 'No tiene permisos para borrar proyecto',
//         });
//     }
//     try {
//         const existeModelo = await Proyecto.findById(uid);
//         if (!existeModelo) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'El proyecto no existe',
//             });
//         }

//         //luego se tendrá que cambiar el eliminar por desactivar porque interesa tener sus datos
//         const resultado = await Proyecto.findByIdAndRemove(uid);
//         res.json({
//             ok: true,
//             msg: 'Proyecto eliminado',
//             resultado
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             ok: false,
//             msg: 'Error eliminando proyecto',
//         });
//     }
// }
// module.exports = { obtenerProyectos, borrarProyecto, obtenerProyecto, crearProyecto, actualizarProyecto }