import { Component } from '@angular/core';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-trasferencias',
  templateUrl: './trasferencias.component.html',
  styleUrls: ['./trasferencias.component.css']
})
export class TrasferenciasComponent {
  isDarkTheme: boolean = false; // Estado del tema

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();

}
}
