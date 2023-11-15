import { Component , OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiAsociadosService } from 'src/app/service/api.asociados.service';
import { AssociateId } from 'src/app/interfaces/asociado-extend.interface';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit, OnDestroy {
  isDarkTheme: boolean = false; // Estado del tema
  isButtonClicked = false;
  showModal = false;
  showModalEdit = false;
  imageUrl: string = 'assets/registro/perfil.png';
  formAsociados!:FormGroup;
  dataAsociados: Array<AssociateId> = new Array<AssociateId>();
  suscription!: Subscription;
  busquedaDni: string = '';
  busquedaRubro: string = '';
  busquedaNombre: string = '';
  busquedaApellido: string = '';
  resultadosBusqueda: any[] = [];
  selectedAsociado: any;


  constructor(private themeService: ThemeService,
    private asociadosService: ApiAsociadosService,
    private formGroup: FormBuilder,
    private toastr: ToastrService) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.obtenerAsociados();
    this.formAsociados = this.formGroup.group({
      folio: ["" , [Validators.required, Validators.maxLength(7)]],
      nombre: ["" , [Validators.required, Validators.maxLength(50)]],
      apellido: ["" , [Validators.required, Validators.maxLength(50)]],
      numDocumento: ["" , [Validators.required, Validators.maxLength(12)]],
      fecha_nac: ["", [Validators.required]],
      document: ["", [Validators.required]],
      genero: ["",  [Validators.required]],
      telefono: ["", [Validators.required, Validators.maxLength(9)]],
      operador: ["", [Validators.required]],
      direccion: ["", [Validators.required, Validators.maxLength(100)]],
      rubro: ["", [Validators.required]],
      area: ["", [Validators.required ,Validators.maxLength(20)]],
      code: ["", [Validators.required ,Validators.maxLength(10)]],
      sector: ["", [Validators.required ,Validators.maxLength(20)]],

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

  abrir(asociado: any) {
    this.selectedAsociado = asociado;
    this.showModalEdit = true;
  }

  cerrar() {
    this.showModalEdit = false;
    this.formAsociados.reset();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  obtenerAsociados(){
    this.asociadosService.obtenerAsociado().subscribe((asociados) => {
      this.dataAsociados = asociados;
      // Inicializar resultadosBusqueda con la lista completa al principio
      this.resultadosBusqueda = [...this.dataAsociados];
      console.log(this.dataAsociados);
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
      }).subscribe((asociado: any)=>{
        this.closeModal()
        this.formAsociados.reset();
        this.toastr.success("Asociado agregado correctamente", "¡Exito!", { closeButton: true});
      })

    }
  }

  actualizarAsociados(){
    if (this.formAsociados.valid){
      this.asociadosService.updateAsociado(this.selectedAsociado?.associateId,{
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
      }).subscribe((asociado: any)=>{
        this.cerrar();
        this.formAsociados.reset();
        this.toastr.success("Asociado actualizado correctamente", "¡Exito!", { closeButton: true});
      })

    }
  }

  eliminarAsociados(asociadoId: string) {
    if (this.formAsociados.valid) {
      this.asociadosService.deleteAsociado(asociadoId).subscribe( (asociadoId)=> {
      console.log(asociadoId)
      })
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
      if (areaValue && !areaValue.endsWith('mts.')) {
        areaValue += ' mts.';
        areaControl.setValue(areaValue);
      }
    }
  }
}
