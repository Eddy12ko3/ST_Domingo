import { Component } from '@angular/core';
import { ThemeService } from './../theme.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isDarkTheme: boolean = false;
  isMoonIcon: boolean = true;

  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  toggleTheme() {
    console.log('toggleTheme() se ha activado');
    this.themeService.toggleDarkMode();
    this.isMoonIcon = !this.isMoonIcon;
  }
  
  
}

