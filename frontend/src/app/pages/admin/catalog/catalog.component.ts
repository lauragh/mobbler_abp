import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from 'src/app/services/catalog.service';
import { environment } from '../../../../environments/environment';
import { catalogForm } from '../../../interfaces/catalog-form.interface';
import Swal from 'sweetalert2';
import { Catalogo } from '../../../models/catalogo.model';

@Component({
  selector: 'app-models',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  catalogo : catalogForm[];
  paginacionT: string;
  switchModal: boolean;
  modal2: boolean;
  arrayTags: string[] = [];
  arrayModificado: string[] = [];
  formCargado: catalogForm[];
  uid: string;
  modal1: boolean;
  inicio: any;
  fin: any;
  fIni: any;
  fFin: any;
  orden = 'Descendente';
  tipo = 'fecha';

  public ultimaBusqueda = '';
  public loading = true;
  public totalcatalogos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaCatalogos: Catalogo[] = [];
  public formSubmit = false;

  ngOnInit(): void {
    this.cargarCatalogos(this.ultimaBusqueda);
  }

  @ViewChild('ordenacion') ordenacion: ElementRef;
  @ViewChild('fechaIni') fechaIni: ElementRef;
  @ViewChild('fechaFin') fechaFin: ElementRef;


  public catalogForm = this.fb.group({
    //con corchetes si son varias condiciones
    // id_modelo: ['' , []],
    nombre: ['', Validators.required],
    num_modelos: ['', Validators.required],
    fabricante: ['', Validators.required],
    precio: ['', Validators.required,],
    img: ['', Validators.required],
    fecha: ['']
  })
  
  constructor(private renderer2: Renderer2,
    private fb: FormBuilder,
    private catalogService: CatalogService){}

  borrarFechas(texto: string){
    this.inicio = '';
    this.fin = '';
    this.fIni = '';
    this.fFin = '';
    this.cargarCatalogos(texto);
  }

  convertFechaMongo(fecha: string, tipo: string){
    // // //console.log(fecha);
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
  
  cargoCF(){
    this.inicio = this.fechaIni.nativeElement.value;
    this.fin = this.fechaFin.nativeElement.value;
    this.fIni = this.convertFechaMongo(this.fechaIni.nativeElement.value, 'inicio');
    this.fFin = this.convertFechaMongo(this.fechaFin.nativeElement.value, 'fin');
    // //console.log(this.fIni, this.fFin);
    this.cargarCatalogos(this.ultimaBusqueda);
  }

  ordenar(tipo: string, orden: string){
    this.tipo = tipo;
    this.orden = orden;
    this.cargarCatalogos(this.ultimaBusqueda);
  }

 // CARGAR CATALOGOS
  cargarCatalogos(texto: string){
    this.ultimaBusqueda = texto;
    // //console.log('Esta es la busqueda: ', this.ultimaBusqueda);
    this.catalogService.cargarCatalogos( this.posicionactual, this.ultimaBusqueda, this.tipo, this.orden, this.fIni, this.fFin)
    .subscribe( res =>
    {
      // //console.log(res);
      // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
      // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede
      if (res['page']['catalogos'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { 
            this.posicionactual = 0
          };
          this.cargarCatalogos(this.ultimaBusqueda);
        } else {
          this.listaCatalogos = [];
          this.totalcatalogos = 0;
          Swal.fire({icon: 'warning', title: 'Oops...', text: 'No se han encontrado resultados respecto en la BBDD'});
        }
      } else {
        this.listaCatalogos = res['page']['catalogos'];
        // //console.log('Lista de catalogos: ');
        // //console.log(this.listaCatalogos);
        this.totalcatalogos = res['page'].total;
        // //console.log(this.totalcatalogos);
      }
      this.loading = false;
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
  });
  }
    //ELIMINAR CATALOGOS
    eliminarCatalogo( uid: string, nombre: string) {
      // Solo los admin pueden borrar usuarios
      // if (this.usuarioService.rol !== 'ROL_ADMIN') {
      //   Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      //   return;
      // }
      
      Swal.fire({
        title: 'Eliminar Catalogo',
        text: `Al eliminar el catalogo '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'Cancelar',
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
          // //console.log("El uid es " + uid)
            if (result.value) {
  
              this.catalogService.eliminarCatalogo(uid)
                .subscribe( resp => {
                  this.cargarCatalogos(this.ultimaBusqueda);
                }
                ,(err) =>{
                  Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                })
            }
      });
    }
// 
  actualizarFormulario():void {
    // HACER PARA UN CATALOGO INDIVIDUAL
    // //console.log(this.uid)
    this.catalogService.cargarCatalogo(this.uid)
    
    .subscribe( res =>
      {
        // //console.log(res);
        this.catalogForm.get('nombre').setValue(res['catalog'].nombre);
        this.catalogForm.get('num_modelos').setValue(res['catalog'].num_modelos);
        this.catalogForm.get('fabricante').setValue(res['catalog'].fabricante);
        this.catalogForm.get('precio').setValue(res['catalog'].precio);
        this.catalogForm.get('img').setValue(res['catalog'].img);
        //let span, contenido, span2, contenido2, palabraBorrada;

        // //console.log('elemento', this.arrayModificado[elemento]);
        // }
    });

  }
 
  actualizarCatalogo(){
    this.formSubmit = true;
    // //console.log(this.catalogForm);
    if(!this.catalogForm.valid){
      console.warn('error, faltan campos');
    }
    
    this.catalogForm.get('fecha').setValue(new Date());

    this.catalogService.actualizarCatalogo(  this.uid, this.catalogForm.value)
    .subscribe( res => {
       // //console.log('res', res);
      this.catalogForm.markAsPristine();
      this.catalogService.cargarCatalogo(this.uid);
      this.ngOnInit();
      this.offModal2();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
      // console.warn('Error respuesta api');

    });
    
  }

  onModal(){
    this.switchModal = true;
  }

  onModal1(){
    // para ver formulario de catalogo
    this.modal1 = true;
    this.catalogForm.reset();
    this.catalogForm.get('num_modelos').setValue(0);

  }
  offModal1(){
    //Para quitar el formulario nuevo catalogo
    this.modal1 = false;
    this.catalogForm.reset();
  }
  onModal2(uid:string){
    // para ver formulario de catalogo
    this.modal2 = true;
    this.uid = uid;
    this.actualizarFormulario();

  }
  offModal2(){
    //Para quitar el formulario nuevo catalogo
    this.modal2 = false;
    
  }

  offModal(){
    this.switchModal = false;
  }


  onSubmit(accion: string){
    if(accion === 'Crear'){
      this.crearCatalogo();
    }
    else if(accion === 'Editar'){
      this.actualizarCatalogo();
    }
  }

  crearCatalogo(){
    this.formSubmit = true;
    
    this.catalogForm.get('fecha').setValue(new Date());

    // //console.log("hOLA"+this.catalogForm);
    if(!this.catalogForm.valid){
      console.warn('error, faltan campos');
    }

    this.catalogService.addCatalog(this.catalogForm.value)
    .subscribe(res => {
      // //console.log('Respuesta al crear catalogo:', res);
      this.cargarCatalogos(this.ultimaBusqueda);
      this.offModal1();

    }, (err) => {
      console.warn('Error respuesta api');
    });
  }

  campoValido(campo: string){
    return this.catalogForm.get(campo).valid || !this.formSubmit;
  }

  campoNoValido( campo: string ) {
    return this.catalogForm.get(campo).invalid && this.formSubmit;
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarCatalogos(this.ultimaBusqueda);
  }


  
 

}


