import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators  } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import $ from "jquery";

//para hacer el pdf
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { PagoService } from 'src/app/services/pago.service';
import { pagoForm} from '../../interfaces/pago-form.interface';
import { Payment } from '../../models/payment.model';
import { environment } from '../../../environments/environment';

@Component({
  
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],

})

export class PerfilComponent implements OnInit {
  uid_1: any;
  switchModal: boolean;
  switchModal2: boolean;
  pagos: pagoForm[];
  periodoIni: String;
  periodoFin: String;
  imagenUrl: string = '';
  numRecibo = 0;
  fechaActual: any;
  planRecibo: String;
  subtotalRecibo: any;
  totalIVA: any;
  iva: any;
  precio:any;
  periodoini:any;
  nombreCompanyia: String;
  activado = false;
  switchModal3: boolean;
  uid: string;
  formSubmit = false;
  creacion: any;
  inicio: any;
  fin: any;
  fIni: any;
  fFin: any;
  orden = 'Descendente';
  tipo = 'fechaC';
  pestanya:string;
  proyectoUid:string;
  paso = 'facturacion';
  
  public listaCatalogos: Payment[] = [];

  public ultimaBusqueda = '';
  public totalcpagos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaPagos: Payment[] = [];

  public showOKP = false;
  public showOKD = false;
  public showOKplan = false;
  public foto: File = null;
  public fileText = 'Seleccione archivo';
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public plan = '';
  public plan_cambio = '';
  public perfil = 'perfil';
  public estadisticas = 'estadisticas';
  public facturas = 'facturas';
  public planes = 'planes';

  public nom = '';
  public correo = '';
  public companya = '';
  public apellidos = '';
  public dir = '';
  public nif = '';
  public tlfn = '';
  public plan_usu = '';
  public precio_usu = '';


  @ViewChild('modulo') modulo: ElementRef;

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
  
public datosPassword = this.fb.group({
  password: ['', Validators.required ],
  nuevopassword: ['', Validators.required ],
  nuevopassword2: ['', Validators.required ]
});

public pagoForm = this.fb.group({
  //con corchetes si son varias condiciones
  // id_modelo: ['' , []],
  companyia: ['', Validators.required],
  plan: ['', Validators.required],
  periodoIni: ['', Validators.required],
  periodoFin: ['', Validators.required,],
  precio: ['', Validators.required],
  fechaC: [''],
  fecha: ['']
});


listenerFn: () => void;
@ViewChild('archivoPDF') archivoPDF: ElementRef;


constructor(
  private renderer2: Renderer2,
  private usuarioService: UsuarioService,
  private pagoService: PagoService,
  private fb: FormBuilder,
  private router: Router,
  private rutaActiva: ActivatedRoute)
  {}


  ngOnInit(): void {

    
    this.rutaActiva.queryParams.subscribe(
      params => {
        this.pestanya =  params['pestanya'];
        this.proyectoUid =  params['proyecto'];
      }
    )
  
    // console.log('La pestanya es: ',this.pestanya);
    this.cargarUsuario();
    this.cargarPagos();
    this.Seleccionseccion(this.pestanya);
  }


