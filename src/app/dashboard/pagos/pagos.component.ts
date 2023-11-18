import { Component , OnInit} from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiPagosService } from 'src/app/service/api/api.pagos.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DetailPayments } from 'src/interfaces/pagos.get.interface';
import { DetailPaymentId } from 'src/interfaces/pagos-extend.interface';
import { PersonId } from 'src/interfaces/persona-extend.interface';
import { ApiPersonasService } from 'src/app/service/api/api.persona.service';
import { NotificationService } from 'src/app/service/controllers/notification.service';

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
  dataPersona: Array<PersonId> = new Array<PersonId>();
  buscarForm!: FormGroup;
  suscription?: Subscription;
  showModal = false;
  showModalEdit = false;

  constructor(
    private themeService: ThemeService, 
    private pagosService: ApiPagosService,
    private formGroup: FormBuilder ,
    private personService: ApiPersonasService,
    private notificationService: NotificationService
  ) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.obtenerPagos();
    this.obtenerPersona();
    this.formPagos = this.formGroup.group({
      datepayment: ["", [Validators.required]],
      person: ["" , [Validators.required, Validators.maxLength(50)]],
      amount: ["" , [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      personName: ["", [Validators.required, Validators.maxLength(50)]],
    });
    this.buscarForm = this.formGroup.group({
      amountToSearch: ['', [Validators.required, Validators.maxLength(20)]],
    });
    this.suscription = this.pagosService.refresh.subscribe(() =>{
      this.obtenerPagos();
    }
    )
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formPagos.reset();
    
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

  obtenerPersona(){
    this.personService.obtenerPersona().subscribe((personas)=>{
      this.dataPersona= personas;
      console.log(this.dataPersona);
    })
  }

  registrarPagos(){
    if (this.formPagos.valid){
      this.pagosService.insertPagos({
        person: this.formPagos.get("person")?.value ?? '',
        amount: this.formPagos.get("amount")?.value ?? 0,
        datepayment: this.formPagos.get("datepayment")?.value ?? '',
      }).subscribe({
        next: (value: any) => {
          this.closeModal()
          this.notificationService.success(value.success);
          this.obtenerPagos();
          this.limpiarFormulario();
        },
        error: (value: any) => {
          this.notificationService.errorEvent(value);
        }
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
        (pago) => Math.abs(pago.amount - amountToSearchNumber) < 0.01
      );
    } else {
      console.warn('Ingrese un número válido para buscar.');
      }
    }
  }

  onPersonInput() {
    const inputValue = this.formPagos.get('personName')?.value;
    const selectedPerson = this.dataPersona.find(persona => (persona.name + ' ' + persona.lastname) === inputValue);

    if (selectedPerson) {
        // Mantén el nombre en la interfaz de usuario.
        this.formPagos.get('personName')?.setValue(selectedPerson.name + ' ' + selectedPerson.lastname);

        // Almacena el ID en el campo oculto.
        this.formPagos.get('person')?.setValue(selectedPerson.personId);
    } else {
        // Si la persona no se encuentra, mantén el nombre en lugar de asignar un ID.
        this.formPagos.get('personName')?.setValue(inputValue);

        // Restablece el campo oculto a un valor vacío en caso de que se haya establecido previamente.
        this.formPagos.get('person')?.setValue('');
    }
}



}
