const { Schema, model } = require('mongoose');

const ModeloSchema = Schema({
    nombre: {
        type: String,
        require: true,
    },

    catalogo: {
        type: Schema.Types.ObjectId,
        ref: 'Catalogo',
        // require: true
    },

    nombre_catalogo: {
        type: String,
        require: true
    },

    descripcion: {
        type: String,
        require: true
    },

    medida_ancho: {
        type: Number,
        require: true
    },

    medida_alto: {
        type: Number,
        require: true

    },

    medida_largo: {
        type: Number,
        require: true

    },

    tags: {
        type: Array,
        require: true
    },

    archivo: {
        type: Array,
        // require: true
    },

    imagen: {
        type: String,
        // require: true
    },

    imagenes: {
        type: Array,

    },

    colores: {
        type: Array,
        require: true
    },

    precio: {
        type: Number,
        //require: true
    },

    peso: {
        type: Number,
        //require: true
    },
    fecha: {
        type: Date,
        require: true
    }


}, { collection: 'modelos' });

ModeloSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});
module.exports = model('Modelo', ModeloSchema)