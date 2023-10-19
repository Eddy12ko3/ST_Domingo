import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Producto{
  nombre: string,
  precio: number,
  cantidad: number,
  estado: boolean
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})


export class ProductosComponent implements OnInit{
  formsProduct!: FormGroup;
  data: Producto[] = []

  constructor(private apiservice: ApiService, private formsgroup: FormBuilder){
    
  }
  ngOnInit(): void {
    this.llenardatos();
    this.formsProduct = this.formsgroup.group({
      nombre: ["", [Validators.required, Validators.maxLength(50)]],
      precio: ["", [Validators.required, Validators.max(10)]],
      cantidad: ["", [Validators.required, Validators.max(100)]],
      estado: [true]
    })
  }

  llenardatos(){
    this.apiservice.getData().subscribe(data =>{
      this.data = data;
      console.log(data)
    })
    
  }
  
  registrarDatos(): void{
    console.log(this.formsProduct.value)
    if(this.formsProduct.valid){
      this.apiservice.create({
        nombre: this.formsProduct.get("nombre")?.value ?? '',
        precio: this.formsProduct.get("precio")?.value ?? 0, 
        cantidad: this.formsProduct.get("cantidad")?.value ?? 0, 
        estado: this.formsProduct.get("estado")?.value ?? true
    }).subscribe((p) =>{
        this.data.push(p)
        console.log()
      })
    }
   
  } 
}
