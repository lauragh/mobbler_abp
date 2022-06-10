const { Schema, model } = require('mongoose');

const CatalogSchema = Schema({

    nombre: {
        type: String,
        require: true
    },
    num_modelos: {
        type: Number,
        required: true,
    },
    fabricante: {
        type: String,
        require: true
    },
    precio: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        require: true
    },
    models: {
        type: Array,
        // require: true
    },
    fecha: {
        type: Date,
        require: true
    }
}, { collection: 'catalogos' });

CatalogSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Catalogo', CatalogSchema);