import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  // public logueado = false;
  isCollapsed = true;
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");

    // var canvas: any = document.getElementById("chartBig");
    // var ctx = canvas.getContext("2d");
    // var gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
    // gradientFill.addColorStop(0, "rgba(228, 76, 196, 0.0)");
    // gradientFill.addColorStop(1, "rgba(228, 76, 196, 0.14)");

    // if(this.usuarioService.uid){
    //   // console.log(this.usuarioService.uid);
    //   this.logueado = true;
    // }
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  logout() {
    this.usuarioService.logout();
  }
}


