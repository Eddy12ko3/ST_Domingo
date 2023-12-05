import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiAsociadosService } from 'src/app/service/api/api.asociados.service';
import { AssociateId } from 'src/interfaces/asociado-extend.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/service/controllers/notification.service';
import { ApiGeneroService } from 'src/app/service/api/api.genero.service';
import { ApiOperadorService } from 'src/app/service/api/api.operador.service';
import { ApiTipoDocumentoService } from 'src/app/service/api/api.tipoDocumento.service';
import { ApiRubroService } from 'src/app/service/api/api.rubro.service';
import { RubroId } from 'src/interfaces/rubro-extend.interface';

@Component({
	selector: 'app-puestos',
	templateUrl: './puestos.component.html',
	styleUrls: ['./puestos.component.css'],
})
export class PuestosComponent implements OnInit, OnDestroy {
	isDarkTheme = false; // Estado del tema
	isButtonClicked = false;
	showModal = false;
	showModalEdit = false;
	imageUrl = 'assets/registro/perfil.png';
	formAsociados!: FormGroup;
	dataAsociados: Array<AssociateId> = new Array<AssociateId>();
	dataGenero: Array<any> = new Array<any>();
	dataRubro: Array<RubroId> = new Array<RubroId>();
	dataTipoDocumento: Array<any> = new Array<any>();
	dataOperador: Array<any> = new Array<any>();
	suscription!: Subscription;
	busquedaDni = '';
	busquedaRubro = '';
	busquedaNombre = '';
	busquedaApellido = '';
	resultadosBusqueda: any[] = [];
	selectedAsociado: any;
	totalAsociados: number = 0;

	constructor(
		private themeService: ThemeService,
		private asociadosService: ApiAsociadosService,
		private formGroup: FormBuilder,
		private notificationService: NotificationService,
		private generoService: ApiGeneroService,
		private operadorService: ApiOperadorService,
		private tipodocumentoService: ApiTipoDocumentoService,
		private rubrosService: ApiRubroService,
	) {
		this.themeService.isDarkMode$.subscribe((isDarkMode) => {
			this.isDarkTheme = isDarkMode;
		});
	}

	ngOnInit(): void {
		this.formAsociados = this.formGroup.group({
			folio: ['', [Validators.required]],
			nombre: ['', [Validators.required, Validators.maxLength(50)]],
			apellido: ['', [Validators.required, Validators.maxLength(50)]],
			numDocumento: [
				'',
				[Validators.required, Validators.minLength(8), Validators.maxLength(12)],
			],
			fecha_nac: ['', [Validators.required]],
			document: ['', [Validators.required]],
			genero: ['', [Validators.required]],
			telefono: ['', [Validators.maxLength(9)]],
			operador: ['', [Validators.required]],
			direccion: ['', [Validators.maxLength(50)]],
			rubroName: ['', [Validators.required]],
			rubro: ['', [Validators.required]],
			area: ['', [Validators.required, Validators.maxLength(20)]],
			code: ['', [Validators.required, Validators.maxLength(50)]],
			sector: ['', [Validators.required, Validators.maxLength(50)]],
		});
		this.obtenerAsociados();
		this.obtenerOperador();
		this.obtenerGenero();
		this.obtenerTipoDocumento();
		this.obtenerRubro();
		this.suscription = this.asociadosService.refresh.subscribe(() => {
			this.obtenerAsociados();
		});
	}

	ngOnDestroy(): void {
		this.suscription.unsubscribe();
	}
	openModal() {
		this.showModal = true;
	}

	closeModal() {
		this.showModal = false;
		this.formAsociados.reset();
	}

	abrir(asociado: AssociateId) {
		this.selectedAsociado = asociado;
		this.formAsociados.patchValue({
			folio: asociado.folio,
			nombre: asociado.persons.name,
			apellido: asociado.persons.lastname,
			numDocumento: asociado.numDocument.numDocument,

			rubroName: asociado.persons.stands[0]?.rubro?.nameField,
			rubro: asociado.persons.stands[0]?.rubro?.fieldId,
		});
		this.selectedAsociado.persons.date_birth_string = new Date(
			this.selectedAsociado.persons.date_birth,
		)
			.toISOString()
			.split('T')[0];
		this.showModalEdit = true;
	}

	cerrar() {
		this.showModalEdit = false;
		this.formAsociados.reset();
	}

	toggleTheme() {
		this.themeService.toggleDarkMode();
	}

	obtenerAsociados() {
		this.asociadosService.obtenerAsociado().subscribe((asociados) => {
			this.dataAsociados = asociados;
			// Inicializar resultadosBusqueda con la lista completa al principio
			this.resultadosBusqueda = [...this.dataAsociados];
			this.totalAsociados = this.dataAsociados.length;
		});
	}

