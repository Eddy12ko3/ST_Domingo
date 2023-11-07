import { Component } from '@angular/core';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent {
  isDarkTheme: boolean = false; // Estado del tema
  icon = 'save'; // Icono inicial
  buttonText = 'Guardar'; // Texto inicial
  isButtonClicked = false; 
  showModal = false;
  imageUrl: string = 'assets/registro/perfil.png';
 
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
  cambiarEstadoBoton() {
    this.isButtonClicked = !this.isButtonClicked;
    if (this.isButtonClicked) {
      this.icon = 'check_circle'; // Cambiar a otro icono cuando se hace clic
      this.buttonText = 'Guardado'; // Cambiar el texto cuando se hace clic
    } else {
      this.icon = 'save'; // Cambiar de vuelta al icono original
      this.buttonText = 'Guardar'; // Cambiar de vuelta al texto original
    }
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
}
