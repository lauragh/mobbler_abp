const { response } = require('express');
const validator = require('validator');

const Catalogo = require('../models/catalog.model');
const { infoToken } = require('../helpers/infotoken');

const obtenerCatalogos = async(req, res = response) => {
    //Paginación
    const desde = Number(req.query.desde) || 0;
    let hasta = req.query.hasta;
    const registropp = Number(process.env.DOCSPERPAGE);
    if (hasta == 0) {
        hasta = registropp;
    }
    const id = req.query.uid; // parametro pasado por la url
    const texto = req.query.texto;
    // console.log('Texto de busqueda')
    let textoBusqueda = "";

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    const catalogos = await Catalogo.find({});

    const nombre = req.query.texto || '';
    const fabricante = req.query.texto || '';
    const precio = req.query.texto || '';
    const num_modelos = req.query.texto || '';
    const img = req.query.texto || '';
    const orden = req.query.orden;
    const tipo = req.query.tipo;
    let fechaIni = req.query.fechaIni;
    let fechaFin = req.query.fechaFin;
    // console.log('fechaIni', req.query.fechaIni);
    // console.log('fechaFin', req.query.fechaFin);

    if (orden == 'Ascendente') {
        num = 1;
    } else if (orden == 'Descendente') {
        num = -1;
    }

    if (fechaIni === '' && fechaFin === '') {
        const fIni = await Catalogo.findOne().sort({ 'fecha': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Catalogo.findOne().sort({ 'fecha': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }


    try {

        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos obtener catalogos',
            });
        }

        let catalogos, total;

        let query = {};
        if (texto) {
            query = { $or: [{ nombre: textoBusqueda }, { fabricante: textoBusqueda }] };
        }

        //console.log(tipo);
        [catalogos, total] = await Promise.all([
            Catalogo.find({
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
            total = Catalogo.countDocuments()

        ]);
        // console.log('Catalogos: ' + catalogos);
        res.json({
            ok: true,
            msg: 'Catalogos obtenidos',
            page: {
                desde,
                hasta,
                total,
                catalogos
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener catalogos'
        });
    }
}


const obtenerCatalogo = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || infoToken(token).rol === 'ROL_CLIENTE')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos obtener el catalogo',
        });
    }
    try {
        const catalog = await Catalogo.findById(uid);
        if (!catalog) {
            return res.status(400).json({
                ok: false,
                msg: 'El catalogo no existe',
            });
        }
        res.json({
            ok: true,
            msg: 'Catalogo cargado',
            catalog
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error cargando catalogo',
        });
    }
}


// 


const crearCatalogo = async(req, res) => {
    let object = req.body;
    object.num_modelos = 0;
    const uid = req.params.id;
    try {
        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos crear catalogos',
            });
        }

        const exiteIdentificador = await Catalogo.findById(uid);

        if (exiteIdentificador) {
            return res.status(400).json({
                ok: false,
                msg: 'El catalogo ya existe'
            });
        }
        const catalogo = new Catalogo(object);

        await catalogo.save();

        res.json({
            ok: true,
            msg: 'Se ha creado el catalogo',
            catalogo
        });

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el catalogo'
        });
    }
}

//PUT
const actualizarCatalogo = async(req, res = response) => {
    //const { identificador, ...object } = req.body;
    const object = req.body;
    const uid = req.params.id; // parametro pasado por la url
    try {

        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos actualizar catalogos',
            });
        }
        const existeCatalogo = await (Catalogo.findById(uid));

        if (!existeCatalogo) {
            return res.status(400).json({
                ok: false,
                msg: 'Catalogo no existe'
            })
        }
        //object.identificador = identificador;

        const resultado = await Catalogo.findByIdAndUpdate(uid, object, { new: true });
        //const resultado = await Catalogo.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Catalogo actualizado',
            resultado
        })
    } catch (error) {
        // console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando catalogo'
        })
    }
}

//ACTUALIZAR NUM MODELOS
const actualizarNumModelos = async(req, res = response) => {
    //const { identificador, ...object } = req.body;
    const object = req.body;
    const uid = req.params.id; // parametro pasado por la url
    try {
        const existeCatalogo = await (Catalogo.findById(uid));

        if (!existeCatalogo) {
            return res.status(400).json({
                ok: false,
                msg: 'Catalogo no existe'
            })
        }
        //object.identificador = identificador;

        const resultado = await Catalogo.findByIdAndUpdate(uid, object, { new: true });
        //const resultado = await Catalogo.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Catalogo actualizado',
            resultado
        })
    } catch (error) {
        // console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando catalogo'
        })
    }
}

//DELETE
const borrarCatalogo = async(req, res = response) => {

    const uid = req.params.id;
    try {


        const token = req.header('x-token');

        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos borrar catalogos',
            });
        }
        const existeCatalogo = await (Catalogo.findById(uid));

        if (!existeCatalogo) {
            return res.status(400).json({
                ok: false,
                msg: 'Catalogo no existe'
            })
        }
        // Remove??
        const resultado = await Catalogo.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Catalogo eliminado',
            resultado
        })
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando el catalogo'
        })
    }
}

module.exports = { obtenerCatalogos, crearCatalogo, actualizarCatalogo, borrarCatalogo, obtenerCatalogo, actualizarNumModelos }