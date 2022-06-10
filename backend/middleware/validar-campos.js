const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    const erroresVal = validationResult(req);
   
    if (!erroresVal.isEmpty()) {
        return res.status(404).json({
            ok: false,
            msg: 'Argumentos recibidos inválidos',
            errores: erroresVal.mapped()
        });
    }
    next();
}

module.exports = { validarCampos }

