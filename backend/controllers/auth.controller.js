const { response } = require('express');
const bcrypt = require('bcryptjs');
const Cliente = require('../models/client.model');

const Usuario = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        let usuarioBD;

        if (rol == 'ROL_CLIENTE') {
            usuarioBD = await Cliente.findById(uid);
        } else if (rol == 'ROL_ADMIN') {
            usuarioBD = await Usuario.findById(uid);
        }
        // const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: usuarioBD.nombre,
            apellidos: usuarioBD.apellidos,
            email: usuarioBD.email,
            rol: rolBD,
            company: usuarioBD.company,
            plan: usuarioBD.plan,
            alta: usuarioBD.alta,
            imagen: usuarioBD.imagen,
            token: nuevoToken,
            numProjects: usuarioBD.numProjects,
            numCatalog: usuarioBD.numCatalog,
            catalogos: usuarioBD.catalogos,
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',
            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuarioBD = await Usuario.findOne({ email });

        // probar en la base de datos de clientes
        if (!usuarioBD) {
            usuarioBD = await Cliente.findOne({ email });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: 1,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        // //console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}

const loginGoogle = async(req, res = response) => {

    const tokenGoogle = req.body.token;

    try {
        const { email, ...payload } = await googleVerify(tokenGoogle);
        // console.log(payload);
        // console.log(email);

        let usuarioBD = await Usuario.findOne({ email });

        // probar en la base de datos de clientes
        if (!usuarioBD) {
            usuarioBD = await Cliente.findOne({ email });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                error: 1,
                msg: 'Identificación google incorrecta',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login google',
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login google',
            token: ''
        });
    }
}

module.exports = { login, token, loginGoogle }