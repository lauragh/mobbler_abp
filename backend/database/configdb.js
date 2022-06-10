// Modulo que permite trabajar con modelos de objetos
// a traves de los cuales operar contra la DB de forma rapida y agil
const mongoose = require('mongoose');
// Creamos un objeto conexión:

const dbConnection = async() => {
        try {
            await mongoose.connect(process.env.DBCONN, {
                useNewUrlParser: true,
                useUnifiedTopology: true
                    //useFindAndModify: false,
                    //useCreateIndex: true
            });
            //console.log('DB online');
        } catch (error) {
            //console.log(error);
            throw new Error('Error al iniciar la BD');
        }
    }
    // Y exportamos el módulo para que pueda ser utilizado por terceros:

module.exports = { dbConnection }