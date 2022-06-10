export class Model {

    constructor(
        public uid: string,
        public nombre: string,
        public nombre_catalogo: string,
        public catalogo: string,
        public descripcion: string,
        public medida_ancho: number,
        public medida_alto: number,
        public medida_largo: number,
        public precio: number,
        public colores: string[][],
        public tags: [],
        public archivo: string,
    ){}
}