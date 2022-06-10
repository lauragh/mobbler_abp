import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {

  constructor( private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router ) { }

  // -- VARIABLES FORM NUEVO CLIENTE --
  private formSubmited = false;
  private uid = '';
  public enablepass = true;
  public showOKP = false;

  public datosForm = new FormGroup({
      uid: new FormControl('nuevo', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password:new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      plan: new FormControl('', Validators.required),
      rol: new FormControl('ROL_CLIENTE', Validators.required)
  });

  public nuevoPassword = this.fb.group({
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    // console.log('Uid del usuarioService: '+this.usuarioService.uid)

  }

  campoNoValido( campo: string ) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  nuevo(): void {
    this.formSubmited = false;
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    this.datosForm.get('rol').setValue('ROL_CLIENTE');
    this.datosForm.get('password').enable();
    this.enablepass = true;
    // console.log(this.datosForm.get('uid').value);
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value === 'nuevo') return true;
    return false;
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.router.navigateByUrl('/user');
      return;
    }
  }

  enviar(): void {
    this.formSubmited = true;
    // console.log('Datos form: '+JSON.stringify(this.datosForm.value))
    this.nuevo();
    // if (this.datosForm.invalid) { return; }
    // Diferenciar entre dar de alta uno nuevo o actualizar uno que ya existe
    // Alta de uno nuevo
    // console.log(this.usuarioService)
    if (this.datosForm.get('uid').value === 'nuevo') {
      // console.log('Entra')
      this.usuarioService.nuevoUsuario( this.datosForm.value )
        .subscribe( res => {
          // console.log(JSON.stringify(res))
          Swal.fire({
            title: 'Cliente registrado',
            text: 'Cliente creado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          //this.datosForm.get('uid').setValue(res['clientes'].uid);
          this.enablepass = false;
          this.datosForm.markAsPristine();
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });
    }
  }
}
