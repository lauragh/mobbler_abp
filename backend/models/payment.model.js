const { Schema, model } = require('mongoose');

const ModeloSchema = Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        // require: true
    },
    companyia: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
    },

    nombre_companyia: {
        type: String,
        require: true,
    },

    plan: {
        type: String,
        require: true
    },

    periodoIni: {
        type: Date,
        require: true
    },

    periodoFin: {
        type: Date,
        require: true
    },

    precio: {
        type: Number,
        require: true

    },
    fecha: {
        type: Date,
        require: true
    },
    fechaC: {
        type: Date,
        require: true
    }


}, { collection: 'payment' });

ModeloSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});
module.exports = model('payment', ModeloSchema)