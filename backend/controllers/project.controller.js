const Proyecto = require('../models/project.model');
const { validarCampos } = require('../middleware/validar-campos');
const { response, query } = require('express');
const { infoToken } = require('../helpers/infotoken');

const obtenerModelosProyecto = async(req, res = response) => {
    const id_project = req.query.project_uid;

    try {
        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') 
            || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar modelos',
            });
        }

        let modelos, total;

        let query = {};
        if (id_project) {
            query = { uid: id_project };
        }

        [muebles, total] = await Promise.all([
            Proyecto.find({
                $and: [query]
            }),
            Proyecto.find({
                $and: [query]
            }).countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'obtenerModelos de proyecto',
            muebles,
            page: {
                total
            }
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener modelos del proyecto'
        });
    }
}


const obtenerProyectosUsuario = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    let hasta = req.query.hasta;
    const registropp = Number(process.env.DOCSPERPAGE);
    if (hasta == 0) {
        hasta = registropp;
    }
    const texto = req.query.texto;
    const orden = req.query.orden;
    let textoBusqueda = '';
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log(req.query.fechaIni);
    // console.log(req.query.fechaFin);
    const usuario = req.query.uid;

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    } else {
        num = 0;
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Proyecto.findOne().sort({ 'fecha': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Proyecto.findOne().sort({ 'fecha': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    //Obtenemos ID del proyecto
    const id = req.query.id;

    try {
        let proyectos, total;
        //Solo puede listar proyectos un admin
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar proyectos',
            });
        }

        let query = {};
        if (texto) {
            query = { $or: [{ titulo: textoBusqueda }, { descripcion: textoBusqueda }] };
        }
        [proyectos, total] = await Promise.all([
            Proyecto.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        },
                        'creador': usuario
                    },
                    query
                ]
            }).skip(desde).limit(hasta).sort({
                [tipo]: num
            }),
            Proyecto.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        },
                        'creador': usuario
                    },
                    query
                ]
            }).skip(desde).limit(hasta).sort({
                [tipo]: num
            }).countDocuments()
        ]);
        res.json({
            ok: true,
            msg: 'getProyectos',
            proyectos,
            page: {
                desde,
                hasta,
                total
            }
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener proyectos'
        });
    }
}

const obtenerProyectos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    let hasta = req.query.hasta;
    const registropp = Number(process.env.DOCSPERPAGE);
    if (hasta == 0) {
        hasta = registropp;
    }
    const texto = req.query.texto;
    const orden = req.query.orden;
    let textoBusqueda = '';
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log(req.query.fechaIni);
    // console.log(req.query.fechaFin);

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    } else {
        num = 0;
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Proyecto.findOne().sort({ 'fecha': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Proyecto.findOne().sort({ 'fecha': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    //Obtenemos ID del proyecto
    const id = req.query.id;

    try {
        let proyectos, total;
        //Solo puede listar proyectos un admin
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar proyectos',
            });
        }

        let query = {};
        if (texto) {
            query = { $or: [{ titulo: textoBusqueda }, { descripcion: textoBusqueda }] };
        }
        [proyectos, total] = await Promise.all([
            Proyecto.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        }
                    },
                    query
                ]
            }).skip(desde).limit(hasta).sort({
                [tipo]: num
            }),
            Proyecto.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        }
                    },
                    query
                ]
            }).skip(desde).limit(hasta).sort({
                [tipo]: num
            }).countDocuments()
        ]);
        res.json({
            ok: true,
            msg: 'getProyectos',
            proyectos,
            page: {
                desde,
                hasta,
                total
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener proyectos'
        });
    }
}

const obtenerProyecto = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');


    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener proyecto',
        });
    }
    try {
        const proyecto = await Proyecto.findById(uid);
        if (!proyecto) {
            return res.status(400).json({
                ok: false,
                msg: 'El proyecto no existe',
            });
        }
        res.json({
            ok: true,
            msg: 'Proyecto cargado',
            proyecto
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo proyecto',
        });
    }
}

//PUT
const actualizarProyecto = async(req, res = response) => {
    //const { identificador, ...object } = req.body;
    const object = req.body;
    const uid = req.params.id; // parametro pasado por la url
    try {

        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos actualizar proyectos',
            });
        }
        const existeProtecto = await (Proyecto.findById(uid));

        if (!existeProtecto) {
            return res.status(400).json({
                ok: false,
                msg: 'Proyecto no existe'
            })
        }
        //object.identificador = identificador;

        const resultado = await Proyecto.findByIdAndUpdate(uid, object, { new: true });
        //const resultado = await Proyecto.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Proyecto actualizado',
            resultado
        })
    } catch (error) {
        // console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando proyecto'
        })
    }
}


const crearProyecto = async(req, res = response) => {
    const proyecto = new Proyecto(req.body);
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear proyecto',
        });
    }
    try {
        const existeModelo = await Proyecto.findById(uid);
        if (existeModelo) {
            return res.status(400).json({
                ok: false,
                msg: 'Proyecto ya existe',
            });
        } else {
            await proyecto.save();
            res.json({
                ok: true,
                msg: 'Se ha creado proyecto',
                proyecto
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando proyecto',
        });
    }
}


const borrarProyecto = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar proyecto',
        });
    }
    try {
        const existeModelo = await Proyecto.findById(uid);
        if (!existeModelo) {
            return res.status(400).json({
                ok: false,
                msg: 'El proyecto no existe',
            });
        }

        //luego se tendrá que cambiar el eliminar por desactivar porque interesa tener sus datos
        const resultado = await Proyecto.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Proyecto eliminado',
            resultado
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error eliminando proyecto',
        });
    }
}
module.exports = { obtenerProyectos, borrarProyecto, obtenerProyecto, crearProyecto, actualizarProyecto, obtenerModelosProyecto, obtenerProyectosUsuario }