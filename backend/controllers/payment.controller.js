const Pago = require('../models/payment.model');
const usuarios = require('../models/user.model');
const Cliente = require('../models/client.model');
const { response, query } = require('express');
const { infoToken } = require('../helpers/infotoken');

const obtenerPagos = async(req, res = response) => {
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
        const fIni = await Pago.findOne().sort({ 'fecha': 1 });
        fechaIni = fIni['fecha'];
        // console.log('fechaInicio', fechaIni);
        const fFin = await Pago.findOne().sort({ 'fecha': -1 });
        fechaFin = fFin['fecha'];
        // console.log('fechaFin', fechaFin);
    }

    try {
        const token = req.header('x-token');
        // no lo cambio por que no estoy con interfaces clientes ahora mismo pero tiene que ser id en vez de uid
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener los pagos',
            });
        }

        let pagos, total;
        let query = {};
        if (texto) {
            query = { $or: [{ nombre_companyia: textoBusqueda }, { plan: textoBusqueda }] };
        }

        [pagos, total] = await Promise.all([
            Pago.find({
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
            Pago.countDocuments()
        ]);

        res.json({
            ok: true,
            msg: 'getPayments',
            pagos,
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
            msg: 'Error al obtener pagos'
        });
    }

}

const obtenerPago = async(req, res = response) => {
    // el uid es el uid de la factura
    const uid = req.params.id;
    const token = req.header('x-token');
    //console.log('El uid a mostrar es: ' + uid);
    //console.log('El uid del usuario: ' + infoToken(token).uid)
    // console.log('El token a mostrar es: ' + infoToken(token).uid);

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener pago',
        });
    }
    try {
        const pago = await Pago.findById(uid);
        if (!pago) {
            return res.status(400).json({
                ok: false,
                msg: 'El Pago no existe',
            });
        }
        // console.log('El pago es ' + pago.companyia);
        usuario_id = pago.companyia.toString();
        // console.log('El usuario es', usuario_id);

        //if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === pago.companyia.toString()))) {
        if (!((infoToken(token).rol === 'ROL_ADMIN') || ((infoToken(token).uid === uid)))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener el pago',
            });

        }

        // console.log('llego a despues de lo de eso')

        res.json({
            ok: true,
            msg: 'Pago cargado',
            pago
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Errorcargando Pago',
        });
    }
}



const obtenerPago2 = async(req, res = response) => {
    // el uid es el uid de la factura
    const uid = req.query.uid;
    const project = req.query.project;
    const token = req.header('x-token');
    //console.log('El uid a mostrar es: ' + uid);
    //console.log('El uid del usuario: ' + infoToken(token).uid)
    // //console.log('El token a mostrar es: ' + infoToken(token).uid);

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener pago',
        });
    }
    try {
        const pago = await Pago.findById(project);
        if (!pago) {
            return res.status(400).json({
                ok: false,
                msg: 'El Pago no existe',
            });
        }
        // console.log('El pago es ' + pago.companyia);
        usuario_id = pago.companyia.toString();
        // console.log('El usuario es', usuario_id);

        //if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === pago.companyia.toString()))) {
        if (!((infoToken(token).rol === 'ROL_ADMIN') || ((infoToken(token).uid === uid)))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener el pago',
            });

        }

        // console.log('llego a despues de lo de eso')

        res.json({
            ok: true,
            msg: 'Pago cargado',
            pago
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Errorcargando Pago',
        });
    }
}


const obtenerPagoCliente = async(req, res = response) => {
    const registropp = Number(process.env.DOCSPERPAGE);
    //const id = req.query.id; // parametro pasado por la url

    //const uid = req.params.id;
    const desde = Number(req.query.desde) || 0;
    const client = req.query.cliente;

    //console.log('CARGO DESDE: ' + desde);
    const token = req.header('x-token');
    try {
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === client))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para obtener el pago',
            });
        }

        if (!Cliente.findById(client)) {
            return res.status(400).json({
                ok: false,
                msg: 'El Cliente del cual se quiere obtener los pagos no existe',
            });
        }

        let pagos, total;
        // console.log('cliente', client);
        // let query = { 'companyia': client };

        [pagos, total] = await Promise.all([
            Pago.find({ 'companyia': client }).skip(desde).limit(registropp),
            Pago.find({ 'companyia': client }).skip(desde).limit(registropp).countDocuments()
        ]);
        // console.log('pagos', pagos);
        res.json({
            ok: true,
            msg: 'getPayments',
            pagos,
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
            msg: 'Error obteniendo pagos del cliente',
        });
    }
}





const crearPago = async(req, res = response) => {
    const pago = new Pago(req.body);
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear pago',
        });
    }
    try {
        const existePago = await Pago.findById(uid);
        if (existePago) {
            return res.status(400).json({
                ok: false,
                msg: 'Pago ya existe',
            });
        } else {
            const client = await Cliente.findById(req.body.cliente);
            if (!client) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El cliente al que quieres generarle la factura no existe',
                });

            } else {
                await pago.save();
                res.json({
                    ok: true,
                    msg: 'Se ha creado pago',
                    pago
                });
            }

        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando pago',
        });
    }
}

const actualizarPago = async(req, res = response) => {
    const {...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actuliazar el pago',
        });
    }
    try {
        const existePago = await Pago.findById(uid);
        if (!existePago) {
            return res.status(400).json({
                ok: false,
                msg: 'Pago no existe',
            });
        } else {
            const pago = await Pago.findByIdAndUpdate(uid, object, { new: true });
            res.json({
                ok: true,
                msg: 'Actualizar pagos',
                pago
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando pago',
        });
    }
}

const borrarPago = async(req, res = response) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar el pago',
        });
    }
    try {
        const existePago = await Pago.findById(uid);
        if (!existePago) {
            return res.status(400).json({
                ok: false,
                msg: 'El pago no existe',
            });
        }

        //luego se tendrá que cambiar el eliminar por desactivar porque interesa tener sus datos
        const resultado = await Pago.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Pago eliminado',
            resultado
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error eliminando el pago',
        });
    }
}


module.exports = { obtenerPagos, obtenerPagoCliente, obtenerPago, crearPago, actualizarPago, borrarPago, obtenerPago2 }