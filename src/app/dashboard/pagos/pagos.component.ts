import { Component , OnInit} from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiPagosService } from 'src/app/service/api.pagos.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DetailPayments } from 'src/app/interfaces/pagos.get.interface';
import { DetailPaymentId } from 'src/app/interfaces/pagos-extend.interface';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  providers: [DatePipe]
})
export class PagosComponent implements OnInit{
  isDarkTheme: boolean = false;

  formPagos!:FormGroup;
  dataPagos: Array<DetailPaymentId> = new Array<DetailPaymentId>();
  buscarForm!: FormGroup;
  suscription?: Subscription
  

  constructor(private themeService: ThemeService, private pagosService: ApiPagosService, 
    private formGroup: FormBuilder  ) {
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
    this.suscription = this.pagosService.refresh.subscribe(() =>{
      this.obtenerPagos();
    }
    )
  }
  
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
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
        datepayment: this.formPagos.get("datepayment")?.value ?? '',
        
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
