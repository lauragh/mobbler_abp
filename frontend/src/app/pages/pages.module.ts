import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { PopoverModule } from "ngx-bootstrap/popover";
import { HttpClientModule } from '@angular/common/http';
// import { MatCardModule } from '@angular/material/card';
import { ComponentsModule } from '../components/components.module';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from "./register/register.component";
import { PerfilComponent } from './perfil/perfil.component';
import { ModelsComponent } from "./admin/models/models.component";
import { CatalogComponent } from "./admin/catalog/catalog.component";
import { DashboardComponent } from "./admin/dashboard/dashboard.component";
import { PaymentComponent } from "./admin/payment/payment.component";
import { ProjectComponent } from "./admin/project/project.component";
import { UserComponent } from "./admin/user/user.component";
import { NewClientComponent } from './admin/new-client/new-client.component';
import { SharedModule } from '../components/shared/shared.module';
import { GestorProyectosComponent } from './gestor-proyectos/gestor-proyectos.component';
import { HomeComponent } from './home/home.component';
import { EngineComponent} from './motor/motor.component';
import { GestorCatalogosComponent } from './gestor-catalogos/gestor-catalogos.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PaymentComponent,
    ProjectComponent,
    UserComponent,
    CatalogComponent,
    ModelsComponent,
    LoginComponent,
    LandingComponent,
    RegisterComponent,
    PerfilComponent,
    NewClientComponent,
    GestorProyectosComponent,
    HomeComponent,
    EngineComponent,
    GestorCatalogosComponent
    
  ],
  imports: [
    SharedModule,
    CommonModule,
    ComponentsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    // TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    LoginComponent,
    LandingComponent,
    RegisterComponent,
    PerfilComponent
  ],
  providers: []
})
export class PagesModule {}