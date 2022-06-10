const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Cliente = require('../models/client.model');
const Usuario = require('../models/user.model');
const { infoToken } = require('../helpers/infotoken');

/*
get / 
<-- desde? el salto para buscar en la lista de Clientes
    id? un identificador concreto, solo busca a este
--> devuleve todos los Clientes
*/

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


//actualizar plan
const actualizarPlan = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    //const { password, alta, email, activo, ...object } = req.plan;
    const uid = req.params.id;
    const plan = req.plan;
    const token = req.header('x-token');

    try {

        // Comprobar si existe el Cliente que queremos actualizar
        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto',
            });
        }

        // Si es el el Cliente del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        clienteBD.plan = plan;

        //console.log(clienteBD);

        // Almacenar en BD
        await clienteBD.save();

        res.json({
            ok: true,
            msg: 'Plan actualizado'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar plan',
        });
    }
}

const actualizarCatalogos = async(req, res = response) => {
    const uid = req.query.uid;
    const catalogo = req.query.catalogo;

    //const uid = req.params.uid;
    // console.log('El uid es ' + uid);
    //const catalogosa = req.params.catalogo;
    // console.log('El catalogo es ', catalogo);
    try {

        // const token = req.header('x-token');
        // // lo puede actualizar un administrador o el propio cliente del token
        // if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'No tiene permisos para actualizar catalogos',
        //     });
        // }

        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto',
            });
        }
        // Si es el el Cliente del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        // if (infoToken(token).uid === uid) {

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos

        clienteBD.catalogos.push(catalogo);
        clienteBD.numCatalog++;

        // Almacenar en BD
        await clienteBD.save();
        //console.log(clienteBD.catalogos);

        res.json({
            ok: true,
            msg: 'Catalogos actualizados'
        });
        //}

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar catalogos',
        });
    }


    //  return this.http.put(`${environment.base_url}/catalogos/?catalogos=${catalogos}`, this.cabeceras);
}


const listaClientes = async(req, res) => {
    const lista = req.body.lista;

    if (!lista) {
        return res.json({
            ok: true,
            msg: 'listaClientes',
            clientes: 'none',
        });
    }

    // Solo puede listar Clientes un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para listar clientes',
        });
    }

    try {
        const clientes = await Cliente.find({ _id: { $in: lista }, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.json({
            ok: true,
            msg: 'listaClientes',
            clientes
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar clientes por uids',
        });
    }

}

const listaClientesRol = async(req, res) => {
    const rol = req.params.rol;
    const lista = req.body.lista;

    // Solo puede listar Clientes un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para listar clientes',
        });
    }

    listaB = [];
    if (!lista) { listaB = []; }

    try {
        const clientes = await Cliente.find({ _id: { $nin: lista }, rol: rol, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.json({
            ok: true,
            msg: 'listaClientes',
            clientes
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar clientes por rol',
            error
        });
    }

}

const obtenerClientes = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;

    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de Cliente por si quiere buscar solo un Cliente
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar clientes un admin
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar clientes',
            });
        }

        let clientes, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            if (!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'El id de usuario debe ser válido'
                });
            }

            [clientes, total] = await Promise.all([
                Cliente.findById(id),
                Cliente.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {

            let query = {};
            if (texto) {
                query = { $or: [{ nombre: textoBusqueda }, { apellidos: textoBusqueda }, { email: textoBusqueda }, { company: textoBusqueda }] };
            }

            [clientes, total] = await Promise.all([
                Cliente.find(query).skip(desde).limit(registropp).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 }),
                Cliente.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getClientes',
            clientes,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        //console.log(error);
        res.json({
            ok: false,
            msg: 'Error buscando clientes'
        });
    }
}


const crearCliente = async(req, res = response) => {

    const { email, password } = req.body;
    // Solo puede crear clientes un admin
    const token = req.header('x-token');
    //console.log(token);

    if (token) {
        /*
        Admin creando cliente
        */
        try {
            if (!(infoToken(token).rol === 'ROL_ADMIN')) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tiene permisos para crear clientes',
                });
            }

            // Comrprobar que no existe un Cliente con ese email registrado
            const exiteEmail = await Cliente.findOne({ email: email });

            if (exiteEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe en la BBDD'
                });
            }

            // Cifrar la contraseña, obtenemos el salt y ciframos
            const salt = bcrypt.genSaltSync();
            const cpassword = bcrypt.hashSync(password, salt);

            // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
            const { alta, ...object } = req.body;
            const cliente = new Cliente(object);
            cliente.password = cpassword;

            // Almacenar en BD
            await cliente.save();

            res.json({
                ok: true,
                msg: 'Petición crearClientes satisfactoria',
                cliente
            });

        } catch (error) {
            //console.log(error);
            return res.status(400).json({
                ok: false,
                msg: 'Error creando cliente por parte del administrador'
            });
        }
    } else {
        /*
        Registro cliente
        */
        try {
            // Comrprobar que no existe un Cliente con ese email registrado
            let existeEmail = await Cliente.findOne({ email: email });

            if (!existeEmail) {
                existeEmail = await Usuario.findOne({ email: email });
            }

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El email ya existe'
                });
            }

            // Cifrar la contraseña, obtenemos el salt y ciframos
            const salt = bcrypt.genSaltSync();
            const cpassword = bcrypt.hashSync(password, salt);

            // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
            const { alta, ...object } = req.body;
            const cliente = new Cliente(object);
            cliente.password = cpassword;

            // Almacenar en BD
            await cliente.save();

            res.json({
                ok: true,
                msg: 'Petición crearClientes satisfactoria',
                // cliente
            });

        } catch (error) {
            //console.log(error);
            return res.status(400).json({
                ok: false,
                msg: 'Error creando cliente'
            });
        }

    }
}


