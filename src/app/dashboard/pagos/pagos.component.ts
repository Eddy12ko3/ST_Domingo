import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiPagosService } from 'src/app/service/api/api.pagos.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DetailPaymentId } from 'src/interfaces/pagos-extend.interface';
import { PersonId } from 'src/interfaces/persona-extend.interface';
import { ApiPersonasService } from 'src/app/service/api/api.persona.service';
import { NotificationService } from 'src/app/service/controllers/notification.service';

@Component({
	selector: 'app-pagos',
	templateUrl: './pagos.component.html',
	styleUrls: ['./pagos.component.css'],
	providers: [DatePipe],
})
export class PagosComponent implements OnInit, OnDestroy {
	isDarkTheme = false;
	formPagos!: FormGroup;
	dataPagos: Array<DetailPaymentId> = new Array<DetailPaymentId>();
	dataPersona: Array<PersonId> = new Array<PersonId>();
	buscarForm!: FormGroup;
	suscription?: Subscription;
	showModal = false;
	showModalEdit = false;
	resultadosEncontrados = true;
	selectedPago: any;

	constructor(
		private themeService: ThemeService,
		private pagosService: ApiPagosService,
		private formGroup: FormBuilder,
		private personService: ApiPersonasService,
		private notificationService: NotificationService,
	) {
		this.themeService.isDarkMode$.subscribe((isDarkMode) => {
			this.isDarkTheme = isDarkMode;
		});
	}

	ngOnInit(): void {
		this.obtenerPagos();
		this.obtenerPersona();
		this.formPagos = this.formGroup.group({
			datepayment: [
				this.getFormattedCurrentDate(), // Inicializar con la fecha actual
				{
					validators: [Validators.required, this.fechaNoFuturaValidator()],
					updateOn: 'blur',
				},
			],
			person: ['', [Validators.required, Validators.maxLength(50)]],
			amount: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
			personName: ['', [Validators.required, Validators.maxLength(50)]],
		});
		this.buscarForm = this.formGroup.group({
			amountToSearch: ['', [Validators.required, Validators.maxLength(20)]],
			nameToSearch: ['', [Validators.maxLength(50)]],
		});
		this.suscription = this.pagosService.refresh.subscribe(() => {
			this.obtenerPagos();
		});
	}

	openModal() {
		this.showModal = true;
	}

	closeModal() {
		this.showModal = false;
		this.formPagos.patchValue({
			datepayment: this.getFormattedCurrentDate(),
			person: '',
			amount: '',
			personName: '',
		});
	}
	abrirModal(pago: DetailPaymentId) {
		this.selectedPago = pago;
		this.selectedPago.datePayment_string = new Date(this.selectedPago.datePayment)
			.toISOString()
			.split('T')[0];
		this.showModalEdit = true;
	}

	cerrarModal() {
		this.showModalEdit = false;
		this.selectedPago = null; // Limpiar los datos del modal de edición
		this.formPagos.patchValue({
			datepayment: this.getFormattedCurrentDate(),
			person: '',
			amount: '',
			personName: '',
		});
	}

	ngOnDestroy(): void {
		this.suscription?.unsubscribe();
	}

	toggleTheme() {
		this.themeService.toggleDarkMode();
	}

	obtenerPagos() {
		this.pagosService.obtenerPagos().subscribe((pagos) => {
			this.dataPagos = pagos;
			console.log(this.dataPagos);
		});
	}

	obtenerPersona() {
		this.personService.obtenerPersona().subscribe((personas) => {
			this.dataPersona = personas;
		});
	}

	registrarPagos() {
		console.log(this.formPagos.value);
		if (this.formPagos.valid) {
			this.pagosService
				.insertPagos({
					person: this.formPagos.get('person')?.value ?? '',
					amount: this.formPagos.get('amount')?.value ?? 0,
					datepayment: this.formPagos.get('datepayment')?.value ?? '',
				})
				.subscribe({
					next: (value: any) => {
						this.closeModal();
						this.notificationService.success(value.success);
						this.limpiarFormulario();
					},
					error: (value: any) => {
						this.notificationService.errorEvent(value);
					},
				});
		}
	}

