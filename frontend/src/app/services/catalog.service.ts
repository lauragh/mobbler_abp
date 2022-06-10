import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catalogForm } from '../interfaces/catalog-form.interface';
import { Observable } from 'rxjs';
import { Catalogo } from '../models/catalogo.model';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient,
    private router: Router,
    private apiService: ApiService) { }

  addCatalog( formData: any ){
    // console.log('Dentro', formData);
    return this.http.post(`${environment.base_url}/catalogos/`, formData , this.cabeceras);
  }

  cargarCatalogo(id: string ):  Observable<object>{
    return this.http.get<catalogForm[]>(`${environment.base_url}/catalogos/`+id , this.cabeceras);
  }

  crearCatalogo( data: Catalogo ): Observable<object> {
    // console.log(' Entro en crear catalogos');
    return this.http.post(`${environment.base_url}/catalogos/`, data , this.cabeceras);
  }

  actualizarCatalogo(uid, formData: any): Observable<object> {

    return this.http.put(`${environment.base_url}/catalogos/${uid}`, formData , this.cabeceras);
  }

  cargarCatalogos( desde: number, textoBusqueda?: string, tipo?: string, orden?: string, fechaIni?: string, fechaFin?: string, hasta?: number): Observable<catalogForm[]>{
    if(!hasta){
      hasta = 0;
    }
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!orden) {orden = 'Descendente'; }
    if(!fechaIni && !fechaFin){
      fechaIni = '';
      fechaFin = '';
    }
    // console.log('El texto de busqueda es en el service: '+ textoBusqueda);
    if(tipo == ''){tipo = 'nombre';}
    // console.log('peti', fechaIni, fechaFin);
    // console.log('tipo', tipo, 'orden', orden);
    return this.http.get<catalogForm[]>(`${environment.base_url}/catalogos/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&hasta=${hasta}` , this.cabeceras);
  }

  cargarCatalogosusu( desde: number, textoBusqueda?: string, tipo?: string, orden?: string, uid?: string, fechaIni?: string, fechaFin?: string): Observable<catalogForm[]>{
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!orden) {orden = 'Descendente'; }
    if(!fechaIni && !fechaFin){
      fechaIni = '';
      fechaFin = '';
    }
    if(tipo == '' || tipo == undefined){tipo = 'nombre';}
    // console.log('peti', fechaIni, fechaFin);
    // console.log('tipo', tipo, 'orden', orden);
    return this.http.get<catalogForm[]>(`${environment.base_url}/catalogos/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&uid=${uid}` , this.cabeceras);
  }

  eliminarCatalogo (uid) {
    return this.http.delete(`${environment.base_url}/catalogos/${uid}` , this.cabeceras);
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

}