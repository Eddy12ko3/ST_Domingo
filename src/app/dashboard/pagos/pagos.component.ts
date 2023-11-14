import { Component , OnInit} from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiPagosService, DetailPayment } from 'src/app/service/api.pagos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  providers: [DatePipe]
})
export class PagosComponent {
  isDarkTheme: boolean = false;

  formPagos!:FormGroup;
  dataPagos: Array<DetailPayment> = new Array<DetailPayment>();
  buscarForm!: FormGroup;
  

  constructor(private themeService: ThemeService, private pagosService: ApiPagosService, 
    private formGroup: FormBuilder, private router: Router  ) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }
  
  ngOnInit(): void {
    this.obtenerPagos();
    this.formPagos = this.formGroup.group({
      datepayment: ["", [Validators.required]],
      person: ["" , [Validators.required, Validators.maxLength(50)]],
      amount: ["", [Validators.required ,Validators.maxLength(20)]],
    });
    this.buscarForm = this.formGroup.group({
      amountToSearch: ['', [Validators.required, Validators.maxLength(20)]],
    });
    
  }
  

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

 

  obtenerPagos(){
    this.pagosService.obtenerPagos().subscribe((pagos)=>{
      this.dataPagos= pagos;
      console.log('Datos de Pagos:', this.dataPagos);
    })
  }
 
  registrarPagos(){

    if (this.formPagos.valid){
      
      this.pagosService.insertPagos({
        person: this.formPagos.get("person")?.value ?? '',
        amount: this.formPagos.get("amount")?.value ?? 0,
        datepayment: this.formPagos.get("datepayment")?.value ?? new Date(),
        
      }).subscribe((pagos: any)=>{
        console.log(pagos,"success")

        this.obtenerPagos();
        this.limpiarFormulario();
      });
      
    }
    
  }
  
  limpiarFormulario() {
    this.buscarForm.get('amountToSearch')?.setValue(''); 
    this.obtenerPagos(); 
    this.formPagos.reset();
  }

  buscarPorMonto() {
    const amountToSearch = this.buscarForm.get('amountToSearch')?.value;
    

    if (amountToSearch !== null && amountToSearch !== undefined) {
      const amountToSearchNumber = parseFloat(amountToSearch);
  
      if (!isNaN(amountToSearchNumber)) {
        
        this.dataPagos = this.dataPagos.filter(
          (pago) => Math.floor(pago.amount) === Math.floor(amountToSearchNumber)
        );
      } else {
       
        console.warn('Ingrese un número válido para buscar.');
      }
    }
  }
  
}
