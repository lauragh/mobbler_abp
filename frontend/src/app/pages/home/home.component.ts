import { AbstractType, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild,ViewChildren,ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
//Interfaces
import { modeloForm } from '../../interfaces/modelo-form.interface';
//Services
import { CatalogService } from 'src/app/services/catalog.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProjectService } from '../../services/project.service';
import { ModeloService } from '../../services/modelo.service';
import { SharedService } from '../../services/shared.service';
import { HomeService } from '../../services/home.service';
import { EngineService } from '../motor/motor.service';

//Models
import { Catalogo } from '../../models/catalogo.model';
import { Project } from '../../models/project.model';
import { Model } from '../../models/models.model';
import { Escena } from '../../models/escena.model';

//Libraries
import Swal from 'sweetalert2';
//para hacer el pdf
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { logging } from 'protractor';
//para mandar emails
import '../../../assets/smtp.js'; 
import { ThisReceiver } from '@angular/compiler';
import { EscenaService } from 'src/app/services/escena.service';
declare let Email : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {
  //Variables usuario
  public uidProyecto = '';
  public nombreProyecto = '';
  
  listaProyectos: Project[] = [];
  arrayProyecto: Project;
  listaCatalogos: Catalogo[] = [];
  listaEscenas: Escena[] = [];

  arrayCatalogosUsuario: Catalogo[] = [];
  arrayUidCatalogosUsuario: string[] = [];
  arrayResto: Catalogo[] = [];
  modelos: modeloForm[] = [];
  modeloSeleccionado: modeloForm;
  listaModelos: Model[] =[];
  listaPosX:Number[] =[] ;
  listaPosY:Number[] =[] ;
  listaPosZ:Number[] =[];
  listaRotacion:Float32Array[] =[] ;
  totalmodelos = 0;
  total = 0;
  total_string = '';
  mostrar = false;
  color = [];
  nombreUsuario = '';
  creador = '';
  vacio;
  colorSeleccionado = 0;
  carga1 = true;
  colorModelo = '';
  actualEscena: Escena;
  escenaCrear: Escena = new Escena('',this.uidProyecto,[],this.usuarioService.nombre + " " + this.usuarioService.apellidos,'',new Date());


  public datosForm = this.fb.group({
      //uid: [{value: 'nuevo', disable: true}, Validators.required],
      titulo: ['', Validators.required],
      descripcion: [''],
      notas: [''],
      creador: [''],
      nombre_creador: ['', Validators.required],
      n_muebles: [''],
      clientes: [''],
      fecha: [''],
      fechaC: [''],
      muebles: [''],
      posicion:['']
  });

  public datosEscena = this.fb.group({
    titulo: [''],
    proyecto_uid: [''],
    muebles: [''],
    autor: [''],
    imagen: [''],
    fechaC: [''],
  });

  //Variables proyecto
  public ultimaBusqueda = '';
  public loading = true;
  public totalproyectos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public uidMuebles: string[]=[];
  

  //Variable Notificaciones
  public isShown = false;

  public perfil = 'perfil';
  public estadisticas = 'estadisticas';
  public facturas = 'facturas';
  public planes = 'planes';

  // //Variables Compartir 
  // @ViewChild('email') email: ElementRef;
  // @ViewChild('emailCliente') emailCliente: ElementRef;
  // arrayClientes: string[]= [];
  // public shareForm = this.fb.group({
  //   email: ['', [Validators.required, Validators.email]]
  // });
  // htmlStr = '';



  @ViewChild('buttonInfo') buttonInfo: ElementRef;
  @ViewChild('notification') notification: ElementRef;
  @ViewChild('catalogo') catalogo: ElementRef;
  @ViewChild('comments') comments: ElementRef;
  @ViewChild('info') info: ElementRef;
  @ViewChild('presupuesto') presupuesto: ElementRef;
  @ViewChild('cards') cards: ElementRef;
  @ViewChild('atras') atras: ElementRef;
  @ViewChild('opcionLista') opcionLista: ElementRef;
  @ViewChild('tarjetaModelo') tarjetaModelo: ElementRef;
  @ViewChild('mini') mini: ElementRef;
  @ViewChild('filtros') filtros: ElementRef;
  @ViewChildren('ojo') ojo: QueryList<any>;
  @ViewChildren('modelo') modelo: QueryList<any>;
  @ViewChild('tipoMueble') tipoMueble: ElementRef;
  @ViewChild('formas') formas: ElementRef;
  @ViewChild('material') material: ElementRef;
  @ViewChild('colores') colores: ElementRef;
  @ViewChild('precio') precio: ElementRef;
  @ViewChild('mas1') mas1: ElementRef;
  @ViewChild('mas2') mas2: ElementRef;
  @ViewChild('mas3') mas3: ElementRef;
  @ViewChild('mas4') mas4: ElementRef;
  @ViewChild('mas5') mas5: ElementRef;
  @ViewChildren('op') op: QueryList<any>;
  @ViewChild('precioMin') precioMin: ElementRef;
  @ViewChild('precioMax') precioMax: ElementRef;
  @ViewChild('opcionHab') opcionHab: ElementRef;
  @ViewChildren('opColor') opColor: QueryList<any>;
  @ViewChildren('lb') lb: QueryList<any>;
  @ViewChild('seccionTipoMueble') seccionTipoMueble: ElementRef;
  @ViewChild('seccionCompartir') seccionCompartir: ElementRef;
  @ViewChild('seccionGuardar') seccionGuardar: ElementRef;
  @ViewChild('seccionControl') seccionControl: ElementRef;
  @ViewChild('estado') estado: ElementRef;
  @ViewChild('opE1') opE1: ElementRef;
  @ViewChild('opE2') opE2: ElementRef;
  @ViewChild('historico') historico: ElementRef;
  @ViewChildren('escenas') escenas: QueryList<any>;
  @ViewChild('imagenEscena') imagenEscena: ElementRef;
  @ViewChild('tituloEscena') tituloEscena: ElementRef;

  constructor(
    private renderer2: Renderer2,
    private sharedService: SharedService,
    private modeloService: ModeloService,
    private usuarioService: UsuarioService,
    private projectService: ProjectService,
    private catalogService: CatalogService,
    private escenaService: EscenaService,
    private homeService: HomeService,
    private motorService: EngineService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { 
      //Le paso instancia del render de HomeService
      this.homeService.renderer = renderer2;
    }

  ngOnInit(): void {

    if(this.usuarioService.uid !== 'undefined'){
      // console.log('ROL: ' + this.usuarioService.rol);
      this.cargarUsuario();
    }

    this.route.queryParams
    .subscribe(params => {
      // console.log(params);
      this.uidProyecto = params.proyecto;
      // console.log('UID del Proyecto: '+ this.uidProyecto);
    });

    //console.log('El usuario es: '+this.usuarioService.uid);
    this.formEditarProyecto();
  }

  async formEditarProyecto(){
    // console.log('toi acasfawsdfa');
    this.projectService.getProject(this.uidProyecto)
    .subscribe( res =>
      {
        //console.log('EL UID DEL USUARIO CREADOR '+res['proyecto'].creador)
        //console.log(res);
        this.datosForm.get('titulo').setValue(res['proyecto'].titulo);
        this.datosForm.get('descripcion').setValue(res['proyecto'].descripcion);
        this.datosForm.get('notas').setValue(res['proyecto'].notas);
        this.datosForm.get('creador').setValue(res['proyecto'].creador);
        this.datosForm.get('nombre_creador').setValue(res['proyecto'].nombre_creador);
        this.datosForm.get('n_muebles').setValue(res['proyecto'].n_muebles);
        this.datosForm.get('fechaC').setValue(res['proyecto'].fechaC);
        this.datosForm.get('fecha').setValue(res['proyecto'].fecha);
        this.datosForm.get('muebles').setValue(res['proyecto'].muebles);
        
        //this.cargarClientes(res['proyecto'].clientes, this.arrayModificado);
    });
  }


  cargarInfoProyecto(){
    //titulo
    const titulo = this.renderer2.createElement('h3');
    const textoTitulo = this.renderer2.createText(this.arrayProyecto.titulo);
    this.renderer2.appendChild(titulo, textoTitulo);
    this.renderer2.appendChild(this.info.nativeElement, titulo);
    //descripcion
    const descripcion = this.renderer2.createElement('p');
    const textoDes = this.renderer2.createText(this.arrayProyecto.descripcion);
    this.renderer2.appendChild(descripcion, textoDes);
    this.renderer2.appendChild(this.info.nativeElement, descripcion);

    const hr = this.renderer2.createElement('hr');
    const hr1 = this.renderer2.createElement('hr');
    const hr2 = this.renderer2.createElement('hr');

    this.renderer2.appendChild(this.info.nativeElement, hr);

    //notas
    const tituloNotas = this.renderer2.createElement('h4');
    const textoNotas = this.renderer2.createText('Notas');
    this.renderer2.appendChild(tituloNotas, textoNotas);
    this.renderer2.appendChild(this.info.nativeElement, tituloNotas);

    const notas = this.renderer2.createElement('p');
    const contenidoNotas = this.renderer2.createText(this.arrayProyecto.notas);
    this.renderer2.appendChild(notas, contenidoNotas);
    this.renderer2.appendChild(this.info.nativeElement, notas);

    this.renderer2.appendChild(this.info.nativeElement, hr1);

    const tituloClientes = this.renderer2.createElement('h4');
    const textoClientes = this.renderer2.createText('Clientes');
    this.renderer2.appendChild(tituloClientes, textoClientes);
    this.renderer2.appendChild(this.info.nativeElement, tituloClientes);

    //clientes
    for(let cliente of this.arrayProyecto.clientes){
      const div = this.renderer2.createElement('div');
      const nombre = this.renderer2.createElement('p');
      const textoNombre = this.renderer2.createText(cliente[0]);
      this.renderer2.appendChild(nombre, textoNombre);
      this.renderer2.appendChild(div, nombre);
      const email = this.renderer2.createElement('p');
      const textoEmail = this.renderer2.createText(cliente[1]);
      this.renderer2.appendChild(email, textoEmail);
      this.renderer2.appendChild(div, email);
      this.renderer2.addClass(div,'flex');
      this.renderer2.appendChild(this.info.nativeElement, div);
    }


    this.renderer2.appendChild(this.info.nativeElement, hr2);
    //creador
    const div2 = this.renderer2.createElement('div');
    const tituloCreador = this.renderer2.createElement('h5');
    const textoCreador = this.renderer2.createText('Creado por:');
    this.renderer2.appendChild(tituloCreador, textoCreador);
    this.renderer2.appendChild(div2,tituloCreador);

    const creador = this.renderer2.createElement('p');
    const contenidoCreador = this.renderer2.createText(this.arrayProyecto.nombre_creador);
    this.renderer2.appendChild(creador, contenidoCreador);
    this.renderer2.appendChild(div2,creador);
    this.renderer2.setAttribute(creador,'style','padding-left: 5px;');
    this.renderer2.addClass(div2,'flex');
    this.renderer2.appendChild(this.info.nativeElement, div2);

    const boton = this.renderer2.createElement('button');
    const textoBoton = this.renderer2.createText('x');
    this.renderer2.appendChild(boton, textoBoton);
    this.renderer2.addClass(boton,'cerrar');
    this.renderer2.listen(boton, "click", event => {
      this.offModal('info');
    });

    this.renderer2.appendChild(this.info.nativeElement, boton);
  }

  cambiarOjo(modelo_uid){
    // console.log(this.ojo);
    for (let a  = 0; a < this.ojo.length; a++){
      if(this.ojo.get(a).nativeElement.id == modelo_uid){
        if(this.ojo.get(a).nativeElement.className == 'ojo.png'){
          this.ojo.get(a).nativeElement.className = 'ojos-cruzados.png';
        }
        else{
         this.ojo.get(a).nativeElement.className = 'ojo.png'
        }
      }
      this.renderer2.setAttribute(this.ojo.get(a).nativeElement,'src','../../../../assets/img/'+this.ojo.get(a).nativeElement.className);
   }
  }

  actualizarProyecto(){
    this.datosForm.get('fecha').setValue(new Date());
    this.projectService.editProject(this.uidProyecto, this.datosForm.value)
    .subscribe( res => {
      //  console.log('datos mandados', res);
      this.datosForm.markAsPristine();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }
    

  eliminarModelo(pos){
    this.total = 0;
    // console.log('La lista de modelos es: ' +this.listaModelos);
    let array_filtrado = [];
    this.listaModelos.splice(pos,1);
    this.listaPosX.splice(pos,1);
    this.listaPosY.splice(pos,1);
    this.listaPosZ.splice(pos,1);
    this.listaRotacion.splice(pos,1);
    //borramos el elemento en el motor
    this.motorService.delete(pos+1);
    //this.transladarObj();
    //this.motorService.testDraw();
    this.motorService.animate(0);
    for(let i = 0; i < this.listaModelos.length; i++){
      array_filtrado.push(this.listaModelos[i].uid);
      this.total += this.listaModelos[i].precio;
      
     }
    // this.datosForm.get('muebles').setValue(res['proyecto'].muebles);
    this.datosForm.get('muebles').setValue(array_filtrado);
    this.actualizarProyecto();
    // console.log(this.modelo);
    this.total_string = this.total.toFixed(2);
    
    
  }

  cargarUsuario(){
    this.usuarioService.cargarUsuario(this.usuarioService.uid).subscribe(res => {
      // console.log('Datos del usuario: ',res);
      if(res != 'undefined'){
         this.arrayUidCatalogosUsuario = res['clientes'].catalogos;
        //  console.log('catalogos del usuario',this.arrayUidCatalogosUsuario);
        this.nombreUsuario = res['clientes'].nombre +' '+ res['clientes'].apellidos;
        this.creador = res['clientes'].uid;
        this.cargarProyecto();
      }
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Lo siento...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });
  }

  async cargarProyecto(){
    //console.log('LLEGO A CARGAR PROYECTO: '+this.uidProyecto);
    this.projectService.getProject(this.uidProyecto).subscribe(res => {
      // console.log('Datos del proyecto: ',res);
      //console.log('LLEGO A HACER EL CARGADO DEL PROYECTO');
      this.arrayProyecto = res['proyecto'];
      this.nombreProyecto = res['proyecto'].titulo;      
      // console.log('Los uid de los muebles son'+ this.uidMuebles);
      // console.log(this.arrayProyecto);
      this.cargarCatalogos();
      this.cargarEscenas(res['proyecto'].muebles);     
      this.cargarInfoProyecto();
      this.crearComentarios();
      

    }, (err) => {
      Swal.fire({icon: 'error', title: 'Lo siento...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
    });
    
  }

  cargarControles(){
    this.renderer2.setAttribute(this.seccionControl.nativeElement,'style', 'block');
  }

  async cargarModelos(){
      this.listaModelos =[];
      this.total = 0;
      //console.log(this.uidMuebles);
      for (let a =0 ; a < this.uidMuebles.length; a++){
        this.modeloService.cargarModelo(this.uidMuebles[a]).subscribe( async res => {
        this.listaModelos.push(res['modelo']['precio']);
            
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        console.warn('error:', err);
        this.loading = false;
      });
    
      }
     
      for (let a =0 ; a < this.uidMuebles.length; a++){
        this.modeloService.cargarModelo(this.uidMuebles[a]).subscribe( async res => {
          //cargamos el modelo tambien 
          //console.log('El modelo es: '+res['modelo']['nombre']+' y la posicion: '+ (a+1));
          await this.motorService.addObject( res['modelo']['archivo'][0][1], a+1,this.listaRotacion[a],);  
          //console.log('modelo',res['modelo']);
          this.listaModelos.splice(a,1,res['modelo']);
          //this.listaModelos.push();
          

          this.total= this.total + res['modelo']['precio'];
          this.total_string = this.total.toFixed(2);
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          console.warn('error:', err);
          this.loading = false;
        });
      }
    
  }

  
  cargar() {
    //console.log("Ha pasado 1 segundo.");
  }

  transladarObj(){
    for(let a = 0; a < this.listaPosX.length; a++){
      let pos = a+1;
      //console.log('La pos del modelo es'+ pos+'Las posiciones son: '+this.listaPosX[a]+','+this.listaPosY[a]+','+this.listaPosZ[a]+' y la rotacion: '+this.listaRotacion[a]);
      this.motorService.translateModel(this.listaPosX[a],this.listaPosY[a],this.listaPosZ[a],pos,this.listaRotacion[a]);
      }
  }

  compartir(){
    this.renderer2.setAttribute(this.seccionCompartir.nativeElement,'style', 'block');
  }
  
  abrirHistorico(){
    if(this.listaEscenas.length != 0){
      this.vacio = true;
    }
    else{
      this.vacio = false;
    }
    // console.log('booleano',this.vacio);
    this.renderer2.setAttribute(this.historico.nativeElement,'style', 'block');
    // this.cargarEscenas();
  }

  cambiarImagenEscena(imagen: string){
    this.renderer2.setAttribute(this.imagenEscena.nativeElement, 'src', 'assets/img/proyectos/'+imagen);
  }

  cargarEscena(escena: any){
    this.motorService.resetScene();
    this.uidMuebles = [];
    this.listaPosX = [];
    this.listaPosY = [];
    this.listaPosZ = [];
    this.listaRotacion = [];
    for(let a= 0; a < escena['muebles'].length; a++){
      //console.log('mueble id',escena['muebles'][a][0]['mueble_uid']);
      this.uidMuebles.push(escena['muebles'][a][0]['mueble_uid']);
      this.listaPosX.push(escena['muebles'][a][0]['coordenadas'][0]['x']) ;
      this.listaPosY.push(escena['muebles'][a][0]['coordenadas'][0]['y']) ;
      this.listaPosZ.push(escena['muebles'][a][0]['coordenadas'][0]['z']) ;
      this.listaRotacion.push(escena['muebles'][a][0]['rotacion']);
    }
    this.cargarModelos();

  }

  cargarEscenas(muebles: any){
    this.escenaService.cargarEscenasProyecto(0,this.uidProyecto).subscribe(res => {
      // console.log(this.uidProyecto);
      //console.log('Escenas: ',res);
      this.listaEscenas = res['escenas'];
      //console.log(this.listaEscenas);
      this.actualEscena = this.listaEscenas[0];
      //console.log(this.actualEscena);
      this.uidMuebles = [];
      this.listaPosX = [];
      this.listaPosY = [];
      this.listaPosZ = [];
      this.listaRotacion = [];
      if(this.listaEscenas.length != 0){
        for(let a= 0; a < this.actualEscena['muebles'].length; a++){
          //console.log('mueble id',this.actualEscena['muebles'][a][0]['mueble_uid']);
          this.uidMuebles.push(this.actualEscena['muebles'][a][0]['mueble_uid']);
          this.listaPosX.push(this.actualEscena['muebles'][a][0]['coordenadas'][0]['x']) ;
          this.listaPosY.push(this.actualEscena['muebles'][a][0]['coordenadas'][0]['y']) ;
          this.listaPosZ.push(this.actualEscena['muebles'][a][0]['coordenadas'][0]['z']) ;
          this.listaRotacion.push(this.actualEscena['muebles'][a][0]['rotacion']);
        }
      }
      else{
        for(let a= 0; a < muebles.length; a++){
          //console.log('El mueble tiene este uid: '+muebles[a][0].modelo);
          this.uidMuebles.push(muebles[a][0].modelo);
          this.listaPosX.push(muebles[a][0].x) ;
          this.listaPosY.push(muebles[a][0].y) ;
          this.listaPosZ.push(muebles[a][0].z) ;
          this.listaRotacion.push(muebles[a][0].rotacion) ;
        }
      }
      this.cargarModelos()

      //console.log('uid mientras cargo escenas',this.uidMuebles);
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Lo siento...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
    });
  }

  guardarProyecto(){
    if(this.arrayProyecto.estado == 'En desarrollo'){
      this.opE1.nativeElement.innerHTML = 'En desarrollo';
      this.opE2.nativeElement.innerHTML = 'Terminado';

    }
    else if(this.arrayProyecto.estado == 'Terminado'){
      this.opE1.nativeElement.innerHTML = 'Terminado';
      this.opE2.nativeElement.innerHTML = 'En desarrollo';
    }

    this.renderer2.setAttribute(this.seccionGuardar.nativeElement,'style', 'block');
  }

  guardar(){
    this.arrayProyecto.estado = this.estado.nativeElement.value;
    // console.log(this.tituloEscena.nativeElement.value);
    this.escenaCrear.titulo = this.tituloEscena.nativeElement.value;
    this.escenaCrear.autor = this.usuarioService.nombre + " " + this.usuarioService.apellidos;
    this.escenaCrear.proyecto_uid = this.uidProyecto;
    // this.datosEscena.get('titulo').setValue(this.tituloEscena.nativeElement.value);
    // this.datosEscena.get('autor').setValue(this.usuarioService.nombre + " " + this.usuarioService.apellidos);
    // this.datosEscena.get('fechaC').setValue(new Date());
    // this.datosEscena.get('imagen').setValue('');
    // this.datosEscena.get('proyecto_uid').setValue(this.uidProyecto);
    this.arrayProyecto.muebles = [];
    
    for(let a = 0; a < this.listaModelos.length; a++){
      let array = this.motorService.getPosition(0);
      let modelo =this.listaModelos[a].uid;
      let x = array[0];
      let y = array[1];
      let z = array[2];
      // console.log('posiciones',this.motorService.getPosition(a+1));
      // console.log('x',x);
      let rotacion = this.motorService.saveModelMatrix(a+1);
      this.arrayProyecto.muebles.push({modelo,x,y,z, rotacion})
      // console.log("El array de pos es: "+ array);
    }
    for(let i = 0; i < this.arrayProyecto.muebles.length; i++){
      this.escenaCrear.muebles.push({coordenadas: {x: this.arrayProyecto.muebles[i]['x'], y: this.arrayProyecto.muebles[i]['y'], z: this.arrayProyecto.muebles[i]['z']} , rotacion: this.arrayProyecto.muebles[i]['rotacion'], mueble_uid: this.arrayProyecto.muebles[i]['modelo']});
    } 
    // this.datosEscena.get('muebles').setValue(mueblesEscena);

    // console.log('muebles',this.escenaCrear.muebles);
    // console.log('datos de la escena que voy a enviar', this.escenaCrear);
    // this.capturarCanvas();
    // this.escenaService.crearEscena(this.escenaCrear).subscribe(res => {
    //   console.log('creacion escena');
    //   console.log(res);
    //   console.log('muebles',res['muebles'][0][0]);
    // }, (err) => {
    //   Swal.fire({icon: 'error', title: 'Lo siento...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
    //   this.loading = false;
    // });
    this.editarProyecto(this.uidProyecto, this.arrayProyecto);
    // this.cargarProyecto();
    Swal.fire({
      title: 'Proyecto guardado',
      text: 'El proyecto guardado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok',
      allowOutsideClick: false
    });
  }
  
  convertFecha(fecha: String){
    let cadena = fecha.split('T');
    cadena = cadena[0].split("-");
    let f = cadena[2] + "-" + cadena[1] + "-" + cadena[0];
    let hoy = new Date();
    let mes = '';
    if(hoy.getMonth()+1 < 10){
      mes = '0'+ (hoy.getMonth()+1);
    }
    let fechaHoy = hoy.getDate() + "-"+ mes + "-" +hoy.getFullYear();
    // console.log('fechaHoy',fechaHoy);
    // console.log('f',f);

    if(f == fechaHoy){
      let mySubString = fecha.substring(
        fecha.indexOf("T") + 1, 
        fecha.lastIndexOf(".")
      );

      let hora = mySubString.split(':');
      f = (parseInt(hora[0])+2).toString() + ":" + hora[1];
      // console.log('hora',f);
    }
    return f;
  }

  verComentarios(){
    this.renderer2.setAttribute(this.comments.nativeElement, 'style', 'display:block');
  }

  enviarComentario(comentario: string){
    let arrayComentario = [];
    //creo un nuevo objeto comentario
    arrayComentario.push(this.creador);
    arrayComentario.push(comentario);
    let f = new Date().toISOString();

    //lo anyado al array de cometnarios
    arrayComentario.push(f);
    // console.log('nuevoComentario',arrayComentario);
    this.arrayProyecto.comentarios.push(arrayComentario);
    this.editarProyecto(this.uidProyecto, this.arrayProyecto);
    this.crearComentarios();
  }

  crearComentarios(){
    this.comments.nativeElement.innerHTML = '';
    // console.log('comentarios',this.arrayProyecto.comentarios);
    const div = this.renderer2.createElement('div');
    this.renderer2.setAttribute(div,'style',' width: 93%; margin: 10px auto;');

    const seccion = this.renderer2.createElement('section');
    
    this.renderer2.setAttribute(seccion,'style','margin-bottom: 10px; height:305px; overflow-y: scroll; display: flex;flex-direction: column-reverse;');

    const tituloComentarios = this.renderer2.createElement('h4');
    const textoComentarios = this.renderer2.createText('Comentarios');
    this.renderer2.appendChild(tituloComentarios, textoComentarios);
    this.renderer2.setAttribute(tituloComentarios,'style',' font-size: 1.2em;color: #62605c;');

    const contenedor = this.renderer2.createElement('div');

    if(this.arrayProyecto.comentarios != null){
      for(let entry of this.arrayProyecto.comentarios){
        const div2 = this.renderer2.createElement('div');
        // console.log('ids',entry[0], this.creador);
        const div3 = this.renderer2.createElement('div');
        this.renderer2.setAttribute(div3,'style','display: inline-block; float:right');
  
        const head = this.renderer2.createElement('p');
        let textoHead = this.renderer2.createText(this.nombreUsuario);
  
        if(entry[0] == this.creador){
          this.renderer2.setAttribute(div2,'style','float:right; padding-left: 100%;');
          textoHead = this.renderer2.createText('Yo');
          this.renderer2.setAttribute(div3,'style','display: flex; justify-content: end;');
  
        }
        else{
          this.renderer2.setAttribute(div2,'style','float:left; margin:5px');
          this.renderer2.setAttribute(div2,'style','float:left');
          this.renderer2.setAttribute(div3,'style','display: flex; justify-content: start;');
        }
        this.renderer2.appendChild(head,textoHead);
        this.renderer2.setAttribute(head,'style','float: left; margin-right:10px');
        this.renderer2.setAttribute(head,'class','estiloComentario');
        this.renderer2.appendChild(div3,head);
  
        const hora = this.renderer2.createElement('p');
        const textoHora = this.renderer2.createText(this.convertFecha(entry[2]));
        this.renderer2.appendChild(hora,textoHora);
        this.renderer2.setAttribute(hora,'style','float: right;');
        this.renderer2.appendChild(div3,hora);
  
        this.renderer2.appendChild(div2,div3);
  
        const mensaje = this.renderer2.createElement('p');
        const contenidoMensaje = this.renderer2.createText(entry[1]);
        this.renderer2.appendChild(mensaje,contenidoMensaje);
        this.renderer2.setAttribute(mensaje,'class','estiloTextoComentario');
        this.renderer2.setAttribute(mensaje,'align','justify');
        if(entry[0] == this.creador){
          this.renderer2.setAttribute(mensaje,'style','float: right;');
        }
        else{
          this.renderer2.setAttribute(mensaje,'style','float: left;');
        }
        this.renderer2.appendChild(div2,mensaje);
  
  
        this.renderer2.appendChild(contenedor, div2);
      }
    }

    //Anyadir comentario
    const seccion2 = this.renderer2.createElement('section');
    const textArea = this.renderer2.createElement('textarea');
    this.renderer2.setAttribute(textArea,'style','resize: none; width: 100%; border: solid 1px lightgrey;');
    this.renderer2.setAttribute(textArea,'placeholder','Escribe tu comentario');
    this.renderer2.setAttribute(textArea,'rows','3');
    //boton enviar
    const botonEnviar = this.renderer2.createElement('button');
    const textoBotonEnviar = this.renderer2.createText('Enviar');
    this.renderer2.appendChild(botonEnviar, textoBotonEnviar);
    this.renderer2.setAttribute(botonEnviar,'style','float: right');
    this.renderer2.listen(botonEnviar, "click", event => {
      this.enviarComentario(textArea.value);
    });

    this.renderer2.appendChild(seccion2, textArea);
    this.renderer2.appendChild(seccion2, botonEnviar);

    this.renderer2.appendChild(seccion, contenedor);
    this.renderer2.appendChild(div, tituloComentarios);
    this.renderer2.appendChild(div, seccion);
    this.renderer2.appendChild(div, seccion2);
    this.renderer2.appendChild(this.comments.nativeElement, div);
    const boton = this.renderer2.createElement('button');
    const textoBoton = this.renderer2.createText('x');
    this.renderer2.appendChild(boton, textoBoton);
    this.renderer2.addClass(boton,'cerrar');
    this.renderer2.listen(boton, "click", event => {
      this.offModal('comments');
    });
    this.renderer2.appendChild(this.comments.nativeElement, boton);
  }

  borrarNoti(noti: string){
    this.arrayProyecto.notificaciones.forEach((element,index)=>{
      if(element == noti ){
        this.arrayProyecto.notificaciones.splice(index,1);
      }
   });

   this.editarProyecto(this.uidProyecto, this.arrayProyecto);
  }

  verNotificaciones(){
    if(!this.isShown){
      this.isShown = true;
    }
  }

  offModalNoti(){
    this.isShown = false;
    this.renderer2.setStyle(this.notification.nativeElement, 'display', 'none');
  }

  obtenerFecha(){
    let date = new Date();
    let fecha = String(date.getDate()).padStart(2, '0') + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getFullYear();
    let hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const arr = [fecha, hora];

    return arr;
  }

  elegirColor(nombre: string, op: number){
    let encontrado = false;

    for (let i  = 0; i < this.opColor.length; i++){
      if(this.op.get(i).nativeElement.checked){
      }
    }

    if(this.color.length != 0){
      this.color.forEach((element,index)=>{
        if(element == nombre){
          this.color.splice(index,1,);
          encontrado = true;
          // console.log("lo he borrado - color");
          this.renderer2.removeClass(this.opColor.get(op).nativeElement,'colorSeleccionado');
        }
      });
      if(!encontrado){
        this.renderer2.addClass(this.opColor.get(op).nativeElement,'colorSeleccionado');

        this.color.push(nombre);
      }
    }
    else{
      this.color.push(nombre);
      this.renderer2.addClass(this.opColor.get(op).nativeElement,'colorSeleccionado');
      this.op.get(op).nativeElement.checked
    }
  }

  aplicarFiltros(){
    let tMueble = ["sofa","silla","mesa","chimenea","mueble-tv-multmedia","cama"];
    let fMueble = ["rectangular","cuadrada","redonda","ovalada","original"];
    let mMueble = ["madera","plastico","cristal","cuero","poliester","plastico"];
    let cMueble = ["rojo","purpura","rosa","azulOscuro","azulClaro","verde","amarillo","negro","gris","blanco"];
    let pMinMueble = 0;
    let pMaxMueble = 9999999;
    let tMueble2 = [];
    let fMueble2 = [];
    let mMueble2 = [];
    let modelosFiltros: modeloForm[] = [];


    for (let i  = 0; i < this.op.length; i++){
      if(this.op.get(i).nativeElement.checked){
        // console.log(this.op.get(i).nativeElement.value);
        if(this.op.get(i).nativeElement.id == 'op1' || this.op.get(i).nativeElement.id == 'op2'|| this.op.get(i).nativeElement.id == 'op3'|| this.op.get(i).nativeElement.id == 'op4'|| this.op.get(i).nativeElement.id == 'op5' || this.op.get(i).nativeElement.id == 'op6' || this.op.get(i).nativeElement.id == 'op7'){
          tMueble2.push(this.op.get(i).nativeElement.value);
        }
        else if(this.op.get(i).nativeElement.id == 'op8' || this.op.get(i).nativeElement.id == 'op9' || this.op.get(i).nativeElement.id == 'op10' || this.op.get(i).nativeElement.id == 'op11' || this.op.get(i).nativeElement.id == 'op12'){
          fMueble2.push(this.op.get(i).nativeElement.value);
        }
        else if(this.op.get(i).nativeElement.id == 'op13' || this.op.get(i).nativeElement.id == 'op14' || this.op.get(i).nativeElement.id == 'op15' || this.op.get(i).nativeElement.id == 'op16' || this.op.get(i).nativeElement.id == 'op17' || this.op.get(i).nativeElement.id == 'op18')
          mMueble2.push(this.op.get(i).nativeElement.value);
      }
      // console.log(this.op.get(i).nativeElement.id);
    }

    if(tMueble2.length != 0){
      tMueble = tMueble2;
    }
    if(fMueble2.length != 0){
      fMueble = fMueble2;
    }
    if(mMueble2.length != 0){
      mMueble = mMueble2;
    }
    if(this.color.length != 0){
      cMueble = this.color;
    }

    if(this.precioMin.nativeElement.value != ''){
      pMinMueble = this.precioMin.nativeElement.value;
    }
    if(this.precioMax.nativeElement.value != ''){
      pMaxMueble = this.precioMax.nativeElement.value;
    }

    let comprobacion, comprobacion2, comprobacion3, comprobacion4, comprobacion5, comprobacion6 = false;
    // console.log(tMueble, fMueble, mMueble, cMueble, pMinMueble, pMaxMueble);
    
    for(let entry of this.modelos){
      comprobacion = false;
      comprobacion2 = false;
      comprobacion3 = false;
      comprobacion4 = false;
      comprobacion5 = false;
      comprobacion6 = false;
      // console.log(entry);

      //tipo mueble 
      // console.log(entry.tags[0]);
      for(let tM of tMueble){
        if(entry.tags[0] == tM){
          // console.log(entry.tags[0], tM);
          // console.log('coincide tipo mueble');
          comprobacion = true;
        }
      }
      //forma
      for(let fM of fMueble){
        if(entry.tags[1] == fM){
          // console.log(entry.tags[1], fM);
          // console.log('coincide forma mueble');
          comprobacion2 = true;
        }
      }
      //material
      for(let mM of mMueble){
        if(entry.tags[2] == mM){
          // console.log(entry.tags[2], mM);
          // console.log('coincide material mueble');
          comprobacion3 = true;
        }
      }
      //color
      for(let c of entry.colores){
        for(let color of cMueble){
          if(c[1].search(color) != -1){
            // console.log(c[1],color );
            // console.log('coincide color mueble');
            comprobacion4 = true;
          }
        }
      }
      //precio
      if(entry.precio >= pMinMueble && entry.precio <= pMaxMueble){
        // console.log(entry.precio, pMinMueble, pMaxMueble);
        // console.log('coincide precio mueble');
        comprobacion5 = true;
      }
      //habitacion
      if(this.opcionHab.nativeElement.value == entry.tags[3]){
        // console.log(entry.tags[3], this.opcionHab.nativeElement.value);
        // console.log('coincide hab mueble');
        comprobacion6 = true;
      }

      // console.log('tipo',comprobacion);
      // console.log('forma',comprobacion2);
      // console.log('material',comprobacion3);
      // console.log('color',comprobacion4);
      // console.log('precio',comprobacion5);
      // console.log('hab',comprobacion6);

      if(this.opcionHab.nativeElement.value == 'todos'){
        if(comprobacion2 && comprobacion3 &&comprobacion4 && comprobacion5){
          modelosFiltros.push(entry);
        }
      }
      if(comprobacion && comprobacion2 && comprobacion3 &&comprobacion4 && comprobacion5 && comprobacion6){
        modelosFiltros.push(entry);
        // console.log('pasa todas las pruebas');
      }
    }
    // this.modelos = modelosFiltros;
    // console.log('miro modelos antes de mostrarlo',modelosFiltros);
    this.mostrarMuebles(modelosFiltros);
  }

  borrarFiltros(){
    this.color = [];
    for (let i  = 0; i < this.opColor.length; i++){
      this.renderer2.removeClass(this.opColor.get(i).nativeElement,'colorSeleccionado');
    }
    this.mostrarMuebles(this.modelos);
  }

  modificarTipoProducto(num: number, textoValor: string, texto: string){
    this.op.get(num).nativeElement.value = textoValor;
    this.lb.get(num).nativeElement.innerHTML = texto;
  }

  cambiarTipoM(habitacion: string){
    if(habitacion == 'banyo'){
      this.modificarTipoProducto(0,'alfombra','Alfombras');
      this.modificarTipoProducto(1,'armario','Armarios');
      this.modificarTipoProducto(2,'cesto','Cestos');
      this.modificarTipoProducto(3,'decoracion','Decoración');
      this.modificarTipoProducto(4,'espejo','Espejos');
      this.modificarTipoProducto(5,'lampara','Lámparas');
      this.modificarTipoProducto(6,'leja','Lejas');
    }
    else if(habitacion == 'cocina'){
      this.modificarTipoProducto(0,'armario','Armarios');
      this.modificarTipoProducto(1,'complemento','Complementos');
      this.modificarTipoProducto(2,'decoracion','Decoración');
      this.modificarTipoProducto(3,'lampara','Lámparas');
      this.modificarTipoProducto(4,'mesa','Mesas');
      this.modificarTipoProducto(5,'silla','Sillas');
      this.modificarTipoProducto(6,'taburete','Taburetes');
    }
    else if(habitacion == 'dormitorio'){
      this.modificarTipoProducto(0,'armario','Armarios');
      this.modificarTipoProducto(1,'cama','Camas');
      this.modificarTipoProducto(2,'espejo','Espejos');
      this.modificarTipoProducto(3,'decoracion','Decoración');
      this.modificarTipoProducto(4,'estanteria','Estanterías');
      this.modificarTipoProducto(5,'mesa','Mesas');
      this.modificarTipoProducto(6,'zapatero','Zapateros');
    }
    else if(habitacion == 'salon'){
      this.modificarTipoProducto(0,'alfombra','Alfombras');
      this.modificarTipoProducto(1,'complementos','Complementos');
      this.modificarTipoProducto(2,'lampara','Lámparas');
      this.modificarTipoProducto(3,'mesa','Mesas');
      this.modificarTipoProducto(4,'mueble-tv','Mueble de televisión y multimedia');
      this.modificarTipoProducto(5,'silla','Sillas');
      this.modificarTipoProducto(6,'sofa','Sofás');
    }
  }

  filtrarHab(){
    let modelosFiltros = [];
    // console.log('hab elegida',this.opcionHab.nativeElement.value);

    if(this.opcionHab.nativeElement.value == 'todos'){
      this.renderer2.setAttribute(this.seccionTipoMueble.nativeElement,'style','display:none');
      this.mostrarMuebles(this.modelos);
    }
    else{
      if(this.opcionHab.nativeElement.value == 'banyo'){
        this.cambiarTipoM('banyo');
      }
      else if(this.opcionHab.nativeElement.value == 'cocina'){
        this.cambiarTipoM('cocina');
      }
      else if(this.opcionHab.nativeElement.value == 'dormitorio'){
        this.cambiarTipoM('dormitorio');
      }
      else if(this.opcionHab.nativeElement.value == 'salon'){
        this.cambiarTipoM('salon');
      }
      this.renderer2.setAttribute(this.seccionTipoMueble.nativeElement,'style','display:block');

      for(let entry of this.modelos){
        if(entry.tags[3] == this.opcionHab.nativeElement.value){
          // console.log(entry.tags[3], this.opcionHab.nativeElement.value);
          // console.log('coincide tipo mueble');
          modelosFiltros.push(entry);
        }
      }
      this.mostrarMuebles(modelosFiltros);
    }
  }

  abrirFiltros(){
    this.renderer2.setAttribute(this.filtros.nativeElement, "style", "display:flex");
  }


  cambiarImagen(objeto: any, ruta: string, seccion: any){
    if(objeto.getAttribute('src')=='assets/img/mas.png'){
      this.renderer2.setAttribute(objeto, "src", ruta);
      if(seccion == this.colores.nativeElement){
        this.renderer2.setAttribute(seccion, "style", "display:flex; padding: 10px;");
      }
      else if(seccion == this.precio.nativeElement){
        this.renderer2.setAttribute(seccion, "style", "display:block; column-count:2; margin-left: 5px;");
      }
      else{
        this.renderer2.setAttribute(seccion, "style", "display:block");
      }
    }
    else if(objeto.getAttribute('src')=='assets/img/menos.png'){
      this.renderer2.setAttribute(objeto, "src", "assets/img/mas.png");
      this.renderer2.setAttribute(seccion, "style", "display:none");
    }
  }

  minimizar(objeto: string){
    let menos = "assets/img/menos.png";
    if(objeto == 'catalogo'){
      this.renderer2.setAttribute(this.mini.nativeElement, "style", "display:flex");
      this.renderer2.setAttribute(this.cards.nativeElement, "style", "display:none");
      this.renderer2.setAttribute(this.filtros.nativeElement, "style", "display:none");
      this.renderer2.setAttribute(this.tarjetaModelo.nativeElement, 'style', 'display:none');

    }
    else if(objeto == 'tipoMueble'){
      this.cambiarImagen(this.mas1.nativeElement, menos, this.tipoMueble.nativeElement);
    }
    else if(objeto == 'formas'){
      this.cambiarImagen(this.mas2.nativeElement, menos, this.formas.nativeElement);
    }
    else if(objeto == 'material'){
      this.cambiarImagen(this.mas3.nativeElement, menos, this.material.nativeElement);
    }
    else if(objeto == 'colores'){
      this.cambiarImagen(this.mas4.nativeElement, menos, this.colores.nativeElement);
    }
    else if(objeto == 'precio'){
      this.cambiarImagen(this.mas5.nativeElement, menos, this.precio.nativeElement);
    }
  }

  maximizar(){
    this.renderer2.setAttribute(this.cards.nativeElement, "style", "display:flex");
    if(this.mostrar){
      this.renderer2.setAttribute(this.atras.nativeElement, "style", "display:flex");
    }
    this.renderer2.setAttribute(this.catalogo.nativeElement, "style", "display:flex");
  }

  buscarCatalogo(){
    this.abrirCatalogo(this.opcionLista.nativeElement.value);
  }

  abrirCatalogo(uid: string){
    // console.log('abro catalogo');
    this.modelos = [];
    for(let entry of this.arrayCatalogosUsuario){
      // console.log('uid del catalogo',uid);
      if(entry.uid == uid){
        for(let i = 0; i < entry.models.length; i++){
          this.modeloService.cargarModelo(entry.models[i])
          .subscribe(res =>{
            this.modelos.push(res['modelo']);
            if(i == entry.models.length - 1){
              this.mostrarMuebles(this.modelos);
            }
            // console.log('añado',res['modelo']);
            
          })
        }
        break;
      }
    } 
  }

  infoModelo(){
    // console.log('tarjeta Modelo');
    this.tarjetaModelo.nativeElement.innerHTML = '';
    this.renderer2.setStyle(this.tarjetaModelo.nativeElement, 'display', 'block');
    const div = this.renderer2.createElement('div');
    const div4 = this.renderer2.createElement('div');
    const div5 = this.renderer2.createElement('div');
    this.renderer2.setAttribute(div4, 'style', 'display:flex');
    this.renderer2.setAttribute(div5, 'class', 'col');

    //cruz
    const cerrar = this.renderer2.createElement('button');
    const cruz = this.renderer2.createText('x');
    this.renderer2.appendChild(cerrar,cruz);
    this.renderer2.setAttribute(cerrar, 'class', 'cerrar');
    this.renderer2.listen(cerrar, "click", event => {
      this.offModal('infoModelo');
      this.offModal('filtros');

    });

    this.renderer2.setAttribute(cerrar, 'style', 'float: right; position: absolute; right: 0; top: -10px');
    this.renderer2.appendChild(div5, cerrar);

    //imagen
    const contImagen = this.renderer2.createElement('div');
    this.renderer2.setAttribute(contImagen,'style','position:relative')
    const flech1 = this.renderer2.createElement('a');
    const contFlech1 = this.renderer2.createText('<');
    this.renderer2.appendChild(flech1,contFlech1);
    this.renderer2.setAttribute(flech1,'class','signoImg');
    this.renderer2.setAttribute(flech1,'style','left: 5px');

    const flech2 = this.renderer2.createElement('a');
    const contFlech2 = this.renderer2.createText('>');
    this.renderer2.appendChild(flech2,contFlech2);
    this.renderer2.setAttribute(flech2,'class','signoImg');
    this.renderer2.setAttribute(flech2,'style','right: 5px');

    const img = this.renderer2.createElement('img');
    if(this.modeloSeleccionado.imagen){
      this.renderer2.setAttribute(img, "src", "assets/img/modelos/"+this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'][0]);
    }
    else{
      this.renderer2.setAttribute(img, "src", "assets/img/noimage.jpg");

    }

    if(this.modeloSeleccionado.imagenes){
      // console.log('tamaño',this.modeloSeleccionado.imagenes.length);
      // console.log('imagenes',this.modeloSeleccionado.imagenes);

      this.renderer2.setAttribute(img, "style", "height: 300px; width: 350px;");
      let cont = 0;
      // tslint:disable-next-line: max-line-length
      this.renderer2.setAttribute(img, 'src', 'assets/img/modelos/'+this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'][cont]);
      if(this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length <= 1){
        this.renderer2.setAttribute(flech1,'style','visibility:hidden');
        this.renderer2.setAttribute(flech2,'style','visibility:hidden');
      }
      else{
        this.renderer2.setAttribute(flech1,'style','visibility:visible');
        this.renderer2.setAttribute(flech1,'style','left: 5px');
        this.renderer2.setAttribute(flech2,'style','visibility:visible');
        this.renderer2.setAttribute(flech2,'style','right: 5px');
      }
      // console.log('posicion imagenes color que necesito', this.colorSeleccionado );
      this.renderer2.listen(flech2, "click", event => {
        // console.log(cont);
        if(this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length > 1){
          if(cont < this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length){
            cont++;
          }
          if(cont == this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length){
            cont = 0;
          }
        }
        // console.log(cont);
        this.renderer2.setAttribute(img, "src", "assets/img/modelos/"+this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'][cont]);
      });
      this.renderer2.listen(flech1, "click", event => {
        // console.log(cont);
        if(this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length > 1){
          // console.log('tamaño array',this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length);
          if(cont == 0){
            cont = this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length - 1;
          }
          else{
            cont--;
          }
        }
        // console.log(cont);
        this.renderer2.setAttribute(img, "src", "assets/img/modelos/"+this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'][cont]);
      });
       
    }
    this.renderer2.appendChild(contImagen,flech1);
    this.renderer2.appendChild(contImagen,flech2);
    this.renderer2.setAttribute(img, "style", "height: 300px; width: 350px;");
    this.renderer2.appendChild(contImagen,img);
    this.renderer2.appendChild(div4,contImagen);

    //nombre
    const nombre = this.renderer2.createElement('h2');
    const contenido = this.renderer2.createText(this.modeloSeleccionado.nombre);
    this.renderer2.appendChild(nombre,contenido);
    this.renderer2.setAttribute(nombre, 'class', 'colorLetraOscura');
    this.renderer2.setAttribute(nombre, 'style', 'margin-bottom:20px;');
    this.renderer2.appendChild(div,nombre);

    //precio
    const p = this.renderer2.createElement('div');
    const precio = this.renderer2.createElement('h4');
    const iva = this.renderer2.createElement('h4');
    const contenido2 = this.renderer2.createText(this.modeloSeleccionado.precio.toString()+ "€");
    const ivaC = this.renderer2.createText("IVA Incluído");
    this.renderer2.setAttribute(precio, 'class', 'colorLetraOscura');
    this.renderer2.setAttribute(precio, 'style', 'font-weight: 600; margin-right:10px');
    this.renderer2.appendChild(precio,contenido2);
    this.renderer2.appendChild(iva,ivaC);
    this.renderer2.appendChild(p, precio);
    this.renderer2.appendChild(p, iva);
    this.renderer2.setAttribute(p, 'style', 'display:flex');
    this.renderer2.appendChild(div,p);

    //descripcion
    const descripcion = this.renderer2.createElement('p');
    const contenido3 = this.renderer2.createText(this.modeloSeleccionado.descripcion);
    this.renderer2.appendChild(descripcion,contenido3);
    this.renderer2.setAttribute(descripcion,'style','width: auto');
    this.renderer2.setAttribute(descripcion,'align','justify');
    this.renderer2.setAttribute(descripcion, 'class', 'colorLetraOscura');
    this.renderer2.appendChild(div,descripcion);

    //color
    const div2 = this.renderer2.createElement('div');
    const colores = this.renderer2.createElement('div');
    const tituloColor = this.renderer2.createElement('h4');
    const textoTitulo = this.renderer2.createText('Color:');
    this.renderer2.appendChild(tituloColor,textoTitulo);
    this.renderer2.setAttribute(tituloColor, 'class', 'colorLetraOscura');
    this.renderer2.setAttribute(tituloColor, 'style', 'margin-bottom:5px; margin-right: 10px');

    const nombreColor = this.renderer2.createElement('h4');
    let contenidoColor = this.renderer2.createText(this.modeloSeleccionado.colores[0][1]);
    this.renderer2.appendChild(nombreColor,contenidoColor);
    this.renderer2.setAttribute(nombreColor, 'class', 'colorLetraOscura');
    this.renderer2.setAttribute(nombreColor, 'style', 'margin-bottom:5px; color:blue');

    for(let i = 0; i < this.modeloSeleccionado.colores.length; i++){
      // console.log('contenido colores', entry);
      const div3 = this.renderer2.createElement('div');
      this.renderer2.setAttribute(div3, 'style', 'background-color:'+this.modeloSeleccionado.colores[i][0]+'; border-radius:20px; width: 20px;height: 20px; cursor: pointer; margin: 5px;');
      this.renderer2.listen(div3, "click", event => {
        this.colorSeleccionado = i;
        this.colorModelo = this.modeloSeleccionado.colores[i][1];
        //console.log(this.colorModelo);
        this.renderer2.setValue(contenidoColor,this.modeloSeleccionado.colores[i][1]);
        for(let j = 0; j < this.modeloSeleccionado.imagenes.length; j++){
          if(this.modeloSeleccionado.colores[i][1] == this.modeloSeleccionado.imagenes[j]['color']){
            this.renderer2.setAttribute(img, "src", "assets/img/modelos/"+this.modeloSeleccionado.imagenes[j]['imagenes'][0]);
          }
        }

        if(this.modeloSeleccionado.imagenes[this.colorSeleccionado]['imagenes'].length <= 1){
          this.renderer2.setAttribute(flech1,'style','visibility:hidden');
          this.renderer2.setAttribute(flech2,'style','visibility:hidden');
        }
        else{
          this.renderer2.setAttribute(flech1,'style','visibility:visible');
          this.renderer2.setAttribute(flech1,'style','left: 5px');
          this.renderer2.setAttribute(flech2,'style','visibility:visible');
          this.renderer2.setAttribute(flech2,'style','right: 5px');
        }
      });
      this.renderer2.appendChild(colores, div3);
    }
   
    this.renderer2.appendChild(div2, tituloColor);
    this.renderer2.appendChild(div2,nombreColor);
    this.renderer2.setAttribute(colores, 'style', 'display:flex; margin-bottom: 20px');
    this.renderer2.setAttribute(div2, 'style', 'display:flex');
    this.renderer2.appendChild(div,div2);
    this.renderer2.appendChild(div,colores);

    //medidas
    const tituloTabla = this.renderer2.createElement('h4');
    const contenidoTT = this.renderer2.createText('Medidas');
    this.renderer2.setAttribute(tituloTabla, 'style', 'margin-bottom:5px');
    this.renderer2.setAttribute(tituloTabla, 'class', 'colorLetraOscura');
    this.renderer2.appendChild(tituloTabla,contenidoTT);
    this.renderer2.appendChild(div,tituloTabla);
    const tabla = this.renderer2.createElement('table');
    const thead = this.renderer2.createElement('thead');
    const tr = this.renderer2.createElement('tr');

    for(let i = 0; i < 4; i++){
      let th = this.renderer2.createElement('th');
      let contenido;
      if(i == 0){
        contenido = this.renderer2.createText('Alto');
        this.renderer2.appendChild(th, contenido);
        this.renderer2.appendChild(tr, th);
      }
      else if(i == 1){
        contenido = this.renderer2.createText('Ancho');
        this.renderer2.appendChild(th, contenido);
        this.renderer2.appendChild(tr, th);
      }
      else if(i == 2){
        contenido = this.renderer2.createText('Profundo');
        this.renderer2.appendChild(th, contenido);
        this.renderer2.appendChild(tr, th);
      }
      else if(i == 3){
        contenido = this.renderer2.createText('Peso');
        this.renderer2.appendChild(th, contenido);
        this.renderer2.appendChild(tr, th);
      }
    }

    const tbody = this.renderer2.createElement('tbody');
    const tr2 = this.renderer2.createElement('tr');

    for(let i = 0; i < 4; i++){
      const td = this.renderer2.createElement('td');
      let contenido;
      if(i == 0){
        contenido = this.renderer2.createText(this.modeloSeleccionado.medida_alto.toString()+"cm");
        this.renderer2.appendChild(td, contenido);
        this.renderer2.appendChild(tr2, td);
      }
      else if(i == 1){
        contenido = this.renderer2.createText(this.modeloSeleccionado.medida_ancho.toString()+"cm");
        this.renderer2.appendChild(td, contenido);
        this.renderer2.appendChild(tr2, td);
      }
      else if(i == 2){
        contenido = this.renderer2.createText(this.modeloSeleccionado.medida_largo.toString()+"cm");
        this.renderer2.appendChild(td, contenido);
        this.renderer2.appendChild(tr2, td);
      }
      else if(i == 3){
        contenido = this.renderer2.createText(this.modeloSeleccionado.peso.toString()+"kg");
        this.renderer2.appendChild(td, contenido);
        this.renderer2.appendChild(tr2, td);
      }
    }

    this.renderer2.appendChild(tbody,tr2);
    this.renderer2.appendChild(thead,tr);
    this.renderer2.appendChild(tabla,thead);
    this.renderer2.appendChild(tabla,tbody);
    this.renderer2.appendChild(div,tabla);
    this.renderer2.setAttribute(div, 'style', 'margin-left:10px; width: 250px;');
    this.renderer2.appendChild(div4,div);
    this.renderer2.appendChild(div5,div4);

    this.renderer2.appendChild(this.tarjetaModelo.nativeElement, div5);

  }

  mostrarMuebles(catalogo : any){
    this.catalogo.nativeElement.innerHTML = '';
    this.renderer2.setStyle(this.atras.nativeElement, 'display', 'flex');
    this.mostrar = true;
    // console.log('ABRO CATALOGO',catalogo);
    for(let entry of catalogo){
      const div = this.renderer2.createElement('div');
      const div2 = this.renderer2.createElement('div');

       //Imagen
       const img = this.renderer2.createElement('img');
       if(entry.imagen){
         this.renderer2.setAttribute(img, "src", "assets/img/modelos/"+entry.imagen);
       }
       else{
         this.renderer2.setAttribute(img, "src", "assets/img/noimage.jpg");
       }
       this.renderer2.setAttribute(img, "style", "width: 150px; height:110px;cursor:pointer");
       this.renderer2.listen(img, "click", event => {
        this.modeloSeleccionado = entry;
        this.infoModelo();
      });

        //Nombre
      const nombre = this.renderer2.createElement('p');
      const contenido = this.renderer2.createText(entry.nombre);
      this.renderer2.appendChild(nombre,contenido);
      this.renderer2.setAttribute(nombre,'class','tituloCatalogo');

      //Botón añadir
      const mas = this.renderer2.createElement('p');
      const contenido2 = this.renderer2.createText('+');
      this.renderer2.setAttribute(mas,'class','colorLetraOscura botonMas');
      // this.renderer2.setAttribute(contenido2,'style','background-color:white; color: black');
      this.renderer2.appendChild(mas,contenido2);

      this.renderer2.listen(mas, "click", event => {
        let modelo =entry.uid
        let x = 0;
        let y = 0;
        let z = 0;
        let rotacion = new Float32Array(16);
        this.arrayProyecto.muebles.push({modelo,x,y,z,rotacion});
        this.editarProyecto(this.uidProyecto, this.arrayProyecto);
        this.listaModelos.push(entry);      
        var max = this.listaModelos.length;
        //console.log('Long max: '+max);

        this.total += entry.precio;
        this.total_string = this.total.toFixed(2);
        if(this.colorModelo == ''){
          this.motorService.addObject(entry.archivo[0][1], max);
        }
        else{
          for(let i = 0; i < entry.archivo.length; i++){
            if(this.colorModelo == entry.archivo[i][0]){
              this.motorService.addObject(entry.archivo[i][1],max);
              break;
            }
          }
        }
      });
      
      this.renderer2.appendChild(div,img);
      this.renderer2.appendChild(div2,nombre);
      this.renderer2.appendChild(div2,mas);
      this.renderer2.appendChild(div,div2);
      this.renderer2.setAttribute(div,'class', 'divMuebleCatalogo');
      this.renderer2.setAttribute(div2,'style', 'display: flex; background-color: #BF9D82; justify-content: space-around;');
      this.renderer2.appendChild(this.catalogo.nativeElement, div); 

    }
  }

  tipoCatalogo(array: any, tipo: string){
    for(let entry of array){
      const div = this.renderer2.createElement('div');
      const div2 = this.renderer2.createElement('div');

      //Imagen
      const img = this.renderer2.createElement('img');
      if(entry.imagen){
        this.renderer2.setAttribute(img, "src", "assets/img/catalogos/"+entry.imagen);
      }
      else{
        this.renderer2.setAttribute(img, "src", "assets/img/noimage.jpg");
      }

      if(tipo == 'todos'){
        this.renderer2.setAttribute(img, "style", "filter: blur(1px) grayscale(1); width: 150px; height:110px");
        this.renderer2.setAttribute(div2,'style', 'display: flex; background-color: grey; justify-content: space-around;');

      }
      else if(tipo == 'usuario'){
        this.renderer2.setAttribute(img, "style", "width: 150px; height:110px");
        this.renderer2.setAttribute(div2,'style', 'display: flex; background-color: #BF9D82; justify-content: space-around;');
        this.renderer2.listen(div, "click", event => {
          this.abrirCatalogo(entry.uid);
        });
      }

      //Nombre
      const nombre = this.renderer2.createElement('p');
      const contenido = this.renderer2.createText(entry.nombre);
      this.renderer2.appendChild(nombre,contenido);
      this.renderer2.setAttribute(nombre,'class','tituloCatalogo');
      
      //Añado elementos al div
      this.renderer2.appendChild(div,img);
      this.renderer2.appendChild(div2,nombre);
      // this.renderer2.appendChild(div2,mas);
      this.renderer2.appendChild(div,div2);
      this.renderer2.setAttribute(div,'style', 'display: flex;flex-direction: column;width: max-content; margin: 10px; cursor: pointer');
      this.renderer2.appendChild(this.catalogo.nativeElement, div); 
    }
  }

  crearCatalogo(){
    this.arrayResto = JSON.parse(JSON.stringify(this.listaCatalogos));
    // this.arrayCatalogosUsuario = JSON.parse(JSON.stringify(this.listaCatalogos));
    for(let entry of this.listaCatalogos){
      for(let a = 0; a < this.arrayUidCatalogosUsuario.length; a++){
       //console.log("recorriendo catalogos usuario por "+this.arrayUidCatalogosUsuario[a]);
        if(this.arrayUidCatalogosUsuario[a] == entry.uid){
          this.arrayCatalogosUsuario.push(entry);
          this.arrayResto.forEach((element,index)=>{
            //si coincide con el array de catalogos del usuario lo borramos
            if(element.uid == this.arrayUidCatalogosUsuario[a]){
              this.arrayResto.splice(index,1,);
              // console.log("lo he borrado");
            }
          });
        }
      }
    }
  }

  cargarCatalogos(){
    let desde,textoB,tipo,orden,fini,ffin;
    this.catalogService.cargarCatalogos(desde,textoB,tipo,orden,fini,ffin,999)
    .subscribe(res =>{
      //console.log('catalogos son aca: '+ res['page']['catalogos'])
      this.listaCatalogos = res['page']['catalogos'];
      this.crearCatalogo();
    })
  }

  seleccionarCatalogo(){
    this.mostrar = false;
    this.renderer2.setStyle(this.cards.nativeElement, 'display', 'block');
    this.renderer2.setStyle(this.catalogo.nativeElement, 'display', 'flex');
    this.renderer2.setStyle(this.atras.nativeElement, 'display', 'none');
    this.arrayCatalogosUsuario = [];
    this.crearCatalogo();
    this.opcionLista.nativeElement.value = '';
    this.catalogo.nativeElement.innerHTML = '';
    this.tipoCatalogo(this.arrayCatalogosUsuario, 'usuario');
    this.tipoCatalogo(this.arrayResto, 'todos');

  }

  mostrarInfoProyecto(){
    this.renderer2.setStyle(this.info.nativeElement, 'display', 'block');
  }

  capturarCanvas(){
    // console.log('Capturo el canvas');
    this.sharedService.sendCaptura();
  }

  cargarProyectos(textoBuscar: string){
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.projectService.cargarProyectos(this.posicionactual, textoBuscar)
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
      // this.cargarTarjetas();
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);
      this.loading = false;
    });
  }

  editarProyecto(uid: string, datos: any ){
    this.projectService.editProject(uid, datos)
    .subscribe( res => {
      //  console.log('datos mandados', res);
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

 // aquí genera la factura y la abre en otra pestaña para que te la puedas bajar
  presupuestoPDF(){
    // console.log('llego a la factura');
    var headers = {
      fila_1:{
        col_1:{ text: 'Producto', style: 'tableHeader', alignment: 'center'},
        col_3:{ text: 'Catalogo', style: 'tableHeader', alignment: 'center' },
        col_4:{ text: 'Precio', style: 'tableHeader', alignment: 'center' },
      }
    }
    var tittle = 'Presupuesto - Proyecto ';
    var body = [];
    for (var key in headers){
      if (headers.hasOwnProperty(key)){
        var header = headers[key];
        var row = new Array();
        row.push( header.col_1 );
        row.push( header.col_3 );
        row.push( header.col_4 );
        body.push(row);
      }
    }
    for (let a = 0; a < this.listaModelos.length; a++){
      var row = new Array();
      row.push(this.listaModelos[a].nombre );
      row.push( this.listaModelos[a].nombre_catalogo);
      row.push( this.listaModelos[a].precio+' €' );
      body.push(row);
      if(a == this.listaModelos.length-1){
        this.total_string = String(this.total.toFixed(2));
        var row2 = new Array('','Total',this.total_string +' €');
        body.push(row2);
      }
    }

    var pdfDefinition = {
      pageMargins: [40,155,40,55],
      pageOrientation: 'landscape',
      header: function() {
        return {
          margin: 40,
          columns: [
            {
              },
              { text:tittle, 
                  alignment: 'left',bold:true,margin:[-300,10,0,0],fontSize: 24},
                {
                // in browser is supported loading images via url from reference by name in images
                  image: 'logo',
                  width: 50,
                  height: 50
            },
          ]
        }
      },
      footer: function(currentPage, pageCount) {
          return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'center',margin:[0,30,0,0] };
      },
      content: [
        {
          style: 'tableExample',
          table: {
              widths: [ 100, 100, 100],
              headerRows: 2,
              // keepWithHeaderRows: 1,
              body: body
          }
        },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
        { text: '                                                                                                                                                                                                                           ', style: 'header' },
      ],
        images: { // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
          logo: 'https://pbs.twimg.com/profile_images/1486796836488765445/AzWQYyzS_400x400.jpg'
        },
      styles: {
        header: {
          fontSize: 20,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        }
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }


  seleccionobj(index:number,nom){
    index = index+1; // ponemos el 1 por que el plano ocupa la posicion 0 en el array de obj del motor
    // console.log('Selecciono el indice: '+index);
    //this.motorService.getPosition(index);
    //console.log('Nombre del obj: '+nom);
    this.motorService.selectObject(index);
  }


  logout() {
    this.usuarioService.logout();
  }

  user(){
    var contenedor = document.getElementById("OtroTema");
    contenedor.style.display = "block";
  }

  onModalPresupuesto(){
    this.renderer2.setStyle(this.presupuesto.nativeElement, 'display', 'block');
  }
  
  offModal(ventana: string){
    switch(ventana){
      case 'catalogo':
        this.renderer2.setStyle(this.catalogo.nativeElement, 'display', 'none');
        this.renderer2.setStyle(this.cards.nativeElement, 'display', 'none');
        break;
      case 'comments':
        this.renderer2.setStyle(this.comments.nativeElement, 'display', 'none');
        break;
      case 'info':
        this.renderer2.setStyle(this.info.nativeElement, 'display', 'none');
        break;
      case 'presupuesto':
        this.renderer2.setStyle(this.presupuesto.nativeElement, 'display', 'none');
        break;
      case 'infoModelo':
        this.renderer2.setStyle(this.tarjetaModelo.nativeElement, 'display', 'none');
        break;
      case 'filtros':
        this.renderer2.setStyle(this.filtros.nativeElement, 'display', 'none');
        break;
      case 'notification':
        this.isShown = false;
        this.renderer2.setStyle(this.notification.nativeElement, 'display', 'none');
        break;
      case 'guardado':
        this.renderer2.setStyle(this.seccionGuardar.nativeElement, 'display', 'none');
        break;
      case 'historico':
        this.renderer2.setStyle(this.historico.nativeElement, 'display', 'none');
        break;
      case 'controles':
        this.renderer2.setStyle(this.seccionControl.nativeElement, 'display', 'none');
        break;
    }
  }
   
  offModal2(ventana: string){
    let map = new Map();
    map.set('comments', this.comments.nativeElement);
    map.set('info', this.info.nativeElement);
    map.set('presupuesto',this.presupuesto.nativeElement);
    map.set('infoModelo', this.tarjetaModelo.nativeElement);
    map.set('filtros', this.filtros.nativeElement);
    // console.log('ventana',ventana);
    if(ventana != 'catalogo'){
      this.renderer2.setStyle(this.catalogo.nativeElement, 'display', 'none');
      this.renderer2.setStyle(this.cards.nativeElement, 'display', 'none');
      this.renderer2.setStyle(this.tarjetaModelo.nativeElement, 'display', 'none');
      this.renderer2.setStyle(this.filtros.nativeElement, 'display', 'none');
    }
    for (let entry of Array.from(map.entries())) {
      if(ventana != entry[0]){
        this.renderer2.setStyle(entry[1], 'display', 'none');
      }
      // console.log(entry[0], entry[1]); 
    }
  }

  gestorProyectos(){
    this.router.navigateByUrl(`/gestor-proyectos?proyecto=${this.uidProyecto}`);
  }
}