	obtenerGenero() {
		this.generoService.obtenerGenero().subscribe((genero) => {
			this.dataGenero = genero;
		});
	}
	obtenerRubro() {
		this.rubrosService.obtenerRubro().subscribe((rubro) => {
			this.dataRubro = rubro;
			console.log(this.dataRubro);
		});
	}
	obtenerTipoDocumento() {
		this.tipodocumentoService.obtenerTipoDocumento().subscribe((tipodoc) => {
			this.dataTipoDocumento = tipodoc;
		});
	}
	obtenerOperador() {
		this.operadorService.obtenerOperador().subscribe((operador) => {
			this.dataOperador = operador;
		});
	}
	registrarAsociados() {
		console.log('Estado del formulario:', this.formAsociados.status);
		console.log(this.formAsociados.status);
		console.log('Errores del formulario:', this.formAsociados.errors);
		Object.keys(this.formAsociados.controls).forEach((key) => {
			const controlErrors = this.formAsociados.get(key)?.errors;
			if (controlErrors != null) {
				console.log(`Errores en ${key}:`, controlErrors);
			}
		});
		if (this.formAsociados.valid) {
			console.log('Datos a enviar al servidor:', this.formAsociados.value);
			this.asociadosService
				.insertAsociado({
					folio: this.formAsociados.get('folio')?.value ?? 0,
					numDocument: this.formAsociados.get('numDocumento')?.value ?? 0,
					name: this.formAsociados.get('nombre')?.value ?? '',
					lastname: this.formAsociados.get('apellido')?.value ?? '',
					date_birth: this.formAsociados.get('fecha_nac')?.value ?? '',
					gender: this.formAsociados.get('genero')?.value ?? '',
					document: this.formAsociados.get('document')?.value ?? '',
					direccion: this.formAsociados.get('direccion')?.value ?? '',
					celular: this.formAsociados.get('telefono')?.value ?? 0,
					operador: this.formAsociados.get('operador')?.value ?? '',
					code: this.formAsociados.get('code')?.value ?? '',
					area: this.formAsociados.get('area')?.value ?? '',
					sector: this.formAsociados.get('sector')?.value ?? '',
					rubro: this.formAsociados.get('rubro')?.value ?? '',
				})
				.subscribe({
					next: (value: any) => {
						console.log('Respuesta exitosa:', value);
						this.closeModal();
						this.formAsociados.reset();
						this.notificationService.success(value.success);
					},
					error: (value: any) => {
						console.error('Error en la solicitud:', value);
						this.notificationService.errorEvent(value);
					},
				});
		} else {
			console.log('El formulario no es válido. No se enviarán datos al servidor.');
		}
	}

	actualizarAsociados() {
		console.log(this.formAsociados.value);
		Object.keys(this.formAsociados.controls).forEach((key) => {
			const controlErrors = this.formAsociados.get(key)?.errors;
			if (controlErrors != null) {
				console.log(`Errores en ${key}:`, controlErrors);
			}
		});
		if (this.formAsociados.valid) {
			const asociadoId = this.selectedAsociado?.associateId;
			this.asociadosService
				.updateAsociado(asociadoId, {
					folio: this.formAsociados.get('folio')?.value ?? 0,
					numDocument: this.formAsociados.get('numDocumento')?.value ?? 0,
					name: this.formAsociados.get('nombre')?.value ?? '',
					lastname: this.formAsociados.get('apellido')?.value ?? '',
					date_birth: this.formAsociados.get('fecha_nac')?.value ?? '',
					gender: this.formAsociados.get('genero')?.value ?? '',
					document: this.formAsociados.get('document')?.value ?? '',
					direccion: this.formAsociados.get('direccion')?.value ?? '',
					celular: this.formAsociados.get('telefono')?.value ?? 0,
					operador: this.formAsociados.get('operador')?.value ?? '',
					code: this.formAsociados.get('code')?.value ?? '',
					area: this.formAsociados.get('area')?.value ?? '',
					sector: this.formAsociados.get('sector')?.value ?? '',
					rubro: this.formAsociados.get('rubro')?.value ?? '',
				})
				.subscribe({
					next: (value: any) => {
						this.cerrar();
						this.formAsociados.reset();
						this.notificationService.success(value.success);
					},
					error: (value: any) => {
						this.notificationService.errorEvent(value.success);
					},
				});
		}
	}
	isFechaNacimientoFutura(): boolean {
		const fechaNacControl = this.formAsociados.get('fecha_nac');
		const fechaNacValue = new Date(fechaNacControl?.value);
		const fechaActual = new Date();

		return fechaNacValue > fechaActual;
	}
	// En tu componente
	eliminarAsociado(asociadoId: string) {
		if (confirm('¿Estás seguro de que deseas eliminar a este asociado?')) {
			this.asociadosService.deleteAsociado(asociadoId).subscribe({
				next: (value: any) => {
					this.notificationService.success(value.success);
					this.obtenerAsociados();
				},
				error: (value: any) => {
					this.notificationService.errorEvent(value);
				},
			});
		}
	}

