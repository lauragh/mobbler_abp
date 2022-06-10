
export class Escena {

    constructor(
        public titulo: string,
        public proyecto_uid: string,
        public muebles: {coordenadas: {x: Number, y: Number, z: Number}, rotacion:Float32Array,mueble_uid:string}[],
        public autor: string,
        public imagen: string,
        public fechaC: Date,
    )
    {}

}

