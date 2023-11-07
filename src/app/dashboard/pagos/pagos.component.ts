import { Component } from '@angular/core';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
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
