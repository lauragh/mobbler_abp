const { response } = require('express');
const rolesPermitidos = ['ROL_USUARIO','ROL_ADMIN','ROL_CLIENTE'];

const validarRol = (req, res = response, next) => {

    const rol = req.body.rol;

    if (rol && !rolesPermitidos.includes(rol)) {
        return res.status(404).json({
            ok: false,
            msg: 'Rol no permitido, permitidos -> ROL_USUARIO || ROL_ADMIN || ROL_CLIENTE'
        });
    }
    next();
}

module.exports = { validarRol }



