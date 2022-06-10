import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
 
  public formSubmit = false;
  public waiting = false;
  public noCoincide = true;

  // Variables registro
  public registerForm = this.fb.group({
    uid: [''],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    company: ['', Validators.required],
    rol: ['ROL_CLIENTE', Validators.required],
    // nombre: [''],
    // apellidos: [''],
    plan: ['GRATUITO']
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register");
  }

  nuevo(){
    // this.registerForm.get('password').enable();
    // console.log(this.registerForm.get('uid').value)
    this.registerForm.get('uid').setValue('nuevo');
    this.registerForm.get('plan').setValue('GRATUITO');
    // console.log(this.registerForm)
  }

  register(){
    this.formSubmit = true;
    this.noCoincide = true;
    
    if(this.formSubmit){
      if(this.registerForm.get('password').value != this.registerForm.get('password2').value){
        // console.log(this.registerForm.get('password').value)
        this.noCoincide = false;
        // console.log(this.registerForm.get('password2').value)
      }
      // if(this.registerForm.get('password2').value == ''){
      //   this.noCoincide = true;
      // }
    }

    if (!this.registerForm.valid){
      Swal.fire({
        title: '¡Error!',
        text: 'Los campos son incorrectos, vuelva a intentarlo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      console.warn('Errores en el formulario');
      return;
    }

    // this.waiting = true;

    this.nuevo();
    // console.log('Valor noCoincide: '+this.noCoincide);

    if(this.noCoincide){
      this.usuarioService.nuevoUsuario( this.registerForm.value )
      .subscribe( res => {
        Swal.fire({
          title: 'Cliente registrado',
          text: 'Cliente creado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.router.navigateByUrl('/login');
        return;
        // // console.log(JSON.stringify(res));
        // // console.log(this.registerForm.get('uid').value)
        // // console.log('Pasoooooo')
        // // console.log(res)
        // this.registerForm.get('uid').setValue(res['cliente'].uid);
        // // this.waiting = false;
        // switch (this.registerForm.get('rol').value) {
        //   case 'ROL_ADMIN':
        //     this.router.navigateByUrl('/login');
        //     break;
        //   case 'ROL_CLIENTE':
        //     this.router.navigateByUrl('/login');
        //     break;
        // }
      }, (err) => {
        console.warn('Error respueta api:',err);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      });
      this.formSubmit = false;
    }
  }

  compruebaPass(campo: string, campo2: string){
    if(!(campo == '') || !(campo2 == '')){
      if(this.registerForm.get(campo) != this.registerForm.get(campo2)){
        return false;
      }
    }
  }

  campoValido(campo: string){
    return this.registerForm.get(campo).valid || !this.formSubmit;
  }
}
