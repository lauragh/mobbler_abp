import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pagoForm } from '../interfaces/pago-form.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient) { }

  addPago( formData: any ){
    // console.log('Dentro', formData);
    return this.http.post(`${environment.base_url}/pagos`, formData, this.cabeceras);
  }

  cargarPagos( desde: number, textoBusqueda?: string, tipo?: string, orden?:string, fechaIni?: string, fechaFin?: string): Observable<pagoForm[]>{
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!orden) {orden = 'Descendente'; }
    if(!fechaIni && !fechaFin){
      fechaIni = '';
      fechaFin = '';
    }
    // console.log('peti', fechaIni, fechaFin);
    // console.log('texto', textoBusqueda);

    return this.http.get<pagoForm[]>(`${environment.base_url}/pagos/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}`, this.cabeceras);
  }

  cargarPago(id: string): Observable<pagoForm[]>{
    return this.http.get<pagoForm[]>(`${environment.base_url}/pagos/`+id, this.cabeceras);
  }
  cargarPago2(id: string, id_project: string): Observable<pagoForm[]>{
    return this.http.get<pagoForm[]>(`${environment.base_url}/pagos/client/?uid=${id}&project=${id_project}`, this.cabeceras);
  }
  
  cargarPagosCliente(desde: number, cliente?: string){
    if (!desde) { desde = 0;}
    //ttp://localhost:3000/api/pagos/cliente/?desde=0&cliente=621cae0e0a5b4a18fb59df4d
    return this.http.get<pagoForm[]>(`${environment.base_url}/pagos/cliente/?desde=${desde}&cliente=${cliente}`, this.cabeceras);
  }
  
  actualizarPago(formData: any, id: string){
    return this.http.put(`${environment.base_url}/pagos/`+id, formData, this.cabeceras);
  }

  borrarPago(id:string){
    return this.http.delete(`${environment.base_url}/pagos/`+id, this.cabeceras);
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
