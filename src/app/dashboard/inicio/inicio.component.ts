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
  userInfo: any;
  



  // Datos para el primer gráfico
  cantidadTotalSocios: number = 1000;
  porcentajeTotalSocios: number = 100;

  // Datos para el segundo gráfico
  cantidadAsociados: number = 100;
  porcentajeAsociados: number = 95;

  // Datos para el tercer gráfico
  cantidadLocalesDisponibles: number = 20;
  porcentajeLocalesDisponibles: number = 5;


  // Métodos para el primer gráfico
  get dashArrayTotalSocios(): string {
    return '283'; // 2 * π * radio
  }

  get dashOffsetTotalSocios(): string {
    const porcentajeDecimal = this.porcentajeTotalSocios / 100;
    return String((1 - porcentajeDecimal) * parseFloat(this.dashArrayTotalSocios));
  }

  get progressBarColorTotalSocios(): string {
    return this.calculateColor(this.porcentajeTotalSocios);
  }

  // Métodos para el segundo gráfico
  get dashArrayAsociados(): string {
    return '283'; // 2 * π * radio
  }

  get dashOffsetAsociados(): string {
    const porcentajeDecimal = this.porcentajeAsociados / 100;
    return String((1 - porcentajeDecimal) * parseFloat(this.dashArrayAsociados));
  }

  get progressBarColorAsociados(): string {
    return this.calculateColor(this.porcentajeAsociados);
  }

  // Métodos para el tercer gráfico
  get dashArrayLocalesDisponibles(): string {
    return '283'; // 2 * π * radio
  }

  get dashOffsetLocalesDisponibles(): string {
    const porcentajeDecimal = this.porcentajeLocalesDisponibles / 100;
    return String((1 - porcentajeDecimal) * parseFloat(this.dashArrayLocalesDisponibles));
  }

  get progressBarColorLocalesDisponibles(): string {
    return this.calculateColor(this.porcentajeLocalesDisponibles);
  }

  private calculateColor(porcentaje: number): string {
    const targetColor = [71, 245, 193]; // Color deseado #47F5C1
  
    return `rgb(${targetColor.join(',')})`;
  }
  
  

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
