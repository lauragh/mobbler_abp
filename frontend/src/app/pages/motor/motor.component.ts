import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { EngineService } from './motor.service';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { document } from 'ngx-bootstrap/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-engine',
  templateUrl: './motor.component.html'
})

export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  clickEventSubscription: Subscription | undefined;

  constructor(private sharedService:SharedService, 
              private engServ: EngineService) {
    this.clickEventSubscription = this.sharedService.getEvent().subscribe(()=>{
      this.capturarCanvas();
    })
   }

  public ngOnInit(): void {
    //this.engServ.createScene(this.rendererCanvas);
    this.engServ.IniMotor(this.rendererCanvas);
    this.engServ.testDraw();
    
    this.ajustarPantalla();

    //this.engServ.animate();
  }

  ajustarPantalla(){
    this.rendererCanvas.nativeElement.width = window.innerWidth;
    this.rendererCanvas.nativeElement.height = window.innerHeight - 70;
    // console.log(window.innerHeight);
  }

  capturarCanvas(){
    //console.log('Llego');
    // Lo siguiente dibuja en el canvas, no tiene que ver con el tutorial, solo es demostración
    //const contexto = this.rendererCanvas.nativeElement.getContext("2d");
    var glContextAttributes = { preserveDrawingBuffer: false };
    // var gl = canvas.getContext("experimental-webgl", glContextAttributes);
    const $boton = document.querySelector("#captura"), // El botón que desencadena
    $objetivo = document.querySelector("#renderCanvas"); // A qué le tomamos la foto

    // Agregar el listener al botón
    // $boton.addEventListener("click", () => {
    // html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
    // .then(canvas => {
      // console.log(canvas);
      // this.engServ.testDraw(this.rendererCanvas);
      this.engServ.captura();
      // canvas.getContext('webgl');
      //console.log($objetivo.getContext('webgl'));

      $objetivo.getContext("experimental-webgl", glContextAttributes);
        // $contenedorCanvas.appendChild(canvas); // Lo agregamos como hijo del div
      let enlace = document.createElement('a');
      enlace.download = "Proyecto Mobbler - Screenshot.png";
      // Convertir la imagen a Base64
      // $objetivo.getContext('webgl', {preserveDrawingBuffer:true}) || canvas.getContext('experimental-webgl', {preserveDrawingBuffer:true});
      enlace.href = $objetivo.toDataURL();
      // Hacer click en él
      enlace.click();
      // });
    // });
  }
}


