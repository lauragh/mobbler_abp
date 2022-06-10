import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { UsuarioService } from '../../services/usuario.service';
import { ModeloService } from '../../services/modelo.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Model } from '../../models/models.model';
import {Router} from '@angular/router';

import { FormBuilder, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { Catalogo } from '../../models/catalogo.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gestor-catalogos',
  templateUrl: './gestor-catalogos.component.html',
  styleUrls: ['./gestor-catalogos.component.scss']
})
export class GestorCatalogosComponent implements OnInit {
  orden: string;
  tipo: string;
  fin: any;
  fIni: any;
  fFin: any;
  uid: string;
  numCatalogos: number;
  numCTotal: any;
  uidProyecto: String;

  arrayCatalogos: string[] = []; // lista de catalogos del usuario
  public ultimaBusqueda = '';
  public totalcatalogos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaCatalogos: Catalogo[] = [];
  public listaCatalogosordenada: Catalogo[] = [];
  public formSubmit = false;
  public anyadeCatalogo: Catalogo;
  listaModelos: Model[] =[];
  public cantCatalogos: number;

  @ViewChild('cards') cards: ElementRef;
  @ViewChild('ordenCampo') ordenCampo: ElementRef;
  @ViewChild('modulo') modulo: ElementRef;
  @ViewChild('nombreCliente') nombreCliente: ElementRef;
  @ViewChild('emailCliente') emailCliente: ElementRef;
  @ViewChild('campoClientes') campoClientes: ElementRef;
  @ViewChild('botonCrear') botonCrear: ElementRef;
  @ViewChild('botonAceptar') botonAceptar: ElementRef;
  @ViewChild('titulo') titulo: ElementRef;

  public datosForm = this.fb.group({
    company: ['', Validators.required ],
    email: [ '', [Validators.required, Validators.email] ],
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    nif: ['', Validators.required ],
    direccion: ['', Validators.required ],
    telefono: ['', Validators.required ],
    imagen: [''],
    plan:['']
  });

  constructor(
      private router: Router,
      private usuarioService: UsuarioService,
      private catalogService: CatalogService,
      private modeloService: ModeloService,
      private route: ActivatedRoute,
      private renderer2: Renderer2,
      private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      // console.log(params); 
      this.uidProyecto = params.proyecto || "";
      //console.log('El proyecto es : '+ this.uidProyecto);
    });
    this.cargarCatalogos(this.ultimaBusqueda);
    this.cargarUsuario();
    this.cargarDisponibilidad();
    
  }

  pestanya(elemento){
    this.renderer2.setStyle(elemento,'display','block');
  }