	buscarAsociados() {
		this.resultadosBusqueda = this.dataAsociados.filter(
			(asociado) =>
				asociado.numDocument.numDocument.toString().includes(this.busquedaDni.toString()) &&
				asociado.persons.stands[0]?.rubro?.nameField
					.toLowerCase()
					.includes(this.busquedaRubro.toLowerCase()) &&
				asociado.persons.name
					.toLowerCase()
					.includes(this.busquedaNombre.toLocaleLowerCase()) &&
				asociado.persons.lastname
					.toLocaleLowerCase()
					.includes(this.busquedaApellido.toLocaleLowerCase()),
		);
	}

	limpiarBusqueda() {
		this.busquedaDni = '';
		this.busquedaRubro = '';
		this.busquedaNombre = '';
		this.busquedaApellido = '';
		this.resultadosBusqueda = [];
	}
	addMts() {
		const areaControl = this.formAsociados.get('area');
		if (areaControl) {
			let areaValue = areaControl.value;

			// Verificar si el valor está vacío y establecer el error correspondiente
			if (!areaValue) {
				areaControl.setErrors({ required: true });
				return;
			}

			// Agregar 'mts.' al final del valor
			if (!areaValue.endsWith('mts.')) {
				areaValue += ' mts.';
				areaControl.setValue(areaValue);
			}

			// Limpiar los errores si el valor es válido
			areaControl.setErrors(null);
		}
	}

	// validateFolioLength() {
	// 	const folioControl = this.formAsociados.get('folio');
	// 	if (folioControl && folioControl.value) {
	// 		const folioValue = folioControl.value.toString();
	// 		if (folioValue.length < 6) {
	// 			folioControl.setErrors({ minlength: true });
	// 		} else {
	// 			folioControl.setErrors(null);
	// 		}
	// 	}
	// }

	validateNumDocumentoLength() {
		const numDocumentoControl = this.formAsociados.get('numDocumento');
		if (numDocumentoControl && numDocumentoControl.value) {
			const numDocumentoValue = numDocumentoControl.value.toString();
			if (numDocumentoValue.length < 8) {
				numDocumentoControl.setErrors({ minlength: true });
			} else if (numDocumentoValue.length > 12) {
				numDocumentoControl.setErrors({ maxlength: true });
			} else {
				numDocumentoControl.setErrors(null);
			}
		}
	}

	validateTelefonoLength() {
		const telefonoControl = this.formAsociados.get('telefono');
		if (telefonoControl && telefonoControl.value) {
			const telefonoValue = telefonoControl.value.toString();
			if (telefonoValue.length > 9) {
				telefonoControl.setErrors({ maxlength: true });
			} else {
				telefonoControl.setErrors(null);
			}
		}
	}

	validateFechaNac() {
		const fechaNacControl = this.formAsociados.get('fecha_nac');

		// Verifica si formAsociados y fechaNacControl están definidos antes de acceder a ellos
		if (this.formAsociados && fechaNacControl) {
			// Convertir la cadena de fecha a un objeto Date
			const fechaNacValue = new Date(fechaNacControl.value);

			// Obtener la fecha actual
			const fechaActual = new Date();

			// Verificar si la fecha está vacía
			if (!fechaNacControl.value) {
				fechaNacControl.setErrors({ required: true });
			} else if (fechaNacValue > fechaActual) {
				// Verificar si la fecha es futura
				fechaNacControl.setErrors({ invalidDate: true });
			} else {
				fechaNacControl.setErrors(null);
			}
		}
	}

	validateRubro() {
		const rubroControl = this.formAsociados.get('rubroName');
		if (rubroControl) {
			// Verificar si el valor está vacío y establecer el error correspondiente
			if (!rubroControl.value) {
				rubroControl.setErrors({ required: true });
			} else {
				// Limpiar los errores si el valor es válido
				rubroControl.setErrors(null);
			}
		}
	}

	onRubroInput() {
		const inputValue = this.formAsociados.get('rubroName')?.value;
		const selectedRubro = this.dataRubro.find((rubro) => rubro.nameField === inputValue);

		if (selectedRubro) {
			// Mantén el nombre en la interfaz de usuario.
			this.formAsociados.get('rubroName')?.setValue(selectedRubro.nameField);

			// Almacena el ID en el campo oculto.
			this.formAsociados.get('rubro')?.setValue(selectedRubro.fieldId);
		} else {
			// Si la persona no se encuentra, mantén el nombre en lugar de asignar un ID.
			this.formAsociados.get('rubroName')?.setValue(inputValue);

			// Restablece el campo oculto a un valor vacío en caso de que se haya establecido previamente.
			this.formAsociados.get('rubro')?.setValue(null);
		}
	}
}
