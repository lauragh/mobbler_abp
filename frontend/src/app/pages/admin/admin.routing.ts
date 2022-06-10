import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { NoauthGuard } from '../../guards/noauth.guard';

import { CatalogComponent } from './catalog/catalog.component';
import { ModelsComponent } from './models/models.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PaymentComponent } from './payment/payment.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewClientComponent } from './new-client/new-client.component';
import { HomeComponent } from '../home/home.component';
// import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

const routes: Routes = [
    { path: 'catalog', component: CatalogComponent, canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Catálogo'}},
    { path: 'models', component: ModelsComponent,   canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Modelo'}},
    { path: 'login', component: LoginComponent,     canActivate: [ NoauthGuard ]},
    { path: 'payment', component: PaymentComponent, canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Pagos'}},
    { path: 'project', component: ProjectComponent, canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Proyecto'}},
    { path: 'user', component: UserComponent,       canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Cliente'}},
    { path: 'user/new-client', component: NewClientComponent, canActivate: [ AuthGuard ], data: {
                                                    rol: 'ROL_ADMIN',
                                                    titulo: 'Nuevo Cliente'}},
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {
                                                    rol:'ROL_ADMIN',
                                                    titulo: 'Dashboard'}},
    { path: 'home', component: HomeComponent },
  //   { path: 'client', component: DashboardComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_CLIENTE'},
  //   children: [
  //     { path: 'user', component: UserComponent,       canActivate: [ AuthGuard ], data: {
  //                                                     rol: 'ROL_CLIENTE',
  //                                                     titulo: 'Cliente'}}
  // ]},
];

@NgModule({
  imports: [
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class AdminRoutingModule{}