  darBaja(){
    
    Swal.fire({
      title: 'Eliminar Usuario',
      text: `El usuario se eliminará permanentemente. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: 'Cancelar',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.usuarioService.borrarUsuario(this.usuarioService.uid)
            .subscribe( res => {
              //console.log(res);
              Swal.fire({
                text: `Ha sido dado de baja correctamente`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              }).then((result) => {  
                  if (result.value) {
                    this.router.navigateByUrl(`/landing`);
                  }
              });
              // Swal.fire('Ha sido dado de baja correctamente'){}
            }, (err) => {
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              // console.warn('error:', err);
            });

          }
      });


  }

  atras(){
    this.router.navigateByUrl(`/home?proyecto=${this.proyectoUid}`);
  }

  sendit(data){
    let passcheck = document.getElementById("passcheck");
    // console.log("Value",data)
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
     if (false == enoughRegex.test(data)) {
             $('#passstrength').html('Más caracteres.');
     } else if (strongRegex.test(data)) {
             $('#passstrength').className = 'ok';
             $('#passstrength').html('Fuerte!');
     } else if (mediumRegex.test(data)) {
             $('#passstrength').className = 'alert';
             $('#passstrength').html('Media!');
     } else {
             $('#passstrength').className = 'error';
             $('#passstrength').html('Débil!');
     }
     if(data == ""){
      passcheck.style.display = "none"
     }
     else{
      passcheck.style.display = "inline"
     }
 }

  keyFunc(valor) {
    //let value = document.getElementById("pass")[1].value;
    //var confirmPassword = $("#txtConfirmPassword").val();
    let passcheck = document.getElementById("passcheck");
   // passcheck.style.display = "none"
    // console.log('tengo esto '+ valor)
    // console.log('el valor es '+ valor.getAttribute('value'))
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
     if (false == enoughRegex.test($(this).val())) {
             $('#passstrength').html('Más caracteres.');
     } else if (strongRegex.test($(this).val())) {
             $('#passstrength').className = 'ok';
             $('#passstrength').html('Fuerte!');
     } else if (mediumRegex.test($(this).val())) {
             $('#passstrength').className = 'alert';
             $('#passstrength').html('Media!');
     } else {
             $('#passstrength').className = 'error';
             $('#passstrength').html('Débil!');
     }
     if(valor.getAttribute('value') == ""){
      passcheck.style.display = "none"
     }
     else{
      passcheck.style.display = "inline"
     }
  }


  Seleccionseccion(elemento){
   let perfil = document.getElementById("perfil");
   let estadisticas = document.getElementById("estadisticas");
   let contraseña = document.getElementById("contraseña");
   let plan = document.getElementById("plan");
   let factura = document.getElementById("factura");
   let contraseñacard =document.getElementById("contraseñacard");
   let estadisticascard =document.getElementById("estadisticascard");
   let passcheck = document.getElementById("passcheck");
   let perfilcard =document.getElementById("perfilcard");
   let plancard = document.getElementById("plancard");
   let facturacard = document.getElementById("facturacard");
   
    //e.style.background = "#528580";
    passcheck.style.display = "none"
    if(elemento == "perfil"){
      estadisticas.style.background = "#E3E3E3";
      perfil.style.background = "#FFFFFF";
      contraseña.style.background = "#E3E3E3";
      plan.style.background = "#E3E3E3";
      factura.style.background = "#E3E3E3"
      estadisticascard.style.display = "none"
      perfilcard.style.display = "inline"
      contraseñacard.style.display = "none"
      plancard.style.display="none";
      facturacard.style.display="none";
    
    }else{
      if(elemento == "contraseña"){
      estadisticas.style.background = "#E3E3E3";
      perfil.style.background = "#E3E3E3";
      contraseña.style.background = "#FFFFFF";
      plan.style.background = "#E3E3E3";
      factura.style.background = "#E3E3E3"
      estadisticascard.style.display = "none"
      perfilcard.style.display = "none"
      contraseñacard.style.display = "inline"
      facturacard.style.display="none";
      plancard.style.display="none";
    
    } else {
      if(elemento == "plan"){
        estadisticas.style.background = "#E3E3E3";
        perfil.style.background = "#E3E3E3";
        contraseña.style.background = "#E3E3E3";
        plan.style.background = "#FFFFFF";
        factura.style.background = "#E3E3E3"
        estadisticascard.style.display = "none"
        perfilcard.style.display = "none"
        contraseñacard.style.display = "none"
        facturacard.style.display="none";
        plancard.style.display="inline";
      } else{
        if(elemento == "factura"){
          estadisticas.style.background = "#E3E3E3";
          perfil.style.background = "#E3E3E3";
          contraseña.style.background = "#E3E3E3";
          plan.style.background = "#E3E3E3";
          factura.style.background = "#FFFFFF"
          estadisticascard.style.display = "none"
          perfilcard.style.display = "none"
          contraseñacard.style.display = "none"
          facturacard.style.display="inline";
          plancard.style.display="none";
    
        }else {
          if(elemento == "estadisticas"){
    
            estadisticas.style.background = "#FFFFFF";
            perfil.style.background = "#E3E3E3";
            contraseña.style.background = "#E3E3E3";
            plan.style.background = "#E3E3E3";
            factura.style.background = "#E3E3E3"
            perfilcard.style.display = "none"
            contraseñacard.style.display = "none"
            estadisticascard.style.display = "inline"
            facturacard.style.display="none";
            plancard.style.display="none";
            }
          }
        }
      }
    }
    

    let css_plan = document.getElementById(this.plan).querySelectorAll('td');
      for(let i=0; i<css_plan.length; i++ ){
        css_plan[i].style.background = "#c5c4c4";
      }
  }

  cargarUsuario():void {
   // this.datosForm.get('company').setValue(this.usuarioService.company);
    // console.log("El usuario service es" + this.usuarioService.uid)
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
        this.plan = res['clientes']['plan'];


      this.nom = this.usuarioService.nombre;
      this.correo = this.usuarioService.email;
      this.companya = this.usuarioService.company;
      this.apellidos = this.usuarioService.apellidos;
      this.dir = res['clientes']['direccion'];
      this.nif = res['clientes']['nif'];
      this.tlfn = res['clientes']['telefono'];
      if(res['clientes']['plan']=="GRATUITO"){
        this.plan_usu = " Gratuito";
        this.precio_usu = '0€';
      }
      else{
        if(res['clientes']['plan']=="PREMIUM-MENSUAL"){
          this.plan_usu = "  Premiun mensual";
            this.precio_usu = '30€';
        }
        else{
          if(res['cliente']['plan']=="BASICO-MENSUAL"){
            this.plan_usu = " Básico mensual";
            this.precio_usu = '11,99€';
          }
          else
          if(res['cliente']['plan']=="PREMIUM-MENSUAL"){
            this.plan_usu = " Premium mensual";
            this.precio_usu = '256€';
          }
          else{
            if(res['cliente']['plan']=="BASICO-ANUAL"){
              this.plan_usu = " Básico anual";
              this.precio_usu = '119,99€';
            }
        }
      }
      }

      }, (err) => {
      
    const errtext = err.error.msg || 'No se pudo cargar la imagen';
    Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    return;
  });
  
  this.datosForm.get('imagen').setValue('');
  this.imagenUrl = this.usuarioService.imagenURL;
  this.foto = null;
  this.fileText = 'Seleccione archivo';
  this.datosForm.markAsPristine();
  }

  // Actualizar password
  cambiarPassword(): void {
    this.sendpass = true;
    this.showOKP = false;
    if (this.datosPassword.invalid || this.passwordNoIgual()) {
      // console.log('los datos no son correctos y no se ha podido actualizar'); 
      return; }
    this.usuarioService.cambiarPassword( this.usuarioService.uid, this.datosPassword.value ).subscribe( res => {
      this.showOKP = true;
      this.datosPassword.markAsPristine();
      // console.log('se ha actualizado la contraseña');
    }, (err) => {
        const errtext = err.error.msg || 'No se pudo cambiar la contraseña';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
    });
  }

  cambioImagen( evento ): void {
    // console.log('Entro a cambioImagen')
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen').markAsPristine();
          // console.log(this.datosForm);
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]); 
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => { 
        this.imagenUrl = event.target.result.toString();
        this.fileText = nombre;
      };
    } else {
      // console.log('no llega target:', event);
    }
  }

  enviar(): void {
    // if (this.datosForm.invalid) { 
    //   console.log('DATOS MAL' + this.datosForm.value);
    //   return; }
    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.usuarioService.actualizarUsuario( this.usuarioService.uid, this.datosForm.value ).subscribe( res => {
    
      this.usuarioService.establecerdatos( res['cliente'].nombre, 
                                           res['cliente'].apellidos, 
                                           res['cliente'].email, 
                                           res['cliente'].direccion, 
                                           res['cliente'].telefono, 
                                           res['cliente'].nif, 
                                           res['cliente'].company,
                                           res['cliente'].plan);

                                           
      this.nom = res['cliente'].nombre;
      this.correo = res['cliente'].email;
      this.companya = res['cliente'].company;
      this.apellidos = res['cliente'].apellidos;
      this.dir = res['cliente'].direccion;
      this.nif = res['cliente'].nif;
      this.tlfn = res['cliente'].telefono;
      if(res['cliente'].plan=="GRATUITO"){
        this.plan_usu = " Gratuito";
        this.precio_usu = '0€';
      }
      else{
        if(res['cliente'].plan=="PREMIUM-MENSUAL"){
          this.plan_usu = "  Premiun mensual";
            this.precio_usu = '30€';
        }
        else{
          if(res['cliente'].plan=="BASICO-MENSUAL"){
            this.plan_usu = " Básico mensual";
            this.precio_usu = '11,99€';
          }
          else
          if(res['cliente'].plan=="PREMIUM-MENSUAL"){
            this.plan_usu = " Premium mensual";
            this.precio_usu = '256€';
          }
          else{
            if(res['cliente'].plan=="BASICO-ANUAL"){
              this.plan_usu = " Básico anual";
              this.precio_usu = '119,99€';
            }
        }
      }
      }
      
      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto) {
        this.usuarioService.subirFoto(this.usuarioService.uid, this.foto).subscribe( res => {
        // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
        this.usuarioService.establecerimagen(res['cliente'].imagen);
        // cambiamos el DOM el objeto que contiene la foto
        document.getElementById('fotoperfilnavbar').setAttribute('src', this.usuarioService.imagenURL);}, (err) => {
          const errtext = err.error.msg || 'No se pudo cargar la imagen';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }

      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
        
      this.showOKD = true;
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    });
  }  

  campoNoValido( campo: string): boolean {
    return this.datosForm.get(campo).invalid;
  }

  campopNoValido( campo: string): boolean {
    return this.datosPassword.get(campo).invalid && this.sendpass;
  }

  campoplanNoValido( campo: string): boolean {

    return this.plan== campo ;
  }

  cancelarPassword() {
    this.sendpass = false;
    this.showOKP = false;
    this.datosPassword.reset();
  }
    // Comprobar que los campos son iguales
  passwordNoIgual(): boolean {
      return !(this.datosPassword.get('nuevopassword').value === this.datosPassword.get('nuevopassword2').value) && this.sendpass;
  }

  cambio_valor_plan(valor: string){
      this.plan_cambio = valor;
      
      let gratuito = document.getElementById('GRATUITO').querySelectorAll('td');
      for(let i=0; i<gratuito.length; i++ ){
        gratuito[i].style.background = "#e3e3e3";
        gratuito[i].style.height = "60px";
        
      }
      let mesbasico = document.getElementById('BASICO-MENSUAL').querySelectorAll('td');
      for(let i=0; i<gratuito.length; i++ ){
        mesbasico[i].style.background = "#e3e3e3";
      }
      let mespremium = document.getElementById('PREMIUM-MENSUAL').querySelectorAll('td');
      for(let i=0; i<gratuito.length; i++ ){
        mespremium[i].style.background = "#e3e3e3";
      }
      let anyobasico = document.getElementById('BASICO-ANUAL').querySelectorAll('td');
      for(let i=0; i<gratuito.length; i++ ){
        anyobasico[i].style.background = "#e3e3e3";
      }
      let anyopremium = document.getElementById('PREMIUM-ANUAL').querySelectorAll('td');
      for(let i=0; i<gratuito.length; i++ ){
        anyopremium[i].style.background = "#e3e3e3";
      }
     // if(valor != this.plan){
        let css_plan = document.getElementById(valor).querySelectorAll('td');
        for(let i=0; i<css_plan.length; i++ ){
          css_plan[i].style.background = "#c5c4c4";
        }

        if(this.plan =='BASICO'){
          css_plan[0].style.height = "30px";
        }
      //}
      
  }

  cambiarplan(){
    
  this.plan = this.plan_cambio;
 
  this.renderer2.setStyle(this.modulo.nativeElement,'display','block');
  let siguiente = document.getElementById('siguiente');
  let facturacion = document.getElementById('facturacion');
  facturacion.style.color = "#32b1a8";
  this.paso = 'facturacion';
  let anterior = document.getElementById('anterior');
  anterior.style.background = '#b3aa9f';
  siguiente.style.background = '#d3a66a';
  anterior.style.opacity = "0";
  let confirmacion = document.getElementById('confirmacion');
  confirmacion.style.color = "#222a42";
  
}

  pasarela(accion :string){
    let anterior = document.getElementById('anterior');
    let siguiente = document.getElementById('siguiente');
    
    let facturacion = document.getElementById('facturacion');
    let metodo = document.getElementById('metodo');
    let confirmacion = document.getElementById('confirmacion');

    let paso1 = document.getElementById('paso1');
    let paso2 = document.getElementById('paso2');
    let paso3 = document.getElementById('paso3');

    if(accion == "anterior"){
      if(this.paso == 'metodo'){
        this.paso = 'facturacion';
        anterior.style.background = '#b3aa9f';
        anterior.style.opacity = "0";
        siguiente.style.background = '#d3a66a';
        paso1.style.display="block";
        paso2.style.display="none";
        paso3.style.display="none";
      }else{
        if(this.paso == 'confirmacion'){
          this.paso = 'metodo';
          anterior.style.opacity = "1";
          anterior.style.background = '#d3a66a';
          siguiente.style.background = '#d3a66a';
          paso1.style.display="none";
          paso2.style.display="block";
          paso3.style.display="none";
        }
      }
      
      // si estoy en el paso metodo y le doy a anterior no ocurre nada
    }
    else{
      if(this.paso == 'metodo'){
        this.paso = 'confirmacion';
        anterior.style.opacity = "1";
        anterior.style.background = '#d3a66a';
        siguiente.style.background = '#d3a66a';
        paso1.style.display="none";
        paso2.style.display="none";
        paso3.style.display="block";
      }
      else{
        if(this.paso == 'facturacion'){
          this.paso = 'metodo';
          anterior.style.opacity = "1";
          anterior.style.background = '#d3a66a';
          siguiente.style.background = '#d3a66a';
          paso1.style.display="none";
          paso2.style.display="block";
          paso3.style.display="none";
          this.enviar();
        }
        else{
          if(this.paso == 'confirmacion'){
            this.datosForm.get('plan').setValue(this.plan);
            this.enviar();
            this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
            Swal.fire('Tu plan ha sido actualizado');
            
          }
        }
      }
    }
    let paso = document.getElementById(this.paso);
    facturacion.style.color = "#222a42";
    metodo.style.color = "#222a42";
    confirmacion.style.color = "#222a42";
    paso.style.color = "#32b1a8";

  }


cargarPagos() {
  this.pagoService.cargarPagosCliente( this.posicionactual,  this.usuarioService.uid)
  .subscribe( res => {
    // console.log(res);
    if (res['pagos'].length === 0) {
      if (this.posicionactual > 0) {
        this.posicionactual = this.posicionactual - this.registrosporpagina;
        if (this.posicionactual < 0) { this.posicionactual = 0};
        this.cargarPagos();
      } else {
        this.listaPagos = [];
        this.totalcpagos = 0;
      }
    } else {
      this.listaPagos = res['pagos'];
      // console.log('Lista de pagos: ');
        // console.log(this.listaPagos);
      //console.log(res['page']);
      this.totalcpagos = res['page'].total;
      // console.log(this.totalcpagos);
    }
  }, (err) => {
    Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
    // console.warn('error:', err);
});
}

cargarPago(id_project){
  let uid = this.usuarioService.uid;
  this.pagoService.cargarPago2(uid,id_project)
  .subscribe(res => {
    // console.log(res);
    
    this.nombreCompanyia = res['pago'].nombre_companyia;
      this.planRecibo = res['pago'].plan;
      this.subtotalRecibo = (res['pago'].precio - 15/100*(res['pago'].precio)).toString() +' €';
      this.iva = (0.21*(res['pago'].precio))+' €';
      this.totalIVA = (Math.floor(parseInt(res['pago'].precio) * 100) / 100).toFixed(2); 
      this.precio =res['pago'].precio + ' €';
      this.periodoini =res['pago'].periodoIni;
      // console.log('los datos a mostrar son: '+ this.nombreCompanyia+ ' '+ this.planRecibo + ' '+ this.fechaActual+ ' '+ this.precio+ ' '+ this.totalIVA + ' '+ this.subtotalRecibo)
  }, (err) => {
    console.warn('Error respuesta api');
  });
}

// aqui se llama a la primera funcion y se espera 2 segundos y despues 
// genera la factura
createPDF = async function(uid: string) {
  // console.log('async function called');
  this.uid_1 = uid;
  const first_promise= await this.first_function();
  // console.log("After awaiting for 2 seconds," +
  // "the promise returned from first function is:");
  // console.log(first_promise);
    
  this.pago()
}

// aqui se llama a cargar pago para seleccionar los datos de la factura que quiere imprimir
// hacemos una espera de 2 segundos para que se complete la petición 
// y asi se guarden los datos
 first_function = function() {

  //console.log(this.uid_1);
  let  pago = this.cargarPago(this.uid_1);
  // console.log(pago);
  return new Promise(resolve => {
      setTimeout(function() {
        resolve("\t\t This is second promise");
        // console.log("Returned second promise");
      }, 2000);
    });
  };

 // aquí genera la factura y la abre en otra pestaña para que te la puedas bajar
 pago(){
   // console.log('llego aqui');
    this.fechaActual = new Date();
    var dd = String(this.fechaActual.getDate()).padStart(2, '0');
    // console.log('año',dd);
    var mm = String(this.fechaActual.getMonth() + 1).padStart(2, '0');
    // console.log('año',mm);
    var yyyy = this.fechaActual.getFullYear();
    // console.log('año',yyyy);
    this.fechaActual = dd + '/' + mm + '/' + yyyy;
    // console.log('fecha definitiva', this.fechaActual);
    // console.log('los datos a mostrar son: '+ this.nombreCompanyia+ ' '+ this.planRecibo + ' '+ this.fechaActual+ ' '+ this.precio+ ' '+ this.totalIVA + ' '+ this.subtotalRecibo)
   
    var headers = {
      fila_1:{
          col_6:{ text: 'Total', style: 'tableHeader', alignment: 'center'},
          col_1:{ text: 'Plan', style: 'tableHeader', alignment: 'center' },
          col_2:{ text: 'Fecha emisión', style: 'tableHeader', alignment: 'center' }, 
          col_3:{ text: 'Precio', style: 'tableHeader', alignment: 'center' },
          col_4:{ text: 'IVA', style: 'tableHeader', alignment: 'center' },
          col_5:{ text: 'Total', style: 'tableHeader', alignment: 'center'}
      }
  }
  var rows = {
      a: {
          empresa:  this.nombreCompanyia,
          plan:  this.planRecibo,
          f_emision: this.fechaActual,
          precio: this.precio,
          iva: this.totalIVA,
          valor: this.subtotalRecibo
      }
  }
  
  var body = [];
  for (var key in headers){
      if (headers.hasOwnProperty(key)){
          var header = headers[key];
          var row = new Array();
          row.push( header.col_6 );
          row.push( header.col_1 );
          row.push( header.col_2 );
          row.push( header.col_3 );
          row.push( header.col_4 );
          row.push( header.col_5 );
          body.push(row);
      }
  }
  for (var key in rows) 
  {
      if (rows.hasOwnProperty(key))
      {
          var data = rows[key];
          var row = new Array();
          row.push( data.empresa.toString() );
          row.push( data.plan.toString() );
          row.push( data.f_emision.toString()  );
          row.push( data.precio.toString()  );
          row.push( data.iva.toString() );
          row.push( data.valor.toString() );
          body.push(row);
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
                      { text:['Recibo'], 
                         alignment: 'left',bold:true,margin:[-300,80,0,0],fontSize: 24},
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
                      widths: [ '*', '*', '*', '*', '*', '*' ],
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
              { qr: 'https://mobbler.ovh/' }],
              images: { // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
                logo: 'https://pbs.twimg.com/profile_images/1486796836488765445/AzWQYyzS_400x400.jpg'
              },
          styles: {
              header: {
                  fontSize: 28,
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

cambiarPagina( pagina: number ){
  pagina = (pagina < 0 ? 0 : pagina);
  this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  this.cargarPagos();
}

offModal(){
  //Para quitar el formulario nuevo catalogo
  this.renderer2.setStyle(this.modulo.nativeElement,'display','none');
  this.datosForm.reset();
}

}