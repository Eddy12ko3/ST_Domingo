import { Component } from '@angular/core';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  

  isDarkTheme: boolean = false; // Estado del tema
  icon = 'save'; // Icono inicial
  buttonText = 'Guardar'; // Texto inicial
  isButtonClicked = false; 
 

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
}
