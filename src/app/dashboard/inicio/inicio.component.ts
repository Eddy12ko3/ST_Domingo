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
  cantidadAsociados: number = 980; 
  cantidadLocalesDisponibles: number = 20;
  cantidadTotalSocios: number = 1000;

  get porcentajeTotalSocios(): number {
    // Calcula el porcentaje de socios
    return (this.cantidadTotalSocios / 1000) * 100; // Suponiendo 1000 como el total máximo de socios
  }

  get longitudCircunferenciaTotalSocios(): number {
    // Calcula la longitud de la circunferencia completa para el total de socios
    return 2 * Math.PI * 36; // El radio del círculo es 36
  }

  get longitudPorcentajeTotalSocios(): number {
    // Calcula la longitud de la porción de socios
    const porcentaje = this.porcentajeTotalSocios > 100 ? 100 : this.porcentajeTotalSocios;
    return (porcentaje / 100) * this.longitudCircunferenciaTotalSocios;
  }

  get dashArrayTotalSocios(): string {
    // Usa la longitud total del círculo como dashArray
    return `${this.longitudCircunferenciaTotalSocios} ${this.longitudCircunferenciaTotalSocios}`;
  }

  get dashOffsetTotalSocios(): string {
    // Calcula el desplazamiento necesario para el efecto de llenado de socios
    return `${this.longitudCircunferenciaTotalSocios - this.longitudPorcentajeTotalSocios}`;
  }

  get porcentajeOcupado(): number {
    // Calcula el porcentaje ocupado
    return (this.cantidadAsociados / 1000) * 100; // Suponiendo 1000 como la capacidad máxima
  }

  get porcentajeDisponible(): number {
    // Calcula el porcentaje disponible
    return ((1000 - this.cantidadAsociados) / 1000) * 100; // Suponiendo 1000 como la capacidad máxima
  }

  get longitudCircunferencia(): number {
    // Calcula la longitud de la circunferencia completa
    return 2 * Math.PI * 36; // El radio del círculo es 36
  }

  get dashArray(): string {
    // Calcula la longitud de la porción ocupada
    const porcentaje = this.porcentajeOcupado > 100 ? 100 : this.porcentajeOcupado;
    const longitudPorcentaje = (porcentaje / 100) * this.longitudCircunferencia;
    return `${longitudPorcentaje} ${this.longitudCircunferencia}`;
  }

  get dashOffset(): string {
    // Calcula el desplazamiento necesario para el efecto de llenado
    const porcentaje = this.porcentajeOcupado > 100 ? 100 : this.porcentajeOcupado;
    const longitudPorcentaje = (porcentaje / 100) * this.longitudCircunferencia;
    return `${this.longitudCircunferencia - longitudPorcentaje}`;
  }
  get longitudCircunferenciaDisponible(): number {
    // Calcula la longitud de la circunferencia completa para los locales disponibles
    return 2 * Math.PI * 36; // El radio del círculo es 36
  }

  get dashArrayDisponible(): string {
    // Calcula la longitud de la porción disponible
    const porcentaje = this.porcentajeDisponible > 100 ? 100 : this.porcentajeDisponible;
    const longitudPorcentaje = (porcentaje / 100) * this.longitudCircunferenciaDisponible;
    return `${longitudPorcentaje} ${this.longitudCircunferenciaDisponible}`;
  }

  get dashOffsetDisponible(): string {
    // Calcula el desplazamiento necesario para el efecto de llenado de los locales disponibles
    const porcentaje = this.porcentajeDisponible > 100 ? 100 : this.porcentajeDisponible;
    const longitudPorcentaje = (porcentaje / 100) * this.longitudCircunferenciaDisponible;
    return `${this.longitudCircunferenciaDisponible - longitudPorcentaje}`;
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
