const Modelo = require('../models/modelo.model');
const Catalogo = require('../models/catalog.model');
const { response, query } = require('express');
const { infoToken } = require('../helpers/infotoken');
var catalogo_id;



const obtenerModelosProyecto = async(req, res = response) => {
    const id_project = req.query.project_uid;

    try {
        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
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

        [modelos, total] = await Promise.all([
            Modelo.find({
                $and: [query]
            }),
            Modelo.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'obtenerModelos de proyecto',
            modelos,
            page: {
                total,
                modelos
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


const obtenerModelosBaratos = async(req, res = response) => {
    //Paginacion

    try {

        let modelos;
        [modelos, total] = await Promise.all([
            Modelo.find({}).skip(0).limit(5).sort({
                ['precio']: 1
            }),
            Modelo.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'obtenerModelosBaratos',
            modelos
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener modelos'
        });
    }
}


const obtenerModelosTags = async(req, res = response) => {
    const tag_request = req.query.tag;
    // console.log(tag_request);

    try {
        let modelos, total, modelos_1;
        modelos = [];

        [modelos_1, total] = await Promise.all([
            Modelo.find({}),
            Modelo.countDocuments()
        ]);

        for (let a = 0; a < modelos_1.length; a++) {
            for (let b = 0; b < modelos_1[a].tags.length; b++) {
                if (modelos_1[a].tags[b].indexOf(tag_request) !== -1) {
                    modelos.push(modelos_1[a]);
                }
            }
        }

        res.json({
            ok: true,
            msg: 'obtenerModelos de proyecto',
            modelos,
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


const obtenerModelos = async(req, res = response) => {
    //Paginacion
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const texto = req.query.texto;
    const orden = req.query.orden;
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log(req.query.fechaIni);
    // console.log(req.query.fechaFin);
    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Modelo.findOne().sort({ 'fecha': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Modelo.findOne().sort({ 'fecha': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    }

    try {
        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar modelos',
            });
        }

        let modelos, total;

        let query = {};
        if (texto) {
            query = { nombre: textoBusqueda };
        }

        [modelos, total] = await Promise.all([
            Modelo.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        }
                    },
                    query
                ]
            }).skip(desde).limit(registropp).sort({
                [tipo]: num
            }),
            Modelo.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'obtenerModelos',
            modelos,
            page: {
                desde,
                registropp,
                total,
                modelos
            }
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener modelos'
        });
    }
}

const obtenerModelo = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener modelo',
        });
    }
    try {
        const modelo = await Modelo.findById(uid);
        if (!modelo) {
            return res.status(400).json({
                ok: false,
                msg: 'El modelo no existe',
            });
        }
        catalogo_id = modelo.catalogo.toString();
        // console.log('obtengo', catalogo_id);

        res.json({
            ok: true,
            msg: 'Modelo cargado',
            modelo
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error cargando modelo',
        });
    }
}

const crearModelo = async(req, res = response) => {
    const modelo = new Modelo(req.body);
    const uid = req.params.id;
    const token = req.header('x-token');


    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear modelo',
        });
    }
    try {
        const existeModelo = await Modelo.findById(uid);
        if (existeModelo) {
            return res.status(400).json({
                ok: false,
                msg: 'Modelo ya existe',
            });
        } else {
            // const pepa = await Catalogo.findById(req.body.catalogo);
            // console.log('uid', req.body.catalogo);
            // console.log('esto', pepa);

            const pepe = await Catalogo.findOneAndUpdate({
                _id: req.body.catalogo
            }, {
                $inc: {
                    'num_modelos': 1
                }
            });

            // console.log(pepe);
            await modelo.save();
            res.json({
                ok: true,
                msg: 'Se ha creado modelo',
                modelo
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando modelo',
        });
    }
}

const actualizarModelo = async(req, res = response) => {
    const {...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear modelo',
        });
    }
    try {
        const existeModelo = await Modelo.findById(uid);
        if (!existeModelo) {
            return res.status(400).json({
                ok: false,
                msg: 'Modelo no existe',
            });
        } else {
            // console.log('vuelvo a imprimir catalogo_id', catalogo_id);
            // console.log('ahora imprimo el catalogo del actualizado', object.catalogo);

            if (catalogo_id != object.catalogo) {
                // console.log('He entrado');
                // const busqueda = await Catalogo.findById(catalogo_id);
                // console.log(busqueda);
                const consulta = await Catalogo.findById(catalogo_id);
                if (consulta['num_modelos'] != 0) {
                    const antiguo = await Catalogo.findOneAndUpdate({
                        _id: catalogo_id
                    }, {
                        $inc: {
                            'num_modelos': -1
                        }
                    });
                }
                // console.log('consulta', consulta['num_modelos'] = 0);

                const nuevo = await Catalogo.findOneAndUpdate({
                    _id: object.catalogo
                }, {
                    $inc: {
                        'num_modelos': 1
                    }
                });
            }
            const modelo = await Modelo.findByIdAndUpdate(uid, object, { new: true });
            res.json({
                ok: true,
                msg: 'actualizarModelos',
                modelo
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando modelo',
        });
    }
}
const borrarModelo = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar modelo',
        });
    }
    try {
        const existeModelo = await Modelo.findById(uid);
        if (!existeModelo) {
            return res.status(400).json({
                ok: false,
                msg: 'El modelo no existe',
            });
        }

        //luego se tendrá que cambiar el eliminar por desactivar porque interesa tener sus datos
        const resultado = await Modelo.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Modelo eliminado',
            resultado
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error eliminando modelo',
        });
    }
}
module.exports = { obtenerModelos, crearModelo, actualizarModelo, borrarModelo, obtenerModelo, obtenerModelosProyecto, obtenerModelosBaratos, obtenerModelosTags }