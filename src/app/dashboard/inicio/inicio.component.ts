import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { ApiUserService } from 'src/app/service/api.user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  isDarkTheme: boolean = false; // Estado del tema
  userInfo: any

  constructor(private themeService: ThemeService,
    private userService: ApiUserService) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }
  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  loadUserInfo(): void{
    const datos = this.userService.getUserInfo();
    this.userInfo = JSON.parse(datos.userId) 
  }
}
