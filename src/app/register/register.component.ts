import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiUserService } from '../service/api.user.service';
import { Router } from '@angular/router';

export interface Auth{
  dni: number;
  password: string;
}

interface User extends Auth{
  name: string;
  lastname: string;
  date_birth: Date;
  gender: string;
  document: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  formRegister!: FormGroup;
  dataUsers: Array<User> = new Array<User>;
  constructor(private apiservice: ApiUserService,private formgroup: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.formRegister = this.formgroup.group({
      usuario: ["", [Validators.required, Validators.maxLength(8)]],
      contraseña: ["", [Validators.required, Validators.maxLength(50)]],
      nombre: ["", [Validators.required, Validators.maxLength(50)]],
      apellidos: ["", [Validators.required, Validators.maxLength(50)]],
      fecha_nac: ["", [Validators.required]],
      genero: ["", [Validators.required]],
      tipodoc: ["", [Validators.required]],
    })
  }

  registrarUsuario(){
    console.log(this.formRegister.value)
    if(this.formRegister.valid){
      this.apiservice.register({
        dni: this.formRegister.get("usuario")?.value ?? 0,
        password: this.formRegister.get("contraseña")?.value ?? '',
        name: this.formRegister.get("nombre")?.value ?? '',
        lastname: this.formRegister.get("apellidos")?.value ?? '',
        date_birth: this.formRegister.get("fecha_nac")?.value ?? '',
        gender: this.formRegister.get("genero")?.value ?? '',
        document: this.formRegister.get("tipodoc")?.value ?? '',
      }).subscribe((user)=>{
        console.log(user);
        this.dataUsers.push(user);
        this.router.navigate(['/login'])
      })

    }

  }
}
