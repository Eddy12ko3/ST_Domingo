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
  }

  abrir() {
    this.showModalEdit = true;
  }

  cerrar() {
    this.showModalEdit = false;
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
    this.asociadosService.obtenerAsociado().subscribe((asociados)=>{
      if (asociados && asociados.length > 0) {
        this.dataAsociados = asociados;
      } else {
        console.log("no hay registros")
      }
      
    })
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
        this.toastr.success("Asociado agregado correctamente", "¡Exito!", { closeButton: true});
      })
    }
  }
}
