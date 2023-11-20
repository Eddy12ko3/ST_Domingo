import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { ApiUserService } from 'src/app/service/api/api.user.service';
import { NotificationService } from 'src/app/service/controllers/notification.service';
import { CountPorRubroService } from 'src/app/service/CountPorRubro.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{
  isDarkTheme = false; // Estado del tema
  userInfo: any;
  
  // Datos para el primer gráfico
  cantidadTotalSocios = 1000;
  porcentajeTotalSocios = 100;
  
  // Datos para el segundo gráfico
  cantidadAsociados = 100;
  porcentajeAsociados = 95;
  
  // Datos para el tercer gráfico
  cantidadLocalesDisponibles = 20;
  porcentajeLocalesDisponibles = 5;

  countPorRubro: Record<string, number> = {}; 

  constructor(
    private themeService: ThemeService,
    private userService: ApiUserService,
    private notificationService: NotificationService,
    private countPorRubroService: CountPorRubroService,
  ) {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkTheme = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.actualizarCountPorRubro();
  }

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

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  loadUserInfo(): void{
    const datos = this.userService.getUserInfo();
    this.userInfo = JSON.parse(datos.userId) 
  }
  private actualizarCountPorRubro() {
    this.countPorRubroService.getCountPorRubro().subscribe((countPorRubro) => {
      this.countPorRubro = countPorRubro;

      
    });
  }

}
