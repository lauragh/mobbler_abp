import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecoveryComponent } from './recovery/recovery.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RecoveryComponent
  ],
  exports: [
    RecoveryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