const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio cliente del token
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const clienteBD = await Cliente.findById(uid);
        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Cliente incorrecto',
            });
        }

        const validPassword = bcrypt.compareSync(password, clienteBD.password);
        // Si es el el Cliente del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        clienteBD.password = cpassword;

        // Almacenar en BD
        await clienteBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}



const actualizarCliente = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, activo, ...object } = req.body;
    const uid = req.params.id;
    const token = req.header('x-token');

    try {
        // Para actualizar Cliente o eres admin o eres Cliente del token y el uid que nos llega es el mismo
        // const token = req.header('x-token');
        // if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).uid === uid)) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'El cliente no tiene permisos para actualizar este perfil'
        //     });
        // }

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEmail = await Cliente.findOne({ email: email });

        if (existeEmail) {
            // Si existe un Cliente con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El email ya existe'
                });
            }
        }

        // Comprobar si existe el Cliente que queremos actualizar
        const existeCliente = await Cliente.findById(uid);

        if (!existeCliente) {
            return res.status(400).json({
                ok: false,
                msg: 'El cliente no existe'
            });
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        // if ((infoToken(token).rol === 'ROL_ADMIN') && activo !== undefined) {
        //     object.activo = activo;
        // }
        // al haber extraido password del req.body nunca se va a enviar en este put
        const cliente = await Cliente.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Cliente actualizado',
            cliente: cliente
        });

    } catch (error) {
        //console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando cliente'
        });
    }
}





/*
delete /:id
*/
const borrarCliente = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar Clientes un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ROL_ADMIN' || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar clientes',
            });
        }

        // // No me puedo borrar a mi mismo
        // if ((infoToken(token).uid === uid)) {
        //     return res.status(404).json({
        //         ok: false,
        //         msg: `No se puede eliminar el cliente con el id=${uid}`,
        //     });
        // }

        // Comprobamos si existe el cliente que queremos borrar
        const existeCliente = await Cliente.findById(uid);
        if (!existeCliente) {
            return res.status(404).json({
                ok: true,
                msg: 'El cliente no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Cliente.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Cliente eliminado correctamente',
            resultado: resultado
        });
    } catch (error) {
        //console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando cliente'
        });
    }
}


module.exports = { obtenerClientes, crearCliente, actualizarCliente, actualizarCatalogos, borrarCliente, actualizarPassword, listaClientes, listaClientesRol, actualizarPlan }