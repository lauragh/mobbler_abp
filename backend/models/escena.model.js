const { Schema, model } = require('mongoose');

const EscenaSchema = Schema({
    titulo: {
        type: String,
        require: true,
    },
    proyecto_uid: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    muebles: [{
        type: Array,
        coordenadas: {
            type: Array,
            required: true,
        },
        rotacion: {
            type: String,
            require: true,
        },
        mueble_uid: {
            type: Schema.Types.ObjectId,
            ref: 'Modelo',
        }
    }],
    imagen: {
        type: String,
        require: true,
    },
    autor: {
        type: String,
        require: true,
    },
    fechaC: {
        type: Date,
        require: true
    }

}, { collection: 'escenas' });

EscenaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('Escena', EscenaSchema);