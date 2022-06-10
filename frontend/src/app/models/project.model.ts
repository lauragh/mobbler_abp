import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Project {
    constructor(
        public uid: string,
        public titulo: string,
        public descripcion: string,
        public notas: string,
        public comentarios: string[][],
        public notificaciones: string[],
        public creador: string,
        public estado: string,
        public nombre_creador: string,
        public usuarios: string,
        public n_muebles: number,
        public muebles: {modelo:string,x: number,y: number,z:number,rotacion:Float32Array}[],
        public clientes: string[][],
        public imagen: string,
        public fecha: Date,
        public fechaC: Date
    )
    {}
}
