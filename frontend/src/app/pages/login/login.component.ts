import { Component, OnInit, OnDestroy, HostListener, NgZone } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import Chart from "chart.js";
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

//declaracion global
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  
  isRequired = true;
  isCollapsed = true;

  public formSubmit = false;
  public waiting = false;
  public auth2: any;
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [ false || localStorage.getItem('email') ]
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router,
               private zone: NgZone ) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    // this.renderButton();
    this.startApp();
    // body.classList.add("register-page");
    // body.classList.add("landing-page");

  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  startApp() {
    gapi.load('auth2',()=>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '302145871404-ouh4drlvkj3a03vt0vsikkdtdnnt5nl4.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('customBtn'));
    });
  };

  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token)
          .subscribe( res => {
            switch (this.usuarioService.rol) {
              case 'ROL_ADMIN':
                this.zone.run(() =>{
                  this.router.navigateByUrl('/dashboard');
                });
                break;
              case 'ROL_CLIENTE':
                this.zone.run(() =>{
                  this.router.navigateByUrl('/gestor-proyectos');
                });
                break;
            }
          },(err) => {
            console.warn('Error respueta api:',err);
            Swal.fire({
              title: 'Error',
              text: err.error.msg || 'Los datos son incorrectos, revise los campos.',
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            })
          // document.getElementById('name').innerText = "Signed in: " +
          //     googleUser.getBasicProfile().getName();
        })
      }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
    });
  }

  login(){
    this.formSubmit = true;

    // console.log(this.loginForm);

    if(this.formSubmit){
      if(this.loginForm.get('email').hasError('required') && this.loginForm.get('password').hasError('required')){
        this.isRequired = false;
      }
    }

    if (!this.loginForm.valid){
      console.warn('Errores en el formulario');
      return;
    }

    this.waiting = true;

    this.usuarioService.login( this.loginForm.value )
      .subscribe( res => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        this.waiting = false;
        // console.log(this.usuarioService.rol)
        switch (this.usuarioService.rol) {
          case 'ROL_ADMIN':
            this.router.navigateByUrl('/dashboard');
            break;
          case 'ROL_CLIENTE':
            this.router.navigateByUrl('/gestor-proyectos');
            break;
        }

      }, (err) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg || 'Los datos son incorrectos, revise los campos.',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      });
      this.formSubmit = false;
  }

  campoValido(campo: string){
    if(!this.formSubmit){
      this.isRequired = true;
    }
      return this.loginForm.get(campo).valid || !this.formSubmit;
  }
}