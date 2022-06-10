import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../services/project.service'
import { Project } from '../../../models/project.model';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  
  switchModal: boolean = false;
  projects: any;
  inicio: any;
  fin: any;
  fIni: any;
  fFin: any;
  orden = 'Descendente';
  tipo = 'fecha';
  arrayC: string[] = [];
  arrayClientes: string[][] = [];
  arrayModificado: string[][] = [];


  //VARIABLES BUSQUEDA
  public ultimaBusqueda = '';
  public loading = true;
  public totalproyectos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  modal1: boolean;
  modal2: boolean;
  uid: string;
  public listaProyectos: Project[] = [];

  public formSubmit = false;

  constructor(private renderer2: Renderer2,
              private projectService: ProjectService,
              private usuarioService: UsuarioService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cargarProyectos(this.ultimaBusqueda);
  }

  @ViewChild('ordenacion') ordenacion: ElementRef;
  @ViewChild('fechaIni') fechaIni: ElementRef;
  @ViewChild('fechaFin') fechaFin: ElementRef;
  @ViewChild('nombreCliente') nombreCliente: ElementRef;
  @ViewChild('emailCliente') emailCliente: ElementRef;
  @ViewChild('campoClientes') campoClientes: ElementRef;
  @ViewChild('botonCrear') botonCrear: ElementRef;
  @ViewChild('botonAceptar') botonAceptar: ElementRef;
  @ViewChild('titulo') titulo: ElementRef;
  @ViewChild('modulo') modulo: ElementRef;

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

  cargarClientes(array, array2){
    //console.log(array);
    // console.log('arrayColoresModificado', array2);
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
      this.renderer2.setAttribute(email, 'style','color:#6c9491;');
      // this.renderer2.setAttribute(email, 'style','color:#6c9491;');
      this.limpiaCliente();

      //añado cruz en los tags, para eliminar
      const span2 = this.renderer2.createElement('span');
      const contenido2 = this.renderer2.createText('\u2715');
      this.renderer2.appendChild(span, contenido2);

      let palabraBorrada;
      palabraBorrada = entry[1];

      // this.renderer2.appendChild(span, span2);
      this.renderer2.setAttribute(span,'class','col etiqueta');
      // this.renderer2.setAttribute(span,'style', 'cursor: pointer; padding-top: 10px;');
      this.renderer2.setAttribute(div,'class','divCliente');
      this.renderer2.appendChild(this.campoClientes.nativeElement, div);
      this.renderer2.appendChild(this.campoClientes.nativeElement, span);

      //elimino el tag y la palabra del array si pulsa la cruz
      this.renderer2.listen(span, 'click', () =>{
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
            //console.log("lo he borrado");
          }
        });
      // console.log('resultado', array2);
      });
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
    // console.log('arrayClientes',this.arrayClientes);
    const div = this.renderer2.createElement('div');
    const span = this.renderer2.createElement('span');
    const email = this.renderer2.createElement('p');
    const nombre = this.renderer2.createElement('p');

    const nombreC = this.renderer2.createText(this.nombreCliente.nativeElement.value);
    const emailC = this.renderer2.createText(this.emailCliente.nativeElement.value);

    this.renderer2.appendChild(nombre,nombreC);
    this.renderer2.appendChild(email,emailC);
    this.renderer2.appendChild(span,nombre);
    this.renderer2.appendChild(span,email);

    this.renderer2.appendChild(div, nombre);
    this.renderer2.appendChild(div, email);
    this.renderer2.setAttribute(nombre,'class','campo');
    this.renderer2.setAttribute(email,'class','campo');
    this.renderer2.setAttribute(email, 'style','color:#6c9491;');
    this.limpiaCliente();

    //añado cruz en los tags, para eliminar
    // const span2 = this.renderer2.createElement('span');
    const contenido2 = this.renderer2.createText('\u2715');
    this.renderer2.appendChild(span, contenido2);

    let palabraBorrada; 
    palabraBorrada = email.innerHTML;
    // this.renderer2.appendChild(span, span2);
    this.renderer2.setAttribute(span,'class','col etiqueta');
    this.renderer2.setAttribute(div,'class','divCliente');
    this.renderer2.appendChild(this.campoClientes.nativeElement, div);
    this.renderer2.appendChild(this.campoClientes.nativeElement, span);

    //elimino el tag y la palabra del array si pulsa la cruz
    this.renderer2.listen(span, 'click', () =>{
      // console.log(palabraBorrada);
      this.renderer2.removeChild(this.campoClientes.nativeElement, span);
      this.renderer2.removeChild(this.campoClientes.nativeElement, div);
      // console.log(this.arrayClientes);
      this.arrayClientes.forEach((element,index)=>{
        // console.log(element);
        // console.log(element[1]);
        if(element[1] === palabraBorrada){
          this.arrayClientes.splice(index, 1);
          // console.log("lo he borradooooooooo");
          // console.log(this.arrayClientes)
          // for(let elemento in this.arrayClientes){
          //   console.log('elemento de arrayClientes', this.arrayClientes[elemento]);
          // }
        }
      });
    });
  }


  borrarFechas(textoBuscar: string){
    this.inicio = '';
    this.fin = '';
    this.fIni = '';
    this.fFin = '';
    this.cargarProyectos(textoBuscar);
  }

  convertFechaMongo(fecha: string, tipo: string){
    // console.log(fecha);
    let f = fecha.split("-");
    let date = new Date(f[0]+"-"+f[1]+"-"+f[2]);
    if(tipo == 'fin'){
      date.setHours(24);
      date.setMinutes(59);
      date.setSeconds(59);
      date.setMilliseconds(999);
    }
    return date.toISOString()
  }

  cargoPrF(textoBuscar: string){
    this.inicio = this.fechaIni.nativeElement.value;
    this.fin = this.fechaFin.nativeElement.value;
    this.fIni = this.convertFechaMongo(this.fechaIni.nativeElement.value, 'inicio');
    this.fFin = this.convertFechaMongo(this.fechaFin.nativeElement.value, 'fin');
    // console.log(this.fIni, this.fFin);
    this.cargarProyectos(textoBuscar);
  }

  ordenar(tipo: string, orden: string){
    this.tipo = tipo;
    this.orden = orden;
    this.cargarProyectos(this.ultimaBusqueda);
  }

  // GET
  cargarProyectos(textoBuscar: string){
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.projectService.cargarProyectos(this.posicionactual, textoBuscar, this.tipo, this.orden, this.fIni, this.fFin)
    .subscribe( res => {
      // console.log('Entra en la función de cargarProyectos')
      // console.log(res);
      // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
      // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede
      if (res['proyectos'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarProyectos(this.ultimaBusqueda);
        } else {
          this.listaProyectos = [];
          this.totalproyectos = 0;
          Swal.fire({icon: 'warning', title: 'Oops...', text: 'No se han encontrado resultados en la BBDD'});
        }
      } else {
        let nombres = [];
        this.listaProyectos = JSON.parse(JSON.stringify(res['proyectos']));
        this.totalproyectos = res['page'].total;
        for(let entry of this.listaProyectos){
          nombres = [];
          for(let i of entry.clientes){
            nombres.push(i[0]);
          }
          entry.clientes = nombres;
        }
      }
      this.loading = false;
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
    });
  }

  // EDITAR PROYECTOS
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
    });
  }

  // DELETE (modal)
  eliminarProyecto (id: string, titulo: string):void {
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
               this.cargarProyectos(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
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

  crearProyecto(){
    //console.log(this.arrayModificado);
    //console.log(this.arrayClientes);
    if(this.arrayModificado.length > 5 || this.arrayClientes.length > 5 ||
      (this.arrayModificado.length+this.arrayClientes.length) > 5 ){
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
    // this.datosForm.get('notas').setValue();
    this.datosForm.get('imagen').setValue(imagen);
    this.formSubmit = true;
    // console.log("datos"+this.datosForm);
    if(!this.datosForm.valid){
      console.warn('Error, faltan campos');
    }
    // console.log('voy a enviar esto', this.datosForm.value);
    this.projectService.postProject(this.datosForm.value)
    .subscribe(res => {
      //console.log('creacion proyecto',res);
      //console.log(res['proyecto']['uid']);
      Swal.fire({
        title: 'Proyecto registrado',
        text: 'Proyecto creado correctamente',
        icon: 'success',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
      this.cargarProyectos(this.ultimaBusqueda);
      this.offModal1();
    }, (err) => {
      console.warn('Error respuesta api');
    });
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

  onModal(){
    this.switchModal = true;
  }

  offModal(){
    this.switchModal = false;
  }

  onModal1(){
    if(this.titulo.nativeElement.innerHTML === 'Editar Proyecto'){
      this.titulo.nativeElement.innerHTML = 'Nuevo Proyecto';
    }
    this.modal1 = true;
    this.datosForm.reset();
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
    this.campoClientes.nativeElement.innerHTML = '';
    if(this.botonAceptar.nativeElement.style.display === 'block'){
      this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','none');
    }
    if(this.botonCrear.nativeElement.style.display === 'none'){
      this.renderer2.setStyle(this.botonCrear.nativeElement,'display','block');
    }

  }
  offModal1(){
    this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
  }
  onModal2(uid:string){
    this.arrayModificado = [];
    this.arrayClientes = [];
    this.campoClientes.nativeElement.innerHTML = '';
    this.titulo.nativeElement.innerHTML = 'Editar Proyecto';
    this.datosForm.reset();
    this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','block');
    this.renderer2.setStyle(this.botonCrear.nativeElement,'display','none');
    this.uid = uid;
    this.formEditarProyecto();
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');

  }

  campoValido(campo: string){
    return this.datosForm.get(campo).valid || !this.formSubmit;
  }

  campoNoValido( campo: string ) {
    return this.datosForm.get(campo).invalid && this.formSubmit;
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarProyectos(this.ultimaBusqueda);
  }
}
