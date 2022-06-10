const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { actualizaBD } = require('../helpers/actualizaBD');
const fs = require('fs');
let path = require('path');

const subirArchivo = async(req, res = response) => {
    //console.log('Entra a subirArchivo');
    // console.log(req);
    // console.log(res);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo',
        });
    }
    if (!req.files.archivo) {
        return res.status(400).json({
            ok: false,
            msg: `Debe enviarse el archivo como form-data llamado 'archivo'`,
        });
    }
    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        });
    }

    const tipo = req.params.tipo; // fotoperfil   evidencia
    const id = req.params.id;

    const archivosValidos = {
        fotoperfil: ['jpeg', 'jpg', 'png'],
        evidencia: ['doc', 'docx', 'xls', 'pdf', 'zip', 'jpg'],
    }

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];
    path = path.join(__dirname, '../../frontend/src/assets/');

    switch (tipo) {
        case 'fotoperfil':
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.fotoperfil})`
                });
            }

            path += tipo;
            // Comprobar que solo el usuario cambia su foto de usuario

            break;
        case 'evidencia':
            if (!archivosValidos.evidencia.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.evidencia})`
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operacion no está permtida`,
                tipoOperacion: tipo
            });
            break;
    }

    // const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const patharchivo = `${path}/${nombreArchivo}`;

    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }
        const token = req.header('x-token');
        // console.log(tipo, path, nombreArchivo, id, token)
        actualizaBD(tipo, path, nombreArchivo, id, token)
            .then(valor => {
                if (!valor) {
                    fs.unlinkSync(patharchivo);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se pudo establecer la nueva foto de perfil`,
                    });
                } else {
                    res.json({
                        ok: true,
                        msg: 'subirArchivo',
                        nombreArchivo
                    });
                }

                // controlar valor
            }).catch(error => {
                fs.unlinkSync(patharchivo);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar archivo`,
                });
            });


    });
}

const enviarArchivo = async(req, res = response) => {

    const tipo = req.params.tipo; // fotoperfil   evidencia
    const nombreArchivo = req.params.nombrearchivo;

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    pathArchivo = `${path}/${nombreArchivo}`;

    // console.log('pathArchivo: '+pathArchivo)

    if (!fs.existsSync(pathArchivo)) {
        if (tipo !== 'fotoperfil') {
            return res.status(400).json({
                ok: false,
                msg: 'Archivo no existe'
            });
        }
        pathArchivo = `${process.env.PATHUPLOAD}/fotoperfil/no-imagen.jpg`;
    }
    res.sendFile(pathArchivo);
}

module.exports = { subirArchivo, enviarArchivo }