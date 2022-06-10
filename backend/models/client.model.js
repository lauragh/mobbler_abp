const { Schema, model } = require('mongoose');

// Campos //
// Nombre 
// Apellido
// Nombre de la empresa 
// Telefono
// Direccion 
// Email (*)
// Pass (*)

const ClientSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String
    },
    company: {
        type: String
    },
    nif: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    telefono: {
        type: Number
    },
    direccion: {
        type: String
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        require: true,
        default: 'ROL_CLIENTE'
    },
    plan: {
        type: String,
        require: true,
        default: 'GRATUITO'
    },
    numProjects: {
        type: Number,
        require: true,
        default: 0
    },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    catalogos: {
        type: Array,
        required: true,
    },
    numCatalog: {
        type: Number,
        require: true,
        default: 0
    },
    alta: {
        type: Date,
        require: true,
        default: Date.now()
    }
}, { collection: 'Clients' });

ClientSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Cliente', ClientSchema);