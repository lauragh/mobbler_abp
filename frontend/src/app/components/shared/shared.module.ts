import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SidebarComponent } from '../sidebar/sidebar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { GuideComponent } from './guide/guide.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
    declarations: [
      PaginationComponent,
      NavbarComponent,
      FooterComponent,
      GuideComponent
    ],
    exports: [
       PaginationComponent,
       NavbarComponent,
       FooterComponent, 
       GuideComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      CarouselModule,
      TabsModule.forRoot()
    ]
  })

  export class SharedModule { }