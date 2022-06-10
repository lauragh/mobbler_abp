import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PagoService } from 'src/app/services/pago.service';
import { pagoForm} from '../../../interfaces/pago-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Payment } from '../../../models/payment.model';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  switchModal: boolean;
  switchModal2: boolean;
  pagos: pagoForm[];
  periodoIni: String;
  periodoFin: String;
  numRecibo = 0;
  fechaActual: any;
  planRecibo: String;
  subtotalRecibo: number;
  totalIVA: any;
  iva: any;
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
  tipo = 'fecha';

  public ultimaBusqueda = '';
  public loading = true;
  public totalcpagos = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaPagos: Payment[] = [];


  listenerFn: () => void;

  ngOnInit(): void {
    this.cargarPagos(this.ultimaBusqueda);
    this.fechaActual = "";
    this.planRecibo = "";
    this.subtotalRecibo = 0;
  }

  @ViewChild('archivoPDF') archivoPDF: ElementRef;
  @ViewChild('ordenacion') ordenacion: ElementRef;
  @ViewChild('fechaIni') fechaIni: ElementRef;
  @ViewChild('fechaFin') fechaFin: ElementRef;
  @ViewChild("titulo") title: ElementRef;


  public pagoForm = this.fb.group({
    //con corchetes si son varias condiciones
    // id_modelo: ['' , []],
    companyia: ['',],
    nombre_companyia: ['',],
    plan: ['', Validators.required],
    periodoIni: ['', Validators.required],
    periodoFin: ['', Validators.required,],
    precio: ['', Validators.required],
    fechaC: [''],
    fecha: ['']
  })

  constructor(private renderer2: Renderer2,
              private pagoService: PagoService,
              private fb: FormBuilder,
              private usuarioService: UsuarioService){}


  cargarDatos(uid: string){
    this.pagoService.cargarPago(uid)
    .subscribe( res =>
      {
        // console.log('esto es lo que busco',res['pago']);
        this.pagoForm.get('companyia').setValue(res['pago'].companyia);
        this.pagoForm.get('nombre_companyia').setValue(res['pago'].nombre_companyia);
        this.pagoForm.get('plan').setValue(res['pago'].plan);
        // console.log(res['pago'].periodoIni);
        this.pagoForm.get('periodoIni').setValue(this.convertFecha(res['pago'].periodoIni));
        this.pagoForm.get('periodoFin').setValue(this.convertFecha(res['pago'].periodoFin));
        this.pagoForm.get('fechaC').setValue(res['pago'].fechaC);
        // this.pagoForm.get('periodoIni').setValue( this.convertFecha(res['pago'].periodoIni));
        // this.pagoForm.get('periodoFin').setValue( this.convertFecha(res['pago'].periodoFin));
        this.pagoForm.get('precio').setValue(res['pago'].precio);
      });
  }

  onSubmit(accion: string){
    if(accion === 'Crear'){
      this.crearPago();
    }
    else if(accion === 'Editar'){
      this.actualizarPago();
    }
  }

  crearPago(){
    this.title.nativeElement.innerHTML = 'Nuevo Pago';
    this.switchModal3 = true;
    this.formSubmit = true;
    if(!this.pagoForm.valid){
      console.warn('Error, faltan campos');
    }
    //console.log(this.pagoForm);
    this.pagoService.addPago(this.pagoForm.value).subscribe(res => {
      //console.log(res);
      this.offModal3();
    },(err) => {
      console.warn('Error respuesta api');
    });
  }

  actualizarPago(){
    this.formSubmit = true;
    //console.log(this.modeloForm);
    if(!this.pagoForm.valid){
      console.warn('Error, faltan campos');
    }
    this.pagoForm.get('fecha').setValue(new Date());
    this.pagoService.actualizarPago( this.pagoForm.value, this.uid)
    .subscribe( res => {
      // console.log('envio esto',this.pagoForm.value);
      this.pagoForm.markAsPristine();
      this.cargarPagos(this.ultimaBusqueda);
      this.offModal3();
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
      // console.warn('Error respuesta api');
    });
  }

  edit(uid: string){
    this.switchModal3 = true;
    this.uid = uid;
    this.cargarDatos(uid);
  }

  // convertFechaES(fecha: string){
  //   let cadena = fecha.split('T');
  //   cadena = fecha.split('-');
  //   return cadena[2] + "-" + cadena[1] + "-" + cadena[0];
  // }

  convertFecha(fecha: String){
    let cadena = fecha.split('T');
    cadena = cadena[0].split("-");
    return cadena[0] + "-" + cadena[1] + "-" + cadena[2];
  }

  borrarFechas(texto: string){
    this.inicio = '';
    this.fin = '';
    this.fIni = '';
    this.fFin = '';
    this.cargarPagos(texto);
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

  cargoPF(){
    this.inicio = this.fechaIni.nativeElement.value;
    this.fin = this.fechaFin.nativeElement.value;
    this.fIni = this.convertFechaMongo(this.fechaIni.nativeElement.value, 'inicio');
    this.fFin = this.convertFechaMongo(this.fechaFin.nativeElement.value, 'fin');
    // console.log('Las fechas son: ',this.fIni, this.fFin);
    this.cargarPagos(this.ultimaBusqueda);
  }

  ordenar(tipo: string, orden: string){
    this.tipo = tipo;
    this.orden = orden;
    this.cargarPagos(this.ultimaBusqueda);
  }

  cargarPagos(texto: string) {
    this.ultimaBusqueda = texto;
    // console.log('Esta es la busqueda: ',this.ultimaBusqueda);
    // console.log('Posición actual: '+ this.posicionactual);
    this.pagoService.cargarPagos( this.posicionactual, this.ultimaBusqueda, this.tipo, this.orden, this.fIni, this.fFin)
    .subscribe( res =>
      {
      // console.log('Datos',res);
      this.pagos = res['pagos'];
      if (res['pagos'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarPagos(this.ultimaBusqueda);
        } else {
          this.listaPagos = [];
          this.totalcpagos = 0;
          Swal.fire({icon: 'warning', title: 'Oops...', text: 'No se han encontrado resultados en la BBDD'});
        }
      } else {
        this.listaPagos = res['pagos'];
        // console.log(res['page']);
        this.totalcpagos = res['page'].total;
      }

    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      // console.warn('error:', err);

  });
  }


  cargarPago(uid: string){
    this.pagoService.cargarPago(uid)
    .subscribe(res => {
      // console.log(res);
      this.nombreCompanyia = res['pago'].nombre_companyia;
        this.planRecibo = 'Plan ' + res['pago'].plan;
        this.subtotalRecibo = res['pago'].precio - 15/100*(res['pago'].precio);
        this.iva = 15/100*(res['pago'].precio);
        this.totalIVA = (Math.floor(parseInt(res['pago'].precio) * 100) / 100).toFixed(2); 
    }, (err) => {
      console.warn('Error respuesta api');
    });
  }

  generacionPDF(){
    //Generación recibo
    const doc = new jsPDF('p', 'pt', 'a4');
    const img = new Image();
    
    doc.html(this.archivoPDF.nativeElement, {
      html2canvas: {
        scale: 0.7,
        y: 1030
      },
      //top left bot right
      margin: [0,10,-100,10],
      callback: function (doc) {
        doc.save('recibo.pdf');
      }
   });
  }

  checkInOut(){
    this.listenerFn = this.renderer2.listen('window', 'click', (e: Event) =>{
      if( this.archivoPDF.nativeElement.contains(e.target)) {
        // console.log('dentro');
      }
      else {
        // console.log('fuera');
        this.offModal2();
        this.listenerFn();
      }
    });
  }

  descargar(uid: string){
    this.cargarPago(uid);
    this.numRecibo++;

    this.fechaActual = new Date();
    var dd = String(this.fechaActual.getDate()).padStart(2, '0');
    // console.log('año',dd);
    var mm = String(this.fechaActual.getMonth() + 1).padStart(2, '0');
    // console.log('año',mm);
    var yyyy = this.fechaActual.getFullYear();
    // console.log('año',yyyy);
    this.fechaActual = dd + '/' + mm + '/' + yyyy;
    // console.log('fecha definitiva', this.fechaActual);

    this.activado = true;
    return new Promise(resolve => {
        setTimeout(() => {
          this.generacionPDF();
          this.checkInOut();
        }, 1000);
      });

  }

  onModal(){
    this.switchModal = true;
  }
  onModal1(){
    this.switchModal3 = true;
    this.pagoForm.reset();
    this.title.nativeElement.innerHTML = 'Nuevo Pago';
  }

  offModal(){
    this.switchModal = false;
  }
  offModal2(){
    this.activado = false;
  }
  offModal3(){
    this.switchModal3 = false;
  }

  campoValido(campo: string){
    return this.pagoForm.get(campo).valid || !this.formSubmit;
  }
  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarPagos(this.ultimaBusqueda);
  }

}
