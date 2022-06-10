const Escena = require('../models/escena.model');
const { response, query } = require('express');
const { infoToken } = require('../helpers/infotoken');



const obtenerEscenas = async(req, res = response) => {
    //Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id; // parametro pasado por la url
    const texto = req.query.texto;


    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto ', texto, ' textoBusqueda ', textoBusqueda);
    }

    const orden = req.query.orden;
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log(req.query.fechaIni);
    // console.log(req.query.fechaFin);

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Escena.findOne().sort({ 'fechaC': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Escena.findOne().sort({ 'fechaC': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    try {
        const token = req.header('x-token');
        // no lo cambio por que no estoy con interfaces clientes ahora mismo pero tiene que ser id en vez de uid
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).rol === 'ROL_CLIENTE'))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener las escenas',
            });
        }

        let escenas, total;
        let query = {};
        if (texto) {
            query = { $or: [{ nombre_companyia: textoBusqueda }, { plan: textoBusqueda }] };
        }

        [escenas, total] = await Promise.all([
            Escena.find({
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
            Escena.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'getEscenas',
            escenas,
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas'
        });
    }

}

const obtenerEscenasProyecto = async(req, res = response) => {
    //Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id; // parametro pasado por la url
    const texto = req.query.texto;
    const proyecto = req.query.proyecto;
    // console.log(req.query.proyecto);
    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto ', texto, ' textoBusqueda ', textoBusqueda);
    }

    const orden = req.query.orden;
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log(req.query.fechaIni);
    // console.log(req.query.fechaFin);

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Escena.findOne().sort({ 'fechaC': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Escena.findOne().sort({ 'fechaC': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    try {
        const token = req.header('x-token');
        // no lo cambio por que no estoy con interfaces clientes ahora mismo pero tiene que ser id en vez de uid
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).rol === 'ROL_CLIENTE'))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener las escenas',
            });
        }

        let escenas, total;
        let query = {};
        if (texto) {
            query = { $or: [{ nombre_companyia: textoBusqueda }, { plan: textoBusqueda }] };
        }

        [escenas, total] = await Promise.all([
            Escena.find({
                $and: [{
                        'fecha': {
                            $gte: new Date(fechaIni),
                            $lte: new Date(fechaFin)
                        },
                        'proyecto_uid': proyecto
                    },
                    query
                ]
            }).skip(desde).limit(registropp).sort({
                'fechaC': -1
            }),
            Escena.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'getEscenas',
            escenas,
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener escenas'
        });
    }

}

const obtenerEscena = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos obtener el escena',
        });
    }
    try {
        const escena = await Escena.findById(uid);
        if (!escena) {
            return res.status(400).json({
                ok: false,
                msg: 'La escena no existe',
            });
        }
        res.json({
            ok: true,
            msg: 'Escena cargada',
            escena
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error cargando escena',
        });
    }
}

//CREATE
const crearEscena = async(req, res) => {
    let object = req.body;
    const uid = req.params.id;
    //console.log(object);
    try {
        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).rol === 'ROL_CLIENTE'))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos crear escenas',
            });
        }

        const exiteIdentificador = await Escena.findById(uid);

        if (exiteIdentificador) {
            return res.status(400).json({
                ok: false,
                msg: 'La escena ya existe'
            });
        }
        const escena = new Escena(object);

        await escena.save();

        res.json({
            ok: true,
            msg: 'Se ha creado el escena',
            escena
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el escena'
        });
    }
}

//PUT
const actualizarEscena = async(req, res = response) => {
    //const { identificador, ...object } = req.body;
    const object = req.body;
    const uid = req.params.id; // parametro pasado por la url
    try {

        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos actualizar escenas',
            });
        }
        const existeEscena = await (Escena.findById(uid));

        if (!existeEscena) {
            return res.status(400).json({
                ok: false,
                msg: 'Escena no existe'
            })
        }
        //object.identificador = identificador;

        const resultado = await Escena.findByIdAndUpdate(uid, object, { new: true });
        //const resultado = await Escena.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Escena actualizada',
            resultado
        })
    } catch (error) {
        // console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando escena'
        })
    }
}

//DELETE
const borrarEscena = async(req, res = response) => {

    const uid = req.params.id;
    try {


        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos borrar escenas',
            });
        }
        const existeEscnea = await (Escena.findById(uid));

        if (!existeEscnea) {
            return res.status(400).json({
                ok: false,
                msg: 'Escena no existe'
            })
        }
        // Remove??
        const resultado = await Escena.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Escena eliminada',
            resultado
        })
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando la escena'
        })
    }
}

module.exports = { obtenerEscenas, obtenerEscena, crearEscena, actualizarEscena, borrarEscena, obtenerEscenasProyecto }