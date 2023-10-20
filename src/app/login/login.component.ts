import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUserService } from '../service/api.user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  formLogin!: FormGroup; 

  constructor(private apiService: ApiUserService, private formGroup: FormBuilder, private router: Router){}
  ngOnInit(): void {
    this.formLogin = this.formGroup.group({
      usuario: ["", [Validators.required, Validators.maxLength(8)]],
      contraseña: ["", [Validators.required, Validators.maxLength(50)]],
    })
  }

  loginUser(){
    if(this.formLogin.valid){
      this.apiService.login({
        dni: this.formLogin.get("usuario")?.value ?? 0,
        password: this.formLogin.get("contraseña")?.value ?? '',
      }).subscribe({
        next: (user) => {
          console.log(user) 
          localStorage.setItem('yoken', user)
          localStorage.setItem("SessionToken", user);
          this.router.navigate(['/productos'])
        },
        error: (err) => {
          console.log(err) 
          
        },
      })
    }
  }
}
