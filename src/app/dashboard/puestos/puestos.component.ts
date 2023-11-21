import { Component , OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAsociadosService } from 'src/app/service/api/api.asociados.service';
import { AssociateId } from 'src/interfaces/asociado-extend.interface';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/controllers/notification.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit, OnDestroy {
  isDarkTheme = false; // Estado del tema
  isButtonClicked = false;
  showModal = false;
  showModalEdit = false;
  imageUrl = 'assets/registro/perfil.png';
  formAsociados!:FormGroup;
  dataAsociados: Array<AssociateId> = new Array<AssociateId>();
  suscription!: Subscription;
  busquedaDni = '';
  busquedaRubro = '';
  busquedaNombre = '';
  busquedaApellido = '';
  resultadosBusqueda: any[] = [];
  selectedAsociado: any;
  totalAsociados: number = 0;

  constructor(private themeService: ThemeService,
    private asociadosService: ApiAsociadosService,
    private formGroup: FormBuilder, 
    private notificationService: NotificationService
  ) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.obtenerAsociados();
    this.formAsociados = this.formGroup.group({
      folio: ["", [Validators.required, Validators.minLength(6)]],
      nombre: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      numDocumento: ["", [Validators.required, Validators.minLength(8)]],
      fecha_nac: ["", [Validators.required]],
      document: ["", [Validators.required]],
      genero: ["", [Validators.required]],
      telefono: ["", [Validators.required, Validators.maxLength(9)]],
      operador: ["", [Validators.required]],
      direccion: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      rubro: ["", [Validators.required]],
      area: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      code: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sector: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

        });
    this.suscription = this.asociadosService.refresh.subscribe(()=> {
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
    this.selectedAsociado.persons.date_birth_string = new Date(this.selectedAsociado.persons.date_birth).toISOString().split('T')[0];
    this.showModalEdit = true;
  }

  cerrar() {
    this.showModalEdit = false;
    this.formAsociados.reset();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  obtenerAsociados(){
    this.asociadosService.obtenerAsociado().subscribe((asociados) => {
      this.dataAsociados = asociados;
      // Inicializar resultadosBusqueda con la lista completa al principio
      this.resultadosBusqueda = [...this.dataAsociados];
      this.totalAsociados = this.dataAsociados.length;
    });
  }

  registrarAsociados(){
    if (this.formAsociados.valid){
      this.asociadosService.insertAsociado({
        folio: this.formAsociados.get("folio")?.value ?? 0,
        numDocument: this.formAsociados.get("numDocumento")?.value ?? 0,
        name: this.formAsociados.get("nombre")?.value ?? '',
        lastname: this.formAsociados.get("apellido")?.value ?? '',
        date_birth: this.formAsociados.get("fecha_nac")?.value ?? '',
        gender: this.formAsociados.get("genero")?.value ?? '',
        document: this.formAsociados.get("document")?.value ?? '',
        direccion: this.formAsociados.get("direccion")?.value ?? '',
        celular: this.formAsociados.get("telefono")?.value ?? 0,
        operador: this.formAsociados.get("operador")?.value ?? '',
        code: this.formAsociados.get("code")?.value ?? '',
        area: this.formAsociados.get("area")?.value ?? '',
        sector: this.formAsociados.get("sector")?.value ?? '',
        rubro: this.formAsociados.get("rubro")?.value ?? '',
      }).subscribe({ 
        next: (value: any)=>{
          this.closeModal()
          this.formAsociados.reset();
          this.notificationService.success(value.success);
        },
        error: (value: any)=>{
          this.notificationService.errorEvent(value);
        }
      });
    }
  }

  actualizarAsociados(){
    if (this.formAsociados.valid){
      const asociadoId = this.selectedAsociado?.associateId;
      this.asociadosService.updateAsociado(asociadoId,{
        folio: this.formAsociados.get("folio")?.value ?? 0,
        numDocument: this.formAsociados.get("numDocumento")?.value ?? 0,
        name: this.formAsociados.get("nombre")?.value ?? '',
        lastname: this.formAsociados.get("apellido")?.value ?? '',
        date_birth: this.formAsociados.get("fecha_nac")?.value ?? '',
        gender: this.formAsociados.get("genero")?.value ?? '',
        document: this.formAsociados.get("document")?.value ?? '',
        direccion: this.formAsociados.get("direccion")?.value ?? '',
        celular: this.formAsociados.get("telefono")?.value ?? 0,
        operador: this.formAsociados.get("operador")?.value ?? '',
        code: this.formAsociados.get("code")?.value ?? '',
        area: this.formAsociados.get("area")?.value ?? '',
        sector: this.formAsociados.get("sector")?.value ?? '',
        rubro: this.formAsociados.get("rubro")?.value ?? '',
      }).subscribe({
        next: (value: any) =>{
          this.cerrar();
          this.formAsociados.reset();
          this.notificationService.success(value.success);
        },
        error: (value: any) =>{
          this.notificationService.errorEvent(value.success);
        },
      })
    }
  }

  // En tu componente
  eliminarAsociado(asociadoId: string) {
    if (confirm("¿Estás seguro de que deseas eliminar a este asociado?")) {
      this.asociadosService.deleteAsociado(asociadoId).subscribe({
        next: (value: any) => {
          this.notificationService.success(value.success);
          this.obtenerAsociados();
        },
        error: (value: any) => {
          this.notificationService.errorEvent(value);
        }
      });
    }
  }
  
  buscarAsociados() {
    this.resultadosBusqueda = this.dataAsociados.filter(
      (asociado) =>
        asociado.numDocument.numDocument
          .toString()
          .includes(this.busquedaDni.toString()) &&
        asociado.persons.stands[0]?.rubro?.nameField
          .toLowerCase()
          .includes(this.busquedaRubro.toLowerCase()) &&
          asociado.persons.name.toLowerCase().includes(this.busquedaNombre.toLocaleLowerCase()) &&
          asociado.persons.lastname.toLocaleLowerCase().includes(this.busquedaApellido.toLocaleLowerCase())
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
  
  
validateFolioLength() {
  const folioControl = this.formAsociados.get('folio');
  if (folioControl && folioControl.value) {
    const folioValue = folioControl.value.toString();
    if (folioValue.length < 6) {
      folioControl.setErrors({ minlength: true });
    } else {
      folioControl.setErrors(null);
    }
  }
}

validateNumDocumentoLength() {
  const numDocumentoControl = this.formAsociados.get('numDocumento');
  if (numDocumentoControl && numDocumentoControl.value) {
    const numDocumentoValue = numDocumentoControl.value.toString();
    if (numDocumentoValue.length < 8) {
      numDocumentoControl.setErrors({ minlength: true });
    } else {
      numDocumentoControl.setErrors(null);
    }
  }
}

validateTelefonoLength() {
  const telefonoControl = this.formAsociados.get('telefono');
  if (telefonoControl && telefonoControl.value) {
    const telefonoValue = telefonoControl.value.toString();
    if (telefonoValue.length < 9) {
      telefonoControl.setErrors({ minlength: true });
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

    // Verificar si la fecha es válida y si está en el pasado
    if (!fechaNacValue || fechaNacValue > new Date()) {
      fechaNacControl.setErrors({ invalidDate: true });
    } else {
      fechaNacControl.setErrors(null);
    }
  }
}

validateRubro() {
  const rubroControl = this.formAsociados.get('rubro');
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



}
