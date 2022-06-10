
export class Catalogo {

    constructor(
        public nombre: string,
        public num_modelos: number,
        public fabricante: string,
        public precio: number,
        public imagen: string,
        public models: string[],
        public fecha: Date,
        public uid?: string,
    )
    {}

}

