const Cliente = require('../models/client.model');
const Usuario = require('../models/user.model');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizaBD = async(tipo, path, nombreArchivo, id, token) => {

    switch (tipo) {
        case 'fotoperfil':

            let usuario = await Usuario.findById(id);

            if (!usuario) {
                usuario = await Cliente.findById(id);
                if (!usuario) {
                    //console.log('Entra')
                    return false;
                }
            }

            // Comprobar que el id de cliente que actualiza es el mismo id del token
            // solo el cliente puede cambiar su foto
            // if (infoToken(token).uid !== id) {
            //     console.log('El cliente que actualiza no es el propietario de la foto')
            //     return false;
            // }

            const fotoVieja = usuario.imagen;
            const pathFotoVieja = `${path}/${fotoVieja}`;
            if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }

            usuario.imagen = nombreArchivo;
            await usuario.save();

            return true;

            break;

        case 'evidencia':

            return false;
            break;

        default:
            return false;
            break;
    }

    // console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizaBD }