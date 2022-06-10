import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

//Services
import { ProjectService } from '../../services/project.service';
import { UsuarioService } from '../../services/usuario.service';
import { SharedService } from '../../services/shared.service';

import { FormBuilder, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
//Models
import { Project } from '../../models/project.model';
import { Usuario } from '../../models/user.model';

//Libraries
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

//para mandar emails
import '../../../assets/smtp.js'; 
declare let Email : any;


@Component({
  selector: 'app-gestor-proyectos',
  templateUrl: './gestor-proyectos.component.html',
  styleUrls: ['./gestor-proyectos.component.scss']
})
export class GestorProyectosComponent implements OnInit {
  activado:boolean  = false;
  arrayC: string[] = [];
  arrayClientes: string[][] = [];
  arrayModificado: string[][] = [];
  uid: string;
  numProyectos: number;
  numPTotal: any;
  plan: string;
  orden: string;
  tipo: string;
  usuario: Usuario;
  uidProyecto: String;

  public ruta = false;
  public formSubmit = false;
  public ultimaBusqueda = '';
  public loading = true;
  public totalproyectos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaProyectos: Project[] = [];
  

  @ViewChild('cards') cards: ElementRef;
  @ViewChild('modulo') modulo: ElementRef;
  @ViewChild('nombreCliente') nombreCliente: ElementRef;
  @ViewChild('emailCliente') emailCliente: ElementRef;
  @ViewChild('campoClientes') campoClientes: ElementRef;
  @ViewChild('botonCrear') botonCrear: ElementRef;
  @ViewChild('botonAceptar') botonAceptar: ElementRef;
  @ViewChild('titulo') titulo: ElementRef;
  @ViewChild('ordenCampo') ordenCampo: ElementRef;
  @ViewChild('disponibilidad') disponibilidad: ElementRef;

  constructor(private router: Router,
              private sharedService: SharedService,
              private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private projectService: ProjectService,
              private renderer2: Renderer2,
              private fb: FormBuilder) { }

  public datosForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    notas: [''],
    creador: [''],
    comentarios: [''],
    notificaciones: [''],
    estado: [''],
    nombre_creador: ['', Validators.required],
    n_muebles: ['', Validators.required],
    clientes: [''],
    imagen: [''],
    fecha: [''],
    fechaC: ['']
  });

  ngOnInit(): void {
    // this.compruebaRuta();
    this.route.queryParams
    .subscribe(params => {
      this.uidProyecto = params.proyecto || '';

      // console.log('Params despuesS: ',JSON.stringify(params));

      if(Object.keys(params).length !== 0){
        this.ruta = true;
        // console.log('Ruta despues: ',this.ruta);
      }
    });
    this.cargarUsuario();
    this.cargarProyectos(this.ultimaBusqueda);
    this.cargarDisponibilidad();
  }

  compruebaRuta(){
    this.route.queryParams.subscribe(params => {
      //console.log('Params: ',params);
      if(params.proyecto !== '' || params.proyecto !== 'null' ||
         this.uidProyecto !== '' ||this.uidProyecto !== 'null'){
        this.ruta = true;
      }
    });
  }

  mandoEmail() {
    if(this.datosForm.get('clientes').value != ''){
      let correo = this.arrayC[1];
      //la url del proyecto tiene que cambiar y redirigir al proyecto en especifico
      //console.log("el array es este "+this.arrayC[1]);
      let proyectoUrl= "https://mobbler.ovh/#/landing";
      Email.send({
        Host : 'smtp.elasticemail.com',
        Username : 'coralteam.abp@gmail.com',
        Password : '2C172AD14704033D0AA6E60BC1E13F9E24D5',
        To : correo,
        From : 'coralteam.abp@gmail.com',
        Subject : 'esto es lo que mando',
        Body : '<h1>Entra en tu proyecto</h1><p>Haz click en el botón y accede a tu reforma</p><a style="background-color: #77A4A1; color: white;padding: 15px 25px;" target="_blank" class="fcc-btn" href="'+proyectoUrl+'">Mi proyecto</a> '    
      }).then( message => {
        setTimeout(() => {
          alert('Se ha mandado el correo a '+ correo);
        }, 2000);
      });   
    }
  }
      
  pestanya(elemento){
    if(!this.activado){
      this.renderer2.setStyle(elemento,'display','block');
      this.activado = true;
    }
    else{
      this.renderer2.setStyle(elemento,'display','none');
      this.activado = false;
    }
  }

  ordenar(){
    if(this.ordenCampo.nativeElement.value == 'tituloA'){
      this.tipo = 'titulo';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'tituloD'){
      this.tipo = 'titulo';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'clientesA'){
      this.tipo = 'clientes';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'clientesD'){
      this.tipo = 'clientes';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'creadorA'){
      this.tipo = 'nombre_creador';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'creadorD'){
      this.tipo = 'nombre_creador';
      this.orden = 'Descendente';
    }
    this.cargarProyectos(this.ultimaBusqueda);
  }

  async editarUsuario(){
    // console.log('envio esto', this.usuario);
    this.usuarioService.actualizarUsuario(this.usuarioService.uid, this.usuario)
    .subscribe( res => 
    {
    //  console.log('usuario enviado',this.usuario);
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
    });
  }

  cargarUsuario():void {
    this.usuarioService.cargarUsuario(this.usuarioService.uid)
    .subscribe( res => {
      this.usuario = res['clientes'];
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});

     });
    }
  
  cargarDisponibilidad(){
    // console.log('plan',this.usuarioService.plan);
    // console.log('numP',this.usuarioService.numProjects);

    if(this.usuarioService.plan == 'GRATUITO'){
      this.numPTotal = 2;
    }
    else if(this.usuarioService.plan == 'BASICO-MENSUAL' || this.usuarioService.plan == 'BASICO-ANUAL'){
      this.numPTotal = 30;
    }
    else if(this.usuarioService.plan == 'PREMIUM-MENSUAL' || this.usuarioService.plan == 'PREMIUM-ANUAL'){
      this.numPTotal = 'Ilimitado';
    }
    this.numProyectos = this.usuarioService.numProjects;
    // console.log(this.usuarioService.numProjects,this.numPTotal);
    // this.disponibilidad.nativeElement.innerHTML = 'Proyectos ' +this.usuarioService.numProjects +"/"+this.numPTotal;
    // console.log(this.disponibilidad.nativeElement);

  }

  cargarClientes(array, array2){
    // console.log(array);
    // console.log('arrayModificado', array2);
    for(let entry of array){
      array2.push(entry);
      const div = this.renderer2.createElement('div');
      const span = this.renderer2.createElement('span');
      const email = this.renderer2.createElement('p');
      const nombre = this.renderer2.createElement('p');

      const nombreC = this.renderer2.createText(entry[0]);
      const emailC = this.renderer2.createText(entry[1]);

      this.renderer2.appendChild(nombre,nombreC);
      this.renderer2.appendChild(email,emailC);
      this.renderer2.appendChild(span,nombre);
      this.renderer2.appendChild(span,email);

      this.renderer2.appendChild(div, nombre);
      this.renderer2.appendChild(div, email);
      this.renderer2.setAttribute(nombre,'class','campo');
      this.renderer2.setAttribute(email,'class','campo');
      this.nombreCliente.nativeElement.value = '';
      this.emailCliente.nativeElement.value = '';

      //añado cruz en los tags, para eliminar
      const span2 = this.renderer2.createElement('span');
      const contenido2 = this.renderer2.createText('\u2715');
      this.renderer2.appendChild(span2, contenido2);

      let palabraBorrada;
      palabraBorrada = entry[1];
      // this.renderer2.appendChild(span, span2);
      this.renderer2.setAttribute(span,'class','col etiqueta');
      // this.renderer2.setAttribute(span2,'style', 'cursor: pointer');
      this.renderer2.setAttribute(div,'class','divCliente');
      this.renderer2.appendChild(this.campoClientes.nativeElement, div);
      this.renderer2.appendChild(this.campoClientes.nativeElement, span);

      //elimino el tag y la palabra del array si pulsa la cruz
      this.renderer2.listen(span2, 'click', () =>{
        let pos, posi;
        for(let i = 0; i < this.campoClientes.nativeElement.childNodes.length; i++){
          if(this.campoClientes.nativeElement.childNodes[i].innerHTML.search(palabraBorrada) !== -1){
            pos = i;
          }
        }
        this.renderer2.removeChild(this.campoClientes.nativeElement, span);
        this.renderer2.removeChild(this.campoClientes.nativeElement, div);
        array2.forEach((element,index)=>{
          // console.log('elemento',element[1]);
          // console.log('palabraBorrada', palabraBorrada);
          if(element[1] === palabraBorrada){
            posi = index;
            array2.splice(index,1,);
            // console.log("lo he borrado");
          }
        });
      // console.log('resultado', array2);
      });

      // for(let elemento in this.arrayClientes){
      //   console.log('elemento de arrayClientes', this.arrayClientes[elemento]);
      // }
    }
  }

  async formEditarProyecto(){
    this.projectService.getProject(this.uid)
    .subscribe( res => 
      {
        // console.log(res);
        this.datosForm.get('titulo').setValue(res['proyecto'].titulo);
        this.datosForm.get('descripcion').setValue(res['proyecto'].descripcion);
        this.datosForm.get('notas').setValue(res['proyecto'].notas);
        this.datosForm.get('creador').setValue(res['proyecto'].creador);
        this.datosForm.get('nombre_creador').setValue(res['proyecto'].nombre_creador);
        this.datosForm.get('n_muebles').setValue(res['proyecto'].n_muebles);
        this.datosForm.get('fechaC').setValue(res['proyecto'].fechaC);
        this.datosForm.get('fecha').setValue(res['proyecto'].fecha);
        this.cargarClientes(res['proyecto'].clientes, this.arrayModificado);
      }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
    });
  }

  editar(uid: string){
    this.uid = uid;
    this.titulo.nativeElement.innerHTML = 'Editar Proyecto';
    this.campoClientes.nativeElement.innerHTML = '';
    this.arrayModificado = [];
    this.arrayClientes = [];
    this.datosForm.reset();
    this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','block');
    this.renderer2.setStyle(this.botonCrear.nativeElement,'display','none');
    this.formEditarProyecto();
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');    
  }

  duplicar(uid: string){
    let datos;
    // console.log('duplicar');
    this.projectService.getProject(uid)
    .subscribe( res =>
      {
        datos = JSON.parse(JSON.stringify(res['proyecto']));
        // this.cargarClientes(res['proyecto'].clientes, this.arrayModificado);
        this.duplicarProyecto(datos);
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
    });
    
  }

  eliminar(id: string, titulo: string){
    // console.log('eliminar');
    // DELETE (modal)
    Swal.fire({
      title: 'Eliminar Proyecto',
      text: `Al eliminar el proyecto '${titulo}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: 'Cancelar',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
        // console.log("El uid es " + id)
          if (result.value) {
            this.projectService.deleteProject(id)
              .subscribe( resp => {
                this.numProyectos--;
                this.usuario.numProjects--;
                this.editarUsuario();
                this.cargarProyectos(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }


  cargarTarjetas(){
    this.cards.nativeElement.innerHTML = '';

    // const contenedor = this.renderer2.createElement('div');
    const anadir = this.renderer2.createElement('div');
    const mas = this.renderer2.createElement('p');
    const contenido = this.renderer2.createText('+');
    this.renderer2.appendChild(mas,contenido);
    this.renderer2.setAttribute(mas,"class", "letraMas colorLetraOscura");
    this.renderer2.appendChild(anadir,mas);
    this.renderer2.listen(anadir, "click", event => {
      this.onModal();
    });
    this.renderer2.setAttribute(anadir,"class", "tarjetaMas justify-content-center");
    this.renderer2.appendChild(this.cards.nativeElement, anadir);

    for(let entry of this.listaProyectos){
      const div = this.renderer2.createElement('div');
      const div2 = this.renderer2.createElement('div');
      const img = this.renderer2.createElement('img');
      const titulo = this.renderer2.createElement('h4');
      const img2 = this.renderer2.createElement('img');
      const contenido = this.renderer2.createText(entry.titulo);
      const descripcion = this.renderer2.createElement('p');
      const contenido2 = this.renderer2.createText(entry.descripcion);
      const clientes = this.renderer2.createElement('h5');
      const contenido3 = this.renderer2.createText('Clientes');
      const divClientes = this. renderer2.createElement('div');

      // this.renderer2.setAttribute(div, "class", "card__info");

      // Creación opciones
      const div3 = this.renderer2.createElement('div');
      const editar = this.renderer2.createElement('p');
      const duplicar = this.renderer2.createElement('p');
      const eliminar = this.renderer2.createElement('p');
      const cEditar = this.renderer2.createText('Editar');
      const cDuplicar = this.renderer2.createText('Duplicar');
      const cEliminar = this.renderer2.createText('Eliminar');

      this.renderer2.appendChild(editar,cEditar);
      this.renderer2.appendChild(duplicar,cDuplicar);
      this.renderer2.appendChild(eliminar,cEliminar);

      this.renderer2.setAttribute(editar, "class", "colorLetraOscura text-left opcion");
      this.renderer2.setAttribute(duplicar, "class", "colorLetraOscura text-left opcion");
      this.renderer2.setAttribute(eliminar, "class", "colorLetraOscura text-left opcion");

      this.renderer2.appendChild(div3,editar);
      this.renderer2.appendChild(div3,duplicar);
      this.renderer2.appendChild(div3,eliminar);

      this.renderer2.listen(editar, "click", event => {
        this.editar(entry.uid);
      });
      // this.renderer2.listen(editar, "mousemove", event => {
      //   this.renderer2.setStyle(editar, "background-color", "black");
      // });
      this.renderer2.listen(duplicar, "click", event => {
        this.duplicar(entry.uid);
      });

      this.renderer2.listen(eliminar, "click", event => {
        this.eliminar(entry.uid,entry.titulo);
      });

      this.renderer2.setAttribute(div3, "class", "opciones");

      //Imagen portada
      if(entry.imagen){
        this.renderer2.setAttribute(img, "src", "assets/img/proyectos/"+entry.imagen);
      }
      else{
        this.renderer2.setAttribute(img, "src", "assets/img/noimage.jpg");

      }
      this.renderer2.setAttribute(img, "style", "width: 350px; height:250px;cursor:pointer");
      this.renderer2.setAttribute(img, "class", "img-catalogo");
      this.renderer2.listen(img, 'click', () =>{
        let proyectoUid = entry.uid;
        // console.log('El uid de este proyecto es: '+entry.uid)
        // console.log(`/home?desde=${proyectoUid}`);
        this.router.navigateByUrl(`/home?proyecto=${proyectoUid}`);
        //this.router.navigate(['/home',proyectoUid]);
      });
      this.renderer2.appendChild(div,img);

      const proceso = this.renderer2.createElement('p');
      const procesoContenido = this.renderer2.createText(entry.estado);
      this.renderer2.appendChild(proceso,procesoContenido);
      this.renderer2.setAttribute(proceso, "class", "estiloEstado");

      if(entry.estado == 'Terminado'){
        this.renderer2.setAttribute(proceso, "style", "background-color: grey");

      }
      else if(entry.estado == 'En desarrollo'){
        this.renderer2.setAttribute(proceso, "style", "background-color: green");
      }
      this.renderer2.appendChild(div,proceso);

      //puntos opciones
      
      this.renderer2.setAttribute(img2, "src", "assets/img/puntos.png");
      this.renderer2.setAttribute(img2, "style", "width: 8px; float: right; cursor:pointer");
      this.renderer2.listen(img2, "click", event => {
        this.pestanya(div3);
      });
      this.renderer2.appendChild(div2,img2);
      this.renderer2.insertBefore(div2, div3, img2.firstChild)
      // this.renderer2.appendChild(div2,div3);

      //titulo
      this.renderer2.appendChild(titulo,contenido);
      this.renderer2.setAttribute(titulo, "class", "card__title colorLetraOscura");
      this.renderer2.appendChild(div2,titulo);

      //descripción
      this.renderer2.appendChild(descripcion,contenido2);
      this.renderer2.setAttribute(descripcion, "style", "width: 300px; height: 80px");
      this.renderer2.setAttribute(descripcion, "class", "colorLetraOscura");
      this.renderer2.appendChild(div2,descripcion);

      this.renderer2.appendChild(clientes,contenido3);
      this.renderer2.setAttribute(clientes, "class", "card__category colorLetraOscura");
      this.renderer2.setAttribute(clientes, "style", "width: auto; display: block;");

      this.renderer2.appendChild(div2,clientes);

 
      let nombreC,email;

      for(let cliente of entry.clientes){
        let d = this.renderer2.createElement('div');
        let pn = this.renderer2.createElement('p');
        let pe = this.renderer2.createElement('p');
        nombreC = this.renderer2.createText(cliente[0]);
        email = this.renderer2.createText("("+cliente[1]+")");
        this.renderer2.appendChild(pn, nombreC);
        this.renderer2.appendChild(pe, email);
        this.renderer2.setAttribute(pn, "class", "colorLetraOscura");
        this.renderer2.setStyle(pn, "margin-right", "10px");
        this.renderer2.setAttribute(pe, "class", "colorLetraOscura");
        this.renderer2.setStyle(pe, "margin-right", "10px ");
        this.renderer2.appendChild(d, pn);
        this.renderer2.appendChild(d, pe);
        this.renderer2.setStyle(d, 'display', 'flex');
        this.renderer2.appendChild(divClientes, d);
      }
      this.renderer2.setAttribute(divClientes, "style", "width: auto; display: block;");
      this.renderer2.appendChild(div2,divClientes);
 

      this.renderer2.setAttribute(div2, "style","padding: 10px; padding-left: 22px; width: 350px; text-align: left; position: relative;");
      this.renderer2.appendChild(div,div2);

      this.renderer2.setAttribute(div,'class','tarjeta card__info');
      
      this.renderer2.appendChild(this.cards.nativeElement, div);

    }
  }

  limpiaCliente(){
    this.nombreCliente.nativeElement.value = '';
    this.emailCliente.nativeElement.value = '';
  }

  addCliente(){
    //Comprobación de nombre y email del cliente
    if(this.nombreCliente.nativeElement.value !== '' && this.emailCliente.nativeElement.value !== ''){
      if(!( /(.+)@(.+){2,}\.(.+){2,}/.test(this.emailCliente.nativeElement.value))){
        const errtext = 'El campo E-mail no es válido.';
        Swal.fire({icon: 'error', title: 'Error', text: errtext});
        this.limpiaCliente();
        return;
      }
      this.arrayC = [this.nombreCliente.nativeElement.value,this.emailCliente.nativeElement.value];
      // console.log('introduzco datos',this.arrayC);
      this.arrayClientes.push(this.arrayC);
    }else{
      const errtext = 'No se puede añadir cliente al proyecto, es necesario Nombre y E-mail.';
      Swal.fire({icon: 'error', title: 'Error', text: errtext});
      this.limpiaCliente();
      return;
    }
    const div = this.renderer2.createElement('div');
    const span = this.renderer2.createElement('span');
    const email = this.renderer2.createElement('p');
    const nombre = this.renderer2.createElement('p');

    const nombreC = this.renderer2.createText(this.nombreCliente.nativeElement.value);
    const emailC = this.renderer2.createText("("+this.emailCliente.nativeElement.value+")");

    this.renderer2.appendChild(nombre,nombreC);
    this.renderer2.appendChild(email,emailC);
    this.renderer2.appendChild(span,nombre);
    this.renderer2.appendChild(span,email);

    this.renderer2.appendChild(div, nombre);
    this.renderer2.appendChild(div, email);
    this.renderer2.setAttribute(nombre,'class','campo');
    this.renderer2.setAttribute(email,'class','campo');
    this.renderer2.setAttribute(email, 'style','color:#6c9491;');
    this.nombreCliente.nativeElement.value = '';
    this.emailCliente.nativeElement.value = '';

    //añado cruz en los tags, para eliminar
    // const span2 = this.renderer2.createElement('span');
    const contenido2 = this.renderer2.createText('\u2715');
    this.renderer2.appendChild(span, contenido2);

    let palabraBorrada; 
    palabraBorrada = email.innerHTML;
    // this.renderer2.appendChild(span, span2);
    this.renderer2.setAttribute(span,'class','col etiqueta');
    this.renderer2.setAttribute(div,'style', 'divCliente');
    this.renderer2.appendChild(this.campoClientes.nativeElement, div);
    this.renderer2.appendChild(this.campoClientes.nativeElement, span);

    //elimino el tag y la palabra del array si pulsa la cruz
    this.renderer2.listen(span, 'click', () =>{
      // console.log(palabraBorrada);
      this.renderer2.removeChild(this.campoClientes.nativeElement, span);
      this.renderer2.removeChild(this.campoClientes.nativeElement, div);
      this.arrayClientes.forEach((element,index)=>{
        // console.log('Element'+element);
        let emailElement = '('+element[1]+')';
        if(emailElement === palabraBorrada){
          this.arrayClientes.splice(index, 1);
          // console.log("lo he borrado");
          // console.log(this.arrayClientes)
          // for(let elemento in this.arrayClientes){
          //   console.log('elemento de arrayClientes', this.arrayClientes[elemento]);
          // }
        }
     });
    });

    for(let elemento in this.arrayClientes){
      //console.log('elemento de arrayClientes', this.arrayClientes[elemento]);
    }
  }

  // asyncAction(palabra: string) {
  //   var promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       this.arrayClientes.forEach((element,index)=>{
  //         if(element === palabra){
  //           this.arrayClientes.splice(index, 1);
  //           // console.log("lo he borrado");
  //         }
  //       });
  //       reject('Rejected!');
  //     }, 1500);
  //   });
  //   return promise;
  // }

  cargarProyectosCliente(){
    let array = [];

    for(let entry of this.listaProyectos){
      if(entry.creador == this.usuarioService.uid){
        array.push(entry);
      }
    }
    // console.log('proyectos cliente',array);
    this.listaProyectos = array;
  }

  // GET
  async cargarProyectos(textoBuscar: string){
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.projectService.cargarProyectosUsuario(this.posicionactual,this.usuarioService.uid,textoBuscar, this.tipo, this.orden)
    .subscribe( res => {
      // console.log('Datos',res);
      if (res['proyectos'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarProyectos(this.ultimaBusqueda);
        } else {
          this.listaProyectos = [];
          this.totalproyectos = 0;
        }
      } else {
        this.listaProyectos = res['proyectos'];
        this.totalproyectos = res['page'].total;
      }
      this.loading = false;
      // this.cargarProyectosCliente();
      this.cargarTarjetas();
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
    });
  }

  onSubmit(accion: string){
    if(accion === 'Crear'){
      this.crearProyecto();
    }
    else if(accion === 'Editar'){
      this.actualizarProyecto();
    }
  }

  actualizarProyecto(){
    this.datosForm.get('fecha').setValue(new Date());

    if(this.arrayModificado.length > 5 || this.arrayClientes.length > 5 ||
      (this.arrayModificado.length+this.arrayClientes.length) > 5 ){
      //console.log(this.arrayClientes);
      const errtext = 'Sólo puede haber un máximo de 5 clientes por proyecto.';
        Swal.fire({icon: 'error', title: 'Error', text: errtext});
        return;
    }

    for(const entry of this.arrayClientes){
      this.arrayModificado.push(entry);
    }
    this.datosForm.get('clientes').setValue(this.arrayModificado);

    this.formSubmit = true;

    if(!this.datosForm.valid){
      console.warn('error, faltan campos');
    }

    this.projectService.editProject(this.uid, this.datosForm.value)
    .subscribe( res => {
      Swal.fire({
        title: 'Proyecto '+res['resultado'].titulo,
        text: 'Proyecto modificado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
      this.datosForm.markAsPristine();
      this.cargarProyectos(this.ultimaBusqueda);
      this.offModal1();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  duplicarProyecto(datos){
    this.datosForm.get('titulo').setValue(datos['titulo']);
    this.datosForm.get('descripcion').setValue(datos['descripcion']);
    this.datosForm.get('notas').setValue(datos['notas']);
    this.datosForm.get('creador').setValue(datos['creador']);
    this.datosForm.get('nombre_creador').setValue(datos['nombre_creador']);
    this.datosForm.get('comentarios').setValue(datos['comentarios']);
    this.datosForm.get('notificaciones').setValue(datos['notificaciones']);
    this.datosForm.get('estado').setValue(datos['estado']);
    this.datosForm.get('n_muebles').setValue(datos['n_muebles']);
    this.datosForm.get('imagen').setValue(datos['imagen']);
    this.datosForm.get('clientes').setValue(datos['clientes']);
    this.datosForm.get('fecha').setValue(new Date());
    this.datosForm.get('fechaC').setValue(new Date());
    this.projectService.postProject(this.datosForm.value)
    .subscribe(res => {
      // console.log('proyecto duplicado',this.datosForm.value);
      this.offModal1();
      this.listaProyectos.push(this.datosForm.value);
      this.numProyectos++;
      this.usuario.numProjects++;
      this.editarUsuario();
      this.cargarProyectos(this.ultimaBusqueda);
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  // actualizarListaProytecto(){
  //   this.projectService.getProject(this.uid)
  //     .subscribe( res => {
  //       //console.log('res', res);
  //       let proyectos = this.listaProyectos;
  //       this.listaProyectos = [];
  //       this.listaProyectos.push(res['proyecto']);
  //       for (let a  = 0; a < proyectos.length; a++){
  //         if(proyectos[a].uid != this.uid ){
  //           this.listaProyectos.push(proyectos[a]);
  //         }
  //       }
  //       this.cargarTarjetas();
  //     }, (err) => {
  //       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //       Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
  //       return;
  //       // console.warn('Error respuesta api');
  //     });
  // }

  crearProyecto(){
    if(this.listaProyectos.length+1 > this.numPTotal && (this.usuarioService.plan == 'PREMIUM-MENSUAL' || this.usuarioService.plan == 'PREMIUM-ANUAL')){
      const errtext ='Has alcanzado el máximo de proyectos disponibles con tu plan.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    }

    if(this.arrayClientes.length > 5){
      //console.log(this.arrayClientes);
      const errtext = 'Sólo puede haber un máximo de 5 clientes por proyecto.';
        Swal.fire({icon: 'error', title: 'Error', text: errtext});
        return;
    }

    this.datosForm.get('clientes').setValue(this.arrayClientes);
    this.datosForm.get('fecha').setValue(new Date());
    this.datosForm.get('fechaC').setValue(new Date());
    let array = [];
    this.datosForm.get('comentarios').setValue(array);
    this.datosForm.get('notificaciones').setValue(array);
    this.datosForm.get('creador').setValue(this.usuarioService.uid);
    this.datosForm.get('estado').setValue('En desarrollo');
    let imagen = '';
    this.datosForm.get('notas').setValue(imagen);
    this.datosForm.get('imagen').setValue(imagen);
    this.formSubmit = true;
    // console.log("datos"+this.datosForm);
    if(!this.datosForm.valid){
      console.warn('error, faltan campos');
    }

    //console.log('voy a enviar esto', this.datosForm.value);
    this.projectService.postProject(this.datosForm.value)
    .subscribe(res => {
      //console.log('creacion proyecto',res);
      //console.log(res['proyecto']['uid']);
      this.offModal1();
      this.numProyectos++;
      this.usuario.numProjects++;
      this.editarUsuario();
      this.cargarProyectos(this.ultimaBusqueda);
      Swal.fire({
        text: `Proyecto creado correctamente`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {  
          if (result.value) {
            this.router.navigateByUrl(`/home?proyecto=${res['proyecto']['uid']}`);
          }
      });
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  campoValido(campo: string){
    return this.datosForm.get(campo).valid || !this.formSubmit;
  }
  campoNoValido( campo: string ) {
    return this.datosForm.get(campo).invalid && this.formSubmit;
  }

  onModal(){
    this.datosForm.reset();
    this.campoClientes.nativeElement.innerHTML = '';
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
    this.datosForm.get('n_muebles').setValue(0);
    if(this.botonAceptar.nativeElement.style.display == 'block'){
      this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','none');
    }
    if(this.botonCrear.nativeElement.style.display == 'none'){
      this.renderer2.setStyle(this.botonCrear.nativeElement,'display','block');
    }

  }

  offModal1(){
    //Para quitar el formulario nuevo catalogo
    this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
    this.datosForm.reset();
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarProyectos(this.ultimaBusqueda);;
  }

  atras(){
    this.router.navigateByUrl(`/home?proyecto=${this.uidProyecto}`);
  }

  gestorProyectos(){
    this.router.navigateByUrl(`/gestor-proyectos?proyecto=${this.uidProyecto}`);
  }
  gestorCatalogos(){
    this.router.navigateByUrl(`/gestor-catalogos?proyecto=${this.uidProyecto}`);
  }

}
