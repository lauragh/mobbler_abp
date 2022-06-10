import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingModule } from './pages/admin/admin.routing';
import { PagesModule } from './pages/pages.module';
import { TasksService } from './tasks.service';

import { AuthGuard } from './guards/auth.guard';
import { NoauthGuard } from './guards/noauth.guard';

import { GestorProyectosComponent } from './pages/gestor-proyectos/gestor-proyectos.component';
import { GestorCatalogosComponent } from './pages/gestor-catalogos/gestor-catalogos.component';
import { GuideComponent } from './components/shared/guide/guide.component';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { EngineComponent } from './pages/motor/motor.component';
import { HomeComponent} from './pages/home/home.component';


const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_CLIENTE', titulo: 'Home'}},
  // { path: 'login', component: LoginComponent },
  { path: 'gestor-catalogos', component: GestorCatalogosComponent, canActivate: [ AuthGuard ], data: {rol: '*'} },
  { path: 'gestor-proyectos', component: GestorProyectosComponent, canActivate: [ AuthGuard ], data: {rol:'ROL_CLIENTE',
                                                                                                      titulo: 'Gestor de proyectos'}},
  { path: 'landing', component: LandingComponent},
  { path: 'perfil' , component: PerfilComponent, canActivate: [ AuthGuard ], data: {rol: '*'}},
  { path: 'engine', component: EngineComponent, canActivate: [ NoauthGuard ]},
  { path: 'guide', component: GuideComponent },
  { path: '**', redirectTo: 'landing'},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AdminRoutingModule,
    PagesModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
  ],
  providers: [TasksService],
  exports: [RouterModule]
})

export class AppRoutingModule {}