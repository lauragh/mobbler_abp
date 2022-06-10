import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  // -- VARIABLES VENTANA MODAL --
  switchModal: boolean;
  switchModal2: boolean;

  // -- VARIABLES FORM EDITAR CLIENTE --
  private formSubmited = false;
  private uid: string = '';
  public enablepass: boolean = true;
  public showOKP: boolean = false;
  arrayCatalogos: string[][] = [];
  inicio: any;
  fin: any;
  fIni: any;
  fFin: any;

  //Client model tiene 16 campos
  public datosForm = this.fb.group({
    uid: [{value: '', disabled: true}, Validators.required],
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    email: [ '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    company: ['', Validators.required],
    plan: ['', Validators.required],
    proyecto: ['', Validators.required],
    rol: ['ROL_CLIENTE', Validators.required ],
  });

  public nuevoPassword = this.fb.group({
    password: ['', Validators.required],
  });

  // -- VARIABLES GENERALES --
  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  public ultimaBusqueda = '';
  public listaUsuarios: Usuario[] = [];

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private renderer: Renderer2,
               private router: Router ) { }

  ngOnInit(): void {
    this.cargarUsuarios(this.ultimaBusqueda);
    // console.log('Empieza cargando usuarios');
  }

  @ViewChild('modificar') modificar: ElementRef;
  // @ViewChild('fechaIni') fechaIni: ElementRef;
  // @ViewChild('fechaFin') fechaFin: ElementRef;

  nuevo(): void {
    this.formSubmited = false;
    this.datosForm.reset();
    this.nuevoPassword.reset();
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    this.datosForm.get('rol').setValue('ROL_CLIENTE');
    this.datosForm.get('password').enable();
    this.enablepass = true;
  }

  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // console.log('Entra función cargarUsuarios')
        // console.log(res);
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['clientes'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarUsuarios(this.ultimaBusqueda);
          } else {
            this.listaUsuarios = [];
            this.totalusuarios = 0;
            Swal.fire({icon: 'warning', title: 'Oops...', text: 'No se han encontrado resultados en la BBDD'});
          }
        } else {
          this.listaUsuarios = res['clientes'];
          // console.log('Lista de usuarios: ');
          // console.log(this.listaUsuarios);
          this.totalusuarios = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        // console.warn('error:', err);
        this.loading = false;
      });
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarUsuarios(this.ultimaBusqueda);
  }
 
  cambiarPassword(){
    const data = {
      password : this.nuevoPassword.get('password').value,
      nuevopassword: this.nuevoPassword.get('password').value,
      nuevopassword2: this.nuevoPassword.get('password').value
    };
    this.usuarioService.cambiarPassword( this.datosForm.get('uid').value, data)
      .subscribe(res => {
        this.nuevoPassword.reset();
        this.showOKP = true;
      }, (err)=>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
  }

  eliminarUsuario( uid: string, nombre: string, apellidos: string ){
    // console.log("eliminarUsuario");
    // console.log('uid: ' + uid);

    // TO-DO
    // Poner condicion de si usuarioService.uid es invalid o null
    // console.log('usuarioService.uid' + this.usuarioService.uid);
    // Comprobar que no me borro a mi mismo
    if (uid === this.usuarioService.uid) {
      // console.log('Entra')
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
      return;
    }
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar usuario',
      text: `Al eliminar al usuario '${nombre} ${apellidos}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
        if (result.value) {
          this.usuarioService.borrarUsuario(uid)
            .subscribe( resp => {
              this.cargarUsuarios(this.ultimaBusqueda);
            }
            ,(err) =>{
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              // console.warn('error:', err);
            })
        }
      });
  }

  campoNoValido( campo: string ) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  cargaDatosForm(res: any): void {
    // console.log('Entra a cargaDatosForm')
    this.datosForm.get('uid').setValue(res['clientes'].uid);
    // console.log(this.datosForm)
    this.datosForm.get('nombre').setValue(res['clientes'].nombre);
    this.datosForm.get('apellidos').setValue(res['clientes'].apellidos);
    this.datosForm.get('email').setValue(res['clientes'].email);
    this.datosForm.get('password').setValue('1234');
    this.datosForm.get('password').disable();
    this.datosForm.get('company').setValue(res['clientes'].company);
    this.datosForm.get('plan').setValue(res['clientes'].plan);
    this.datosForm.get('proyecto').setValue(res['clientes'].numProjects);
    this.enablepass = false;
    this.datosForm.markAsPristine();
  }

  cancelar(): void {
    this.offModal2();
    this.usuarioService.cargarUsuario(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['clientes']) {
          this.router.navigateByUrl('/user');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargaDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/user');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
  }

  // Funcion que se llama tanto al CREAR cliente como ACTUALIZAR
  enviar( resForm: any ): void {
    // console.log('Entra a función Entrar')
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    // Diferenciar entre dar de alta uno nuevo o actualizar uno que ya existe
    // Alta de uno nuevo
    if (this.datosForm.get('uid').value === 'nuevo') {
      // console.log('Llega');
      this.datosForm.get('nombre').setValue(resForm.value.nombre);
      this.datosForm.get('apellidos').setValue(resForm.value.apellidos);
      this.datosForm.get('email').setValue(resForm.value.email);
      this.datosForm.get('password').setValue(resForm.value.email);
      this.datosForm.get('company').setValue(resForm.value.company);
      this.datosForm.get('plan').setValue(resForm.value.plan);

      // console.log(this.datosForm);

      this.usuarioService.nuevoUsuario( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.get('uid').setValue(res['cliente'].uid);
          this.datosForm.get('password').disable();
          this.enablepass = false;
          this.datosForm.markAsPristine();
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });
    } else {
      // console.log('Entra a modificar datos del cliente')
      // Actualizar el usuario
      this.usuarioService.actualizarUsuario( this.datosForm.get('uid').value, this.datosForm.value )
        .subscribe( res => {
          // console.log('Datos cliente modificado: '+res)
          this.datosForm.markAsPristine();
          this.offModal2();
          this.cargarUsuarios(this.ultimaBusqueda);
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: `Cliente ${this.datosForm.get('nombre').value}`,
            text: 'Modificado de forma correcta',
            icon: 'success',
          })

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
    }
  }

  crearImagenUrl(imagen: string) {
    // console.log(imagen);
    return this.usuarioService.crearImagenUrl(imagen);
  }

  onModal(){
    this.switchModal = true;
  }

  offModal(){
    this.switchModal = false;
  }

  onModal2(res:any){
    this.switchModal2 = true;
    this.renderer
    // -- PARA EDITAR UN CLIENTE --
    // this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(res.uid);

    if (this.uid !== 'nuevo') {
      // console.log("Entra onModal2")
      // console.log("usuarioService.uid" + this.usuarioService.uid);
      this.usuarioService.cargarUsuario(res.uid)
        .subscribe( res => {
          // console.log('Datos del usuario a modificar: '+JSON.stringify(res));
          this.cargaDatosForm(res);
        }, (err) => {
          this.router.navigateByUrl('/user');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo'});
          return;
        });
    }
  }

  offModal2(){
    this.switchModal2 = false;
  }
}
