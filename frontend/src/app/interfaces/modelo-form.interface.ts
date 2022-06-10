export interface modeloForm{
    nombre: string;
    catalogo: string;
    descripcion: string;
    medida_ancho: number;
    medida_alto: number;
    medida_largo: number;
    tags: string[];
    precio: number,
    peso: number,
    archivo: string;
    colores: string[][];
    imagen: string;
    imagenes: string[][];

    // colores: Map<string, string>;
    // fechaC: Date;
    //los opcionales van al final
    //opcional?: string;
}