import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Router } from '@angular/router';
import { projectsData } from '../interfaces/project-form.interface'
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private proyecto: Project;

  constructor( private http: HttpClient,
               private router: Router,
               private apiService: ApiService) { }

  cargarProyectos( desde: number, 
                   textoBusqueda?: string, 
                   tipo?: string, 
                   orden?: string, 
                   fechaIni?: string, 
                   fechaFin?: string, 
                   hasta?: number): 
  Observable<object> {
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
    if(!tipo){
      tipo = 'fecha';
    }
    // console.log('peti', fechaIni, fechaFin);
    // console.log('texto', textoBusqueda);

    return this.http.get(`${environment.base_url}/proyectos/?desde=${desde}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&hasta=${hasta}` , this.cabeceras);
  }  
  cargarModelosProyecto(uid){
    return this.http.get(`${environment.base_url}/proyectos/project/?project_uid=${uid}`, this.cabeceras);
  }
  
  cargarProyectosUsuario( desde: number, uid: string, textoBusqueda?: string, tipo?: string, orden?: string, fechaIni?: string, fechaFin?: string, hasta?: number): Observable<object> {
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
    if(!tipo){
      tipo = 'fecha';
    }
    // console.log('peti', fechaIni, fechaFin);
    // console.log('texto', textoBusqueda);

    return this.http.get(`${environment.base_url}/proyectos/usuario/?desde=${desde}&uid=${uid}&texto=${textoBusqueda}&tipo=${tipo}&orden=${orden}&fechaIni=${fechaIni}&fechaFin=${fechaFin}&hasta=${hasta}` , this.cabeceras);
  }

  getProjects(): Observable<projectsData[]>{
    return this.http.get<projectsData[]>(`${environment.base_url}/proyectos/`, this.cabeceras);
  }

  getProject( id: string ):Observable<object>{
    return this.http.get<projectsData[]>(`${environment.base_url}/proyectos/`+id , this.cabeceras);
  }

  deleteProject(id) {
    // `${environment.base_url}/catalogos/`+id
    // console.log(`${environment.base_url}/proyectos/`+id);
    return this.http.delete(`${environment.base_url}/proyectos/${id}`, this.cabeceras);
  }

   postProject(formData: any ) {
    // console.log('Dentro', formData);
    return this.http.post(`${environment.base_url}/proyectos/`, formData, this.cabeceras);
   }

  editProject(id:string, formatData:any){
    // console.log(`EditProject: ${environment.base_url}/proyectos/`+id);
    return this.http.put(`${environment.base_url}/proyectos/`+id, formatData, this.cabeceras);
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