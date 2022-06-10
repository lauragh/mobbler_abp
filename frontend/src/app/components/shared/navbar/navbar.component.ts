import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    var contenedor = document.getElementById("OtroTema");		
    contenedor.style.display = "none";		
  }
  logout() {
    this.usuarioService.logout();
  }

  user(){
    var contenedor = document.getElementById("OtroTema");
    contenedor.style.display = "block";
  }

}