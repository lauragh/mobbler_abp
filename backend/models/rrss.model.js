const { Schema, model } = require('mongoose');

const rrssSchema = Schema({

    tipo: {
        type: String,
        require: true
    },
    followers: {
        type: Number,
        // require: true
    },
    temas: {
        type: Array,
        required: true,
    },
    fecha: {
        type: Array,
        require: true
    },


}, { collection: 'rrss' });

rrssSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model('rrss', rrssSchema);