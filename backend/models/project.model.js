const { Schema, model } = require("mongoose");

const ProjectSchema = Schema({
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    notas: {
        type: String,
        // required: true,
    },
    comentarios: {
        type: Array,
        // required: true,
    },
    notificaciones: {
        type: Array,
        // required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        require: true
    },
    nombre_creador: {
        type: String,
        required: true,
    },
    clientes: {
        type: Array,
        // required: true,
    },
    n_muebles: {
        type: Number,
        required: true,
    },
    muebles: [{
        type: Array,
        mueble: {
            type: Schema.Types.ObjectId,
            ref: 'Modelo',
        },
        x: {
            type: Number,
            require: true,
        },
        y: {
            type: Number,
            require: true,
        },
        z: {
            type: Number,
            require: true,
        },
        rotacion: {
            type: Number,
            require: true,
        }
    }],
    imagen: {
        type: String,
        // required: true,
    },
    fechaC: {
        type: Date,
        require: true,
    },
    fecha: {
        type: Date,
        require: true,
    }
}, { collection: "projects" });

ProjectSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model("Project", ProjectSchema);