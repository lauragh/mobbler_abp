// Importación de módulos
const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

// Agregamos Dotenv
// Busca el archivo .env en la raiz de nuestro proyecto y carga las variables
// que en ese archivo esten declaradas en una variable llamada process.env
require('dotenv').config();
// Importar base de datos
const { dbConnection } = require('./database/configdb');
// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(helmet());
//Construye la request como si fuese un JSON
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
}));
app.use('/api/login', require('./routes/auth.router'));
app.use('/api/usuarios', require('./routes/user.router'));
app.use('/api/cliente', require('./routes/client.router'));
app.use('/api/catalogos', require('./routes/catalog.router'));
app.use("/api/proyectos", require("./routes/project.router"));
app.use('/api/modelos', require('./routes/modelo.router'));
app.use('/api/pagos', require('./routes/payment.router'));
app.use('/api/upload', require('./routes/uploads.router'));
app.use('/api/escenas', require('./routes/escena.router'));

// app.use(function(req, res) {
//     res.status(404).end('Error');
// });
// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    //console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});