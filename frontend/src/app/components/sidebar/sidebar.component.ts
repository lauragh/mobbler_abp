import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    src: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: '', class: 'icono', src: 'assets/img/casa.png' },
    { path: '/catalog', title: 'Catálogos',  icon:'', class: 'icono', src: 'assets/img/catalogos.png'},
    { path: '/models', title: 'Modelos',  icon:'', class: 'icono', src: 'assets/img/objeto3d.png' },
    { path: '/user', title: 'Clientes',  icon:'', class: 'icono', src: 'assets/img/clientes.png' },
    { path: '/project', title: 'Proyectos',  icon:'', class: 'icono', src: 'assets/img/proyectos.png' },
    { path: '/payment', title: 'Pagos y facturas',  icon:'', class: 'icono', src: 'assets/img/recibo.png' },
    { path: '/login', title: 'Login',  icon:'', class: 'icono', src: '' },
    { path: '/register', title: 'Register',  icon:'', class: 'icono', src: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout() {
    this.usuarioService.logout();
  }
}