	actualizarPagos() {
		console.log(this.formPagos.value);
		if (this.formPagos.valid) {
			const pagosId = this.selectedPago?.detailPaymentId;
			this.pagosService
				.updatePagos(pagosId, {
					person: this.formPagos.get('person')?.value ?? '',
					amount: this.formPagos.get('amount')?.value ?? 0,
					datepayment: this.formPagos.get('datepayment')?.value ?? '',
				})
				.subscribe({
					next: (value: any) => {
						this.cerrarModal();
						this.notificationService.success(value.success);
						this.limpiarFormulario();
					},
					error: (value: any) => {
						this.notificationService.errorEvent(value);
					},
				});
		}
	}

	eliminarPagos(pagosId: string) {
		if (confirm('¿Estás seguro de que deseas eliminar a este registro de pago?')) {
			this.pagosService.deletePagos(pagosId).subscribe({
				next: (value: any) => {
					this.notificationService.success(value.success);
				},
				error: (value: any) => {
					this.notificationService.errorEvent(value);
				},
			});
		}
	}

	limpiarFormulario() {
		this.buscarForm.get('amountToSearch')?.setValue('');
		this.buscarForm.get('nameToSearch')?.setValue('');
		this.obtenerPagos();
		this.formPagos.reset();
	}

	buscarPorMonto() {
		const amountToSearch = this.buscarForm.get('amountToSearch')?.value;
		const nameToSearch = this.buscarForm.get('nameToSearch')?.value;

		let filteredPagos = this.dataPagos;

		// Filtrar por monto
		if (amountToSearch !== null && amountToSearch !== undefined) {
			const amountToSearchNumber = parseFloat(amountToSearch);

			if (!isNaN(amountToSearchNumber)) {
				filteredPagos = filteredPagos.filter(
					(pago) => Math.abs(pago.amount - amountToSearchNumber) < 0.01,
				);
			} else {
				console.warn('Ingrese un número válido para buscar por monto.');
			}
		}

		// Filtrar por nombre
		if (nameToSearch && nameToSearch.trim() !== '') {
			filteredPagos = filteredPagos.filter((pago) =>
				(pago.person.name + ' ' + pago.person.lastname)
					.toLowerCase()
					.includes(nameToSearch.toLowerCase()),
			);
		}

		this.dataPagos = filteredPagos;
		this.resultadosEncontrados = filteredPagos.length > 0;
	}

	onPersonInput() {
		const inputValue = this.formPagos.get('personName')?.value;
		const selectedPerson = this.dataPersona.find(
			(persona) => persona.name + ' ' + persona.lastname === inputValue,
		);

		if (selectedPerson) {
			// Mantén el nombre en la interfaz de usuario.
			this.formPagos
				.get('personName')
				?.setValue(selectedPerson.name + ' ' + selectedPerson.lastname);

			// Almacena el ID en el campo oculto.
			this.formPagos.get('person')?.setValue(selectedPerson.personId);
		} else {
			// Si la persona no se encuentra, mantén el nombre en lugar de asignar un ID.
			this.formPagos.get('personName')?.setValue(inputValue);

			// Restablece el campo oculto a un valor vacío en caso de que se haya establecido previamente.
			this.formPagos.get('person')?.setValue('');
		}
	}
	fechaNoFuturaValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const selectedDate = control.value;

			if (selectedDate) {
				const currentDate = new Date();
				const selectedDateObj = new Date(selectedDate);

				if (selectedDateObj > currentDate) {
					// Devuelve un error si la fecha es futura
					return { fechaFutura: true };
				}
			}

			// La validación pasa si la fecha no es futura
			return null;
		};
	}
	private getFormattedCurrentDate(): string {
		const currentDate = new Date();
		const isoString = currentDate.toISOString().split('T')[0];
		return isoString;
	}
}
