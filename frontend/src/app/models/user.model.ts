import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {

    constructor( public uid: string,
                 public rol: string,
                 public token?: string,
                 public activo?: any,
                 public nombre?: string,
                 public apellidos?: string,
                 public company?: string,
                 public email?: string,
                 public numProjects?: number,
                 public numCatalog?: number,
                 public nif?: string,
                 public alta?: Date,
                 public telefono?: number,
                 public direccion?: string,
                 public imagen?: string,
                 public plan?: string,
                 public proyecto?: string,
                 public catalogos?: string[]) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}