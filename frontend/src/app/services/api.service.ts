import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { registerForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private url = environment.base_url;

  constructor( private http: HttpClient,
               private fb: FormBuilder) { }

  register( formData: registerForm) {
    return this.http.post(this.url+'/usuarios', formData);
  }
}
