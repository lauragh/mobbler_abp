import { ifStmt, variable } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModeloService } from 'src/app/services/modelo.service';
import { modeloForm } from '../../../interfaces/modelo-form.interface';
import { catalogForm } from '../../../interfaces/catalog-form.interface';
import { CatalogService } from 'src/app/services/catalog.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  // modelos: modeloForm[];
  paginacionT: string;

  switchModal: boolean;
  switchModal2: boolean;

  arrayTags: string[] = [];
  catalogos: catalogForm[];
  arrayModificado: string[] = [];
  arrayColoresModificado: string[][] = [];
  formCargado: modeloForm[];
  uid: string;
  inicio: any;
  fin: any;
  fIni: any;
  fFin: any;
  orden = 'Descendente';
  tipo = 'fecha';
  arrayColores: string[][] = [];
  arrayC: string[] = [];
  // title: string = '';

  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Control del loading
  public loading = false;
  // Cursos lsitado
  public listaRegistros: modeloForm[] = [];
  // Ultima búsqueda
  public ultimaBusqueda = '';

  ngOnInit(): void {
    this.cargarModelos(this.ultimaBusqueda);
    this.cargarCatalogos();
  }

  @ViewChild('modulo') modulo: ElementRef;
  @ViewChild('botonCrear') botonCrear: ElementRef;
  @ViewChild('botonAceptar') botonAceptar: ElementRef;
  @ViewChild('nombreTag') nombreTag: ElementRef;
  @ViewChild('campoTags') campoTags: ElementRef;
  @ViewChild('titulo') titulo: ElementRef;
  @ViewChild('ordenacion') ordenacion: ElementRef;
  @ViewChild('fechaIni') fechaIni: ElementRef;
  @ViewChild('fechaFin') fechaFin: ElementRef;
  @ViewChild('color') color: ElementRef;
  @ViewChild('nombreColor') nombreColor: ElementRef;
  @ViewChild('campoColores') campoColores: ElementRef;


  public formSubmit = false;
  public modeloForm = this.fb.group({
    //con corchetes si son varias condiciones
    // id_modelo: ['' , []],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    catalogo: ['', Validators.required],
    catalogo_nombre: ['', Validators.required],
    medida_ancho: ['', Validators.required,],
    medida_alto: ['', Validators.required],
    medida_largo: ['', Validators.required],
    tags: [''],
    archivo: ['', Validators.required],
    colores: [''],
    fecha: ['']
  })
  
  constructor(private renderer2: Renderer2,
              private fb: FormBuilder,
              private modeloService: ModeloService,
              private catalogService: CatalogService,
              private usuarioService: UsuarioService){}

  cargarCatalogos(){
    this.catalogService.cargarCatalogos(0,'')
    .subscribe(res =>{
      // console.log('datos',res);
      this.catalogos = res['page']['catalogos'];
      // console.log('catalogos',this.catalogos);
    })
  }

  borrarFechas(texto: string){
    this.inicio = '';
    this.fin = '';
    this.fIni = '';
    this.fFin = '';
    this.cargarModelos(texto);
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

  cargoMF(texto: string){
    // console.log('fechaIni',this.fechaIni.nativeElement.value);
    // console.log('fechaFin',this.fechaFin.nativeElement.value);
    this.inicio = this.fechaIni.nativeElement.value;
    this.fin = this.fechaFin.nativeElement.value;
    this.fIni = this.convertFechaMongo(this.fechaIni.nativeElement.value, 'inicio');
    this.fFin = this.convertFechaMongo(this.fechaFin.nativeElement.value, 'fin');
    this.cargarModelos(texto);
  }

  ordenar(tipo: string, orden: string){
    this.tipo = tipo;
    this.orden = orden;
    this.cargarModelos(this.ultimaBusqueda);
  }


  cargarModelos( texto: string ) {
    this.ultimaBusqueda = texto;
    this.loading = true;
    this.modeloService.cargarModelos(this.registroactual, texto, this.tipo, this.orden, this.fIni, this.fFin)
      .subscribe(res => {
        // console.log('Datos',res);
        if (res['modelos'].length === 0) {
          if (this.registroactual > 0) {
            this.registroactual -= this.registrosporpagina;
            if (this.registroactual < 0) { this.registroactual = 0};
            this.cargarModelos(this.ultimaBusqueda);
          } else {
            this.listaRegistros = [];
            this.totalregistros = 0;
            Swal.fire({icon: 'warning', title: 'Oops...', text: 'No se han encontrado resultados en la BBDD'});
          }
        } else {
          let colorines = [];
          this.listaRegistros = JSON.parse(JSON.stringify(res['modelos']));
          for(let entry of this.listaRegistros){
            colorines = [];
            // console.log('veo',entry.colores);
            for(let i of entry.colores){
              colorines.push(i[1]);
              // console.log('contiene', i[1]);
              // entry.colores.push(i[1]);
            }
            entry.colores = colorines;
          }
          this.totalregistros = res['page'].total;
        }
        this.loading = false;
      }, (err)=> {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
        this.loading = false;
      });
  }

  eliminarModelo (uid: string, nombre: string):void {
    // if (this.usuarioService.rol !== 'ROL_ADMIN') {
    //   Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
    //   return;
    // }

    Swal.fire({
      title: 'Eliminar modelo',
      text: `Al eliminar el modelo '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result) => {
          if (result.value) {
            this.modeloService.borrarModelo(uid)
              .subscribe( res => {
                this.cargarModelos(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }

  cargarTags(array, array2){
    let span, contenido, span2, contenido2;
    // console.log('arrayTagsModificado',array2);
    for(let entry of array){
      array2.push(entry);
      span = this.renderer2.createElement('span');
      contenido = this.renderer2.createText(entry);
      
      //añado cruz en los tags, para eliminar
      span2 = this.renderer2.createElement('span');
      contenido2 = this.renderer2.createText('\u2715');
      this.renderer2.appendChild(span2,contenido2);
      this.renderer2.appendChild(span,contenido);
    
      let palabraBorrada = span.innerHTML;

      this.renderer2.appendChild(span, span2);
      this.renderer2.setAttribute(span,'class','etiqueta');
      this.renderer2.setAttribute(span2,'style', 'cursor: pointer');
      this.renderer2.appendChild(this.campoTags.nativeElement, span);
      
      //elimino el tag y la palabra del array si pulsa la cruz
      this.renderer2.listen(span2, 'click', () =>{
        // console.log('palabraBorrada',palabraBorrada);
        let pos;
        for(let i = 0; i < this.campoTags.nativeElement.childNodes.length; i++){
          if(this.campoTags.nativeElement.childNodes[i].innerHTML.search(palabraBorrada) != -1){
            pos = i;
            // console.log(pos);
          }
        }
        // console.log('QUIERO BORRARRR',palabraBorrada);
        this.renderer2.removeChild(this.campoTags.nativeElement, this.campoTags.nativeElement.childNodes[pos]);
        array2.forEach((element,index)=>{
          if(element == palabraBorrada ){
            array2.splice(index,1);
            // console.log("lo he borrado");
          }
        });
      }); 
    }
  }

  cargarColores(array, array2){
    // console.log(array);
    // console.log('arrayColoresModificado', array2);
    for(let entry of array){
      array2.push(entry);
      const span = this.renderer2.createElement('span');
      const span3 = this.renderer2.createElement('span');
      const contenido = this.renderer2.createText(entry[1]);

      //añado cruz en los tags, para eliminar
      const span2 = this.renderer2.createElement('span');
      const contenido2 = this.renderer2.createText('\u2715');
      let palabraBorrada; 
      this.renderer2.appendChild(span2,contenido2);
      this.renderer2.appendChild(span,span3);
      this.renderer2.appendChild(span,contenido);

      palabraBorrada = entry[1];
      // console.log('palabra que quiero borrar',palabraBorrada);
      this.renderer2.appendChild(span, span2);
      this.renderer2.setAttribute(span,'class','etiqueta');
      this.renderer2.setAttribute(span2,'style', 'cursor: pointer');
      this.renderer2.setAttribute(span3,'class','color');
      this.renderer2.setAttribute(span3,'style', 'background-color:'+entry[0]);
      this.renderer2.appendChild(this.campoColores.nativeElement, span);

      //elimino el tag y la palabra del array si pulsa la cruz
      this.renderer2.listen(span2, 'click', () =>{
        let pos, posi;
        for(let i = 0; i < this.campoColores.nativeElement.childNodes.length; i++){
          if(this.campoColores.nativeElement.childNodes[i].innerHTML.search(palabraBorrada) != -1){
            pos = i;
          }
        }
        this.renderer2.removeChild(this.campoColores.nativeElement, span);
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
    }
  }

  actualizarFormulario(uid: string):void {
    // console.log('Entra función actualizarFormulario')

    this.modeloService.cargarModelo(uid)
    .subscribe( res =>
      {
        this.cargarCatalogos();
        this.modeloForm.get('nombre').setValue(res['modelo'].nombre);
        this.modeloForm.get('descripcion').setValue(res['modelo'].descripcion);
        this.modeloForm.get('catalogo').setValue(res['modelo'].catalogo_nombre);
        this.modeloForm.get('medida_ancho').setValue(res['modelo'].medida_ancho);
        this.modeloForm.get('medida_alto').setValue(res['modelo'].medida_alto);
        this.modeloForm.get('medida_largo').setValue(res['modelo'].medida_largo);
        this.modeloForm.get('nombre').setValue(res['modelo'].nombre);
        this.modeloForm.get('archivo').setValue(res['modelo'].archivo);
        this.cargarTags(res['modelo'].tags, this.arrayModificado);
        this.cargarColores(res['modelo'].colores, this.arrayColoresModificado);
        // for(let elemento in this.arrayModificado){
        //   console.log('elemento', this.arrayModificado[elemento]);
        // }
    });

  }

  edit(uid: string){
    this.uid = uid;
    this.titulo.nativeElement.innerHTML = "Editar Modelo";
    this.campoTags.nativeElement.innerHTML = '';
    this.nombreTag.nativeElement.value = '';
    this.arrayModificado = [];
    this.arrayTags = [];

    this.campoColores.nativeElement.innerHTML = '';
    this.color.nativeElement.value = '';
    this.arrayColoresModificado = [];
    // this.arrayColores = [];

    this.modeloForm.reset();
    this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','block');
    this.renderer2.setStyle(this.botonCrear.nativeElement,'display','none');
    this.actualizarFormulario(uid);
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
  }

  actualizarModelo(){
    this.nombreTag.nativeElement.value = '';

    for(let entry of this.arrayTags){
      this.arrayModificado.push(entry);
    }
    for(let entry of this.arrayColores){
      this.arrayColoresModificado.push(entry);
    }
    this.modeloForm.controls['tags'].setValue(this.arrayModificado);
    this.modeloForm.get('colores').setValue(this.arrayColoresModificado);

    this.buscarNombreCatalog(this.catalogos);
    this.modeloForm.get('fecha').setValue(new Date());
    // console.log('mando esto',this.modeloForm.value);

    this.formSubmit = true;
    //console.log(this.modeloForm);
    if(!this.modeloForm.valid){
      console.warn('Error, faltan campos');
    }
    this.modeloService.actualizarModelo( this.modeloForm.value, this.uid )
    .subscribe( res => {
      // console.log('res', res);
      this.buscarNombreCatalog(this.catalogos);

      this.modeloForm.markAsPristine();
      this.cargarModelos(this.ultimaBusqueda);
      this.offModal1();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
      // console.warn('Error respuesta api');

    });
  }
  
  addTag(){
    //añado la palabra en un array para luego pasarlo por el post
    this.arrayTags.push(this.nombreTag.nativeElement.value);
    //creo los tags con las palabras añadidas
    const span = this.renderer2.createElement('span');
    const contenido = this.renderer2.createText(this.nombreTag.nativeElement.value);
    this.nombreTag.nativeElement.value = '';

    //añado cruz en los tags, para eliminar
    const span2 = this.renderer2.createElement('span');
    const contenido2 = this.renderer2.createText('\u2715');
    let palabraBorrada; 
    this.renderer2.appendChild(span2,contenido2);
    this.renderer2.appendChild(span,contenido);
    palabraBorrada = span.innerHTML;
    this.renderer2.appendChild(span, span2);
    this.renderer2.setAttribute(span,'class','etiqueta');
    this.renderer2.setAttribute(span2,'style', 'cursor: pointer');
    this.renderer2.appendChild(this.campoTags.nativeElement, span);

    //elimino el tag y la palabra del array si pulsa la cruz
    this.renderer2.listen(span2, 'click', () =>{
      // console.log(palabraBorrada);
      this.renderer2.removeChild(this.campoTags.nativeElement, span);
      this.arrayTags.forEach((element,index)=>{
        if(element == palabraBorrada ){
          this.arrayTags.splice(index,1);
          // console.log("lo he borrado");
        }
     });
    }); 

    // for(let elemento in this.arrayTags){
    //   console.log('elemento de arrayTags', this.arrayTags[elemento]);
    // }
  }

  addColor(){
      this.arrayC = [this.color.nativeElement.value,this.nombreColor.nativeElement.value];
      // arrayC.push(this.color.nativeElement.value);
      // arrayC.push(this.nombreColor.nativeElement.value);
      // console.log('introduzco datos',this.arrayC);
       
      this.arrayColores.push(this.arrayC);

      // console.log('arrayColores',this.arrayColores);

      // for(let entry of this.arrayColores){
      //   console.log('color',entry);
      // }

      const span = this.renderer2.createElement('span');
      const span3 = this.renderer2.createElement('span');
      const contenido = this.renderer2.createText(this.nombreColor.nativeElement.value);
      // this.color.nativeElement.value = '';
      this.nombreColor.nativeElement.value = '';

      //añado cruz en los tags, para eliminar
      const span2 = this.renderer2.createElement('span');
      const contenido2 = this.renderer2.createText('\u2715');
      let palabraBorrada; 
      this.renderer2.appendChild(span2,contenido2);
      this.renderer2.appendChild(span,span3);
      this.renderer2.appendChild(span,contenido);

      palabraBorrada = span.innerHTML;
      this.renderer2.appendChild(span, span2);
      this.renderer2.setAttribute(span,'class','etiqueta');
      this.renderer2.setAttribute(span2,'style', 'cursor: pointer');
      this.renderer2.setAttribute(span3,'class','color');
      this.renderer2.setAttribute(span3,'style', 'background-color:'+this.color.nativeElement.value);
      this.renderer2.appendChild(this.campoColores.nativeElement, span);
  
      //elimino el tag y la palabra del array si pulsa la cruz
      this.renderer2.listen(span2, 'click', () =>{
        // console.log(palabraBorrada);
        this.renderer2.removeChild(this.campoColores.nativeElement, span);
        this.arrayTags.forEach((element,index)=>{
          if(element == palabraBorrada ){
            this.arrayTags.splice(index,1);
            // console.log("lo he borrado");
          }
       });
      }); 
  
      // for(let elemento in this.arrayTags){
      //   console.log('elemento de arrayTags', this.arrayTags[elemento]);
      // }
  }

  onModal(){
    this.switchModal = true;
  }

  onModal1(){
    this.modeloForm.reset();
    this.titulo.nativeElement.innerHTML = "Nuevo Modelo";
    this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
    this.campoTags.nativeElement.innerHTML = '';
    if(this.botonAceptar.nativeElement.style.display == 'block'){
      this.renderer2.setStyle(this.botonAceptar.nativeElement,'display','block');
    }
    if(this.botonCrear.nativeElement.style.display == 'none'){
      this.renderer2.setStyle(this.botonCrear.nativeElement,'display','block');
    }
  }
  offModal1(){
    this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
  }

  offModal(){
    this.switchModal = false;
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarModelos(this.ultimaBusqueda);
  }

  cambioBoton(boton: string){
    if(boton == 'Aceptar'){
      const botonAceptar = this.botonAceptar.nativeElement;
      this.renderer2.setStyle(botonAceptar,'background','grey');
    }
    else{
      const botonCrear = this.botonCrear.nativeElement;
      this.renderer2.setStyle(botonCrear,'background','grey');
    }
  }

  onSubmit(accion: string){
    if(accion === 'Crear'){
      this.crearModelo();
    }
    else if(accion === 'Editar'){
      this.actualizarModelo();
    }
  }

  buscarNombreCatalog(catalogo: catalogForm[]){
    for(let entry of catalogo){
      if(this.modeloForm.get('catalogo').value == entry.nombre){
        this.modeloForm.get('catalogo_nombre').setValue(entry.nombre);
        this.modeloForm.get('catalogo').setValue(entry.uid);
      }
    }
  }

  crearModelo(){
    this.modeloForm.controls['tags'].setValue(this.arrayTags);
    // console.log('form',this.modeloForm.value);
    this.buscarNombreCatalog(this.catalogos);
    this.modeloForm.get('fecha').setValue(new Date());
    this.modeloForm.get('colores').setValue(this.arrayColores);

    this.formSubmit = true;
    //console.log(this.modeloForm);
    if(!this.modeloForm.valid){
      console.warn('Error, faltan campos');
    }
    
    this.modeloService.addModelo(this.modeloForm.value)
    .subscribe(res => {
      // console.log('Respuesta al subscribe:', res);
      this.cargarModelos(this.ultimaBusqueda);
      this.offModal1();

    }, (err) => {
      console.warn('Error respuesta api');
    });
  }

  campoValido(campo: string){
    return this.modeloForm.get(campo).valid || !this.formSubmit;
  }

}