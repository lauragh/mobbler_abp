import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Escena } from '../models/escena.model';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EscenaService {

  constructor(private http: HttpClient,
    private router: Router,
    private apiService: ApiService) { }

  cargarEscena(id: string ):  Observable<object>{
    return this.http.get<Escena>(`${environment.base_url}/escenas/`+id , this.cabeceras);
  }

  crearEscena( data: Escena ): Observable<object> {
    //console.log(' Entro en crear escenas');
    //console.log('estoy enviando',data);
    return this.http.post(`${environment.base_url}/escenas/`, data , this.cabeceras);
  }

  actualizarEscena(uid, formData: any): Observable<object> {
    return this.http.put(`${environment.base_url}/escenas/${uid}`, formData , this.cabeceras);
  }

  cargarEscenas( desde: number, textoBusqueda?: string, tipo?: string, orden?: string, fechaIni?: string, fechaFin?: string, hasta?: number): Observable<Escena[]>{
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
    return this.http.get<Escena[]>(`${environment.base_url}/escenas/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&hasta=${hasta}` , this.cabeceras);
  }

  cargarEscenasProyecto( desde: number, proyecto: string, textoBusqueda?: string, tipo?: string, orden?: string, fechaIni?: string, fechaFin?: string, hasta?: number): Observable<Escena[]>{
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
    return this.http.get<Escena[]>(`${environment.base_url}/escenas/proyecto/?desde=${desde}&proyecto=${proyecto}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&hasta=${hasta}` , this.cabeceras);
  }

  eliminarEscena (uid) {
    return this.http.delete(`${environment.base_url}/escenas/${uid}` , this.cabeceras);
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