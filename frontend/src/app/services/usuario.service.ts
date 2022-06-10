import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/user.model';
import { registerForm } from '../interfaces/register-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private apiService: ApiService ) { }

  // login( formData: any ) {
  // console.log('Login desde el Usuario.service: ', formData);
  //   return this.http.post(`${environment.base_url}/login`, formData);
  // }


  login( formData: loginForm ) {
    return this.http.post(`${environment.base_url}/login`, formData)
      .pipe(
        tap((res : any) => {
          // console.log("Respuesta petición login: " + JSON.stringify(res));
          localStorage.setItem('token', res['token']);
          const {uid, rol} = res;
          this.usuario = new Usuario(uid, rol);
        })
      );
  }

  loginGoogle( tokenGoogle ) {
    return this.http.post(`${environment.base_url}/login/google`, {token: tokenGoogle})
      .pipe(
        tap((res : any) => {
          // console.log("Respuesta petición login: " + JSON.stringify(res));
          localStorage.setItem('token', res['token']);
          const {uid, rol} = res;
          this.usuario = new Usuario(uid, rol);
        })
      );
  }

  logout(): void {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }

  nuevoUsuario ( data: Usuario ) {
    // console.log('Entra función nuevoUsuario de usuarioService')
    // console.log(this.cabeceras);
    return this.http.post(`${environment.base_url}/cliente/`, data, this.cabeceras);
    // console.log("Se ha creado el nuevo cliente");
  }
  
  actualizarUsuario ( uid: string, data: Usuario) {
    return this.http.put(`${environment.base_url}/cliente/${uid}`, data, this.cabeceras);
  }

  anyadirCatalogos(catalogo: string, uid: string){
    // console.log('Se anyade el uid de catalogo: '+ catalogo)
 
    // console.log('El uid es : '+ uid);
    return this.http.put(`${environment.base_url}/cliente/catalogos/?uid=${uid}&catalogo=${catalogo}`, this.cabeceras);
  }
  

  actualizarPlan ( uid: string, plan) {
    // console.log('llego al service y este es el plan: '+ plan)
    return this.http.put(`${environment.base_url}/cliente/plan/${uid}`, plan, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/cliente/np/${uid}`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }

  cargarUsuario( uid: string ) {
    if (!uid) { uid = ''; }
    return this.http.get(`${environment.base_url}/cliente/?id=${uid}`, this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string,  fechaIni?: string, fechaFin?: string ): Observable<object> {
    // console.log(desde);
    // console.log(textoBusqueda)
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if(!fechaIni && !fechaFin){
      fechaIni = '';
      fechaFin = '';
    }
    // return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    return this.http.get(`${environment.base_url}/cliente/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarListaUsuarios ( uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/cliente/lista` , data, this.cabeceras);
  }

  cargarUsuariosRol ( rol: string, uids: string[]) {
    const data = { lista: uids };
    return this.http.post(`${environment.base_url}/cliente/rol/${rol}`, data, this.cabeceras);
  }

  borrarUsuario( uid: string ) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/cliente/${uid}` , this.cabeceras);
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // console.log("Respuesta /login/token:"+JSON.stringify(res));
          // Extraemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, rol, token, activo, nombre, apellidos, company, email, numProjects, numCatalog, nif, alta, telefono, direccion, imagen, plan, proyecto, catalogos } = res;
          localStorage.setItem('token', token);
          this.usuario = new Usuario(uid, rol, token, activo, nombre, apellidos, company, email, numProjects, numCatalog, nif, alta, telefono, direccion, imagen, plan, proyecto, catalogos);
          // console.log('usuario',this.usuario);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  establecerdatos(nombre: string, apellidos: string, email: string, direccion: string, telefono: number, nif: string, company: string, plan: string): void {
    this.usuario.nombre = nombre;
    this.usuario.apellidos = apellidos;
    this.usuario.email = email;
    this.usuario.direccion = direccion;
    this.usuario.telefono = telefono;
    this.usuario.nif = nif;
    this.usuario.company = company;
    this.usuario.plan = plan;
  }

  crearImagenUrl(imagen: string) {
    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/upload/fotoperfil/no-imagen?token=${token}`;
    }
    return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
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

  get uid(): string {
    return this.usuario.uid;
  }
  
  get plan(): string {
    return this.usuario.plan;
  }

  get rol(): string {
    return this.usuario.rol;
  }

  get nombre(): string{
    return this.usuario.nombre;
  }

  get apellidos(): string{
    return this.usuario.apellidos;
  }

  get email(): string{
    return this.usuario.email;
  }

  get imagen(): string{
    return this.usuario.imagen;
  }

  get proyecto(): string{
    return this.usuario.proyecto;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }
  get company(): string{
    return this.usuario.company;
  }
  get nif(): string{
    return this.usuario.nif;
  }
  get direccion(): string{
    // hay que añadir a usuario campo direccion 
    return this.usuario.direccion;
  }
  get telefono(): number{
    return this.usuario.telefono;
  }
  get numProjects(): number{
    return this.usuario.numProjects;
  }
  get numCatalog(): number{
    return this.usuario.numCatalog;
  }
  get catalogos(): string[]{
    return this.usuario.catalogos;
  }

  register (formData: registerForm):Promise<any>{
    return new Promise ( (resolve, reject) => {

      let form: registerForm = {
        email: formData.email,
        password: formData.password,
        nombreEmpresa: formData.nombreEmpresa
      };

      this.apiService.register(form).subscribe(res => {

        resolve(true);

      }, (err) =>{
        // console.log('Registro desde Usuario.service: ', form);
        console.warn('Error respuesta api: ', err);
        reject(err);

      });
    });
  }
}