// cargamos las tarjetas de catalogos
  cargarTarjetas( primero: boolean ){
   // si primero es true pinta el primero sin el
    this.cards.nativeElement.innerHTML = '';
    // console.log(this.cards.nativeElement.innerHTML);
    let a = 0;
    for(let entry of this.listaCatalogos){
      const div = this.renderer2.createElement('div');
      const div2 = this.renderer2.createElement('div');
      const img = this.renderer2.createElement('img');
      const titulo = this.renderer2.createElement('h4');
      const img2 = this.renderer2.createElement('img');
      const contenido = this.renderer2.createText(entry.nombre);
      const mas = this.renderer2.createElement('p');
      const mas2 = this.renderer2.createText('+');
      const div4 = this.renderer2.createElement('div');


      // Creación opciones
      const div3 = this.renderer2.createElement('div');
  
      this.renderer2.setAttribute(div3, "style", "width: max-content; float:right; display:none");

     
      //Imagen portada
      if(entry.imagen){
        this.renderer2.setAttribute(img, "src", "assets/img/catalogos/"+entry.imagen);
        }
      else{
        this.renderer2.setAttribute(img, "src", "assets/img/noimage.jpg");
      
      }
      this.renderer2.setAttribute(img, "style", "width: 350px; height:250px");
      this.renderer2.setAttribute(img, "class", "img-catalogo");
      this.renderer2.listen(img, "click", event => {
        
        this.onModal(entry.models);
      });
      this.renderer2.appendChild(div,img);
      //titulo
      this.renderer2.appendChild(titulo,contenido);
      this.renderer2.setAttribute(titulo, "class", "colorLetraOscura");
      this.renderer2.appendChild(div2,titulo);
      // si no tiene el catalogo muestra el mas para añadir
      if(!this.usuarioService.catalogos.includes(entry.uid) && primero != false){
      
      this.renderer2.appendChild(mas,mas2);
      this.renderer2.setAttribute(mas, "class", "colorLetraOscura text-left float-right pointer");
      this.renderer2.setStyle(mas, "style","float: right; ");
      this.renderer2.listen(mas, "click", event => {
        this.anyadir_catalogo(entry.uid);
       
      });
        this.renderer2.appendChild(div4,mas);
      }
      primero = true;

      this.renderer2.setAttribute(div2, "style","padding: 10px; width: 350px text-align: left display: flex");
      this.renderer2.setAttribute(div4, "style","padding: 10px; width: 350px; text-align: right; font-size: xxx-large;");
      
      this.renderer2.appendChild(div,div4);
      this.renderer2.appendChild(div,div2);
      

      this.renderer2.setAttribute(div,'class','tarjeta');
      this.renderer2.appendChild(this.cards.nativeElement, div);
  
    }
  }

  ordenar(){
    if(this.ordenCampo.nativeElement.value == 'nombreA'){
      this.tipo = 'nombre';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'nombreD'){
      this.tipo = 'nombre';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'fabricanteA'){
      this.tipo = 'fabricante';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'fabricanteD'){
      this.tipo = 'fabricante';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'n_modelosA'){
      this.tipo = 'num_modelos';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'n_modelosD'){
      this.tipo = 'num_modelos';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'precioA'){
      this.tipo = 'precio';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'precioD'){
      this.tipo = 'precio';
      this.orden = 'Descendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'fechaA'){
      this.tipo = 'fecha';
      this.orden = 'Ascendente';
    }
    else if(this.ordenCampo.nativeElement.value == 'fechaD'){
      this.tipo = 'fecha';
      this.orden = 'Descendente';
    }
    this.cargarCatalogos(this.ultimaBusqueda);
  }

  cargarCatalogos(texto: string){
    this.ultimaBusqueda = texto;
    if(this.tipo == ''){this.tipo ='nombre';}
    this.catalogService.cargarCatalogosusu( this.posicionactual, this.ultimaBusqueda, this.tipo, this.orden,this.usuarioService.uid)
    .subscribe( res =>
    {
      // console.log(res);
      // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
      // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede
      if (res['page']['catalogos'].length == 0) {
         
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarCatalogos(this.ultimaBusqueda);
        } else {
          this.listaCatalogos = [];
          this.totalcatalogos = 0;
        }
      } else {
        this.listaCatalogos = res['page']['catalogos'];
        // console.log('Lista de catalogos: ');
        // console.log(this.listaCatalogos);
        this.totalcatalogos = res['page'].total;
        // console.log(this.totalcatalogos);
        this.listaCatalogosordenada = [];
        for (let i = 0; i < this.listaCatalogos.length; i++){
          if(this.usuarioService.catalogos.includes(this.listaCatalogos[i].uid)){
            this.listaCatalogosordenada.push(this.listaCatalogos[i]);
          }
        }
        for (let i = 0; i < this.listaCatalogos.length; i++){
          if(!this.usuarioService.catalogos.includes(this.listaCatalogos[i].uid)){
            this.listaCatalogosordenada.push(this.listaCatalogos[i]);
          }
        }
        this.listaCatalogos = this.listaCatalogosordenada;
        this.cargarTarjetas(true);
      }
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
  });
  }

  cargarUsuario():void {
    // console.log("El usuario service es" + this.usuarioService.uid);
    this.datosForm.get('nombre').setValue(this.usuarioService.nombre);
    this.datosForm.get('apellidos').setValue(this.usuarioService.apellidos);
    this.datosForm.get('email').setValue(this.usuarioService.email);
    this.datosForm.get('company').setValue(this.usuarioService.company);
    this.usuarioService.cargarUsuario(this.usuarioService.uid)
      .subscribe( res => {
        // console.log(res);
        this.datosForm.get('nif').setValue(res['clientes']['nif']);
        this.datosForm.get('direccion').setValue(res['clientes']['direccion']);
        this.datosForm.get('telefono').setValue(res['clientes']['telefono']);
        this.datosForm.get('plan').setValue( res['clientes']['plan']);
        // le damos el valor de los catalogos que ya tiene
        for(let i = 0 ; i < res['clientes']['catalogos'].length ; i++){
        this.arrayCatalogos.push( res['clientes']['catalogos'][i]);
      }
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo cargar la imagen';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  anyadir_catalogo(uid: string){
    const uid_catalogo = uid;
    if(this.numCatalogos+1 > this.numCTotal){
      const errtext ='Has alcanzado el máximo de catálogos disponibles con tu plan.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    }
    else{
      this.usuarioService.anyadirCatalogos(uid_catalogo, this.usuarioService.uid)
      .subscribe( res => {
        // console.log('res', res);
        Swal.fire('Se ha añadido el catalogo')
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
      this.numCatalogos++;
      this.catalogService.cargarCatalogo(uid_catalogo)
      .subscribe( res => {
        //console.log('res', res);
        let catalogos_1 = this.listaCatalogos;
        this.listaCatalogos = [];
        this.listaCatalogos.push(res['catalog']);
        for (let a  = 0; a < catalogos_1.length; a++){
          if(catalogos_1[a].uid != uid_catalogo ){
            this.listaCatalogos.push(catalogos_1[a]);
          }
        }
        this.cargarTarjetas(false);
  }, (err) => {
    const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
    Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    return;
    // console.warn('Error respuesta api');
  });
    }
  }

  cargarDisponibilidad(){
    if(this.usuarioService.plan == 'GRATUITO'){
      this.numCTotal = 1;
    }
    else if(this.usuarioService.plan == 'BASICO-MENSUAL' || this.usuarioService.plan == 'BASICO-ANUAL'){
      this.numCTotal = 8;
    }
    else if(this.usuarioService.plan == 'PREMIUM-MENSUAL' || this.usuarioService.plan == 'PREMIUM-ANUAL'){
      this.numCTotal = 30;
    }
    this.numCatalogos = this.usuarioService.numCatalog;
  }

  onModal( modelos : string[]){
    //obtenemos los modelos del catalogo que hemos seleccionado
    this.listaModelos =[];
    for (let a =0 ; a < modelos.length; a++){
      this.modeloService.cargarModelo(modelos[a]).subscribe( res => {
        this.listaModelos.push(res['modelo']);
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        console.warn('error:', err);
      });
      }
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
  }

  offModal1(){
    this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarCatalogos(this.ultimaBusqueda);
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
