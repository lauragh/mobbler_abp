import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Model } from '../models/models.model';
import { modeloForm } from '../interfaces/modelo-form.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { Modelo } from '../models/modelo.model';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  // private modelo: Modelo;
  constructor(private http: HttpClient) { }

  addModelo( formData: any ){
    // console.log('Dentro', formData);
    return this.http.post(`${environment.base_url}/modelos`, formData, this.cabeceras);
  }

  cargarModelos( desde: number, textoBusqueda?: string, tipo?: string, orden?:string, fechaIni?: string, fechaFin?: string): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!orden) {orden = 'Descendente'; }
    if(!fechaIni && !fechaFin){
      fechaIni = '';
      fechaFin = '';
    }
    // console.log('tipo', tipo);
    // console.log('peti', fechaIni, fechaFin);
    return this.http.get(`${environment.base_url}/modelos/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}` , this.cabeceras);
  }


  cargarModelosProyecto(uid){

    return this.http.get(`${environment.base_url}/modelos/project/?project_uid=${uid}`, this.cabeceras);

  }
  
  cargarModelo(id: string): Observable<modeloForm[]>{
    return this.http.get<modeloForm[]>(`${environment.base_url}/modelos/`+id, this.cabeceras);
  }
  actualizarModelo(formData: any, id: string){
    return this.http.put(`${environment.base_url}/modelos/`+id, formData, this.cabeceras);
  }

  borrarModelo(id:string){
    return this.http.delete(`${environment.base_url}/modelos/`+id, this.cabeceras);

  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // get uid(): string {
  //   return this.modelo.uid;
  // }

}
