import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { ApiUserService } from 'src/app/service/api/api.user.service';
import { NotificationService } from 'src/app/service/controllers/notification.service';
import { CountPorRubroService } from 'src/app/service/controllers/CountPorRubro.service';
import {
	addDays,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	format,
	isSameMonth,
	addMonths,
	subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
	isDarkTheme = false; // Estado del tema
	userInfo: any;
	totalAsociados: number = 0;

	maxTotalAsociados: number = 1000;
	diferenciaAsociados: number = 0;
	porcentajeDiferencia: number = 0;
	maxLocalesDisponibles: number = 1000;

	// Datos para el primer gráfico
	cantidadTotalSocios = 1000;
	porcentajeTotalSocios = 100;

	countPorRubro: Record<string, number> = {};
	currentDate = new Date();
	currentDateTime: Date = new Date();
	constructor(
		private themeService: ThemeService,
		private userService: ApiUserService,
		private notificationService: NotificationService,
		private countPorRubroService: CountPorRubroService,
	) {
		this.themeService.isDarkMode$.subscribe((isDarkMode) => {
			this.isDarkTheme = isDarkMode;
		});
	}

	ngOnInit(): void {
		this.loadUserInfo();
		this.actualizarCountPorRubro();
		setInterval(() => {
			this.currentDateTime = new Date();
		}, 1000);
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

	private calculateColor(porcentaje: number): string {
		const targetColor = [71, 245, 193]; // Color deseado #47F5C1

		return `rgb(${targetColor.join(',')})`;
	}

	toggleTheme() {
		this.themeService.toggleDarkMode();
	}
	getMonthGrid() {
		const weeks = [];
		const startMonth = startOfMonth(this.currentDate);
		const endMonth = endOfMonth(this.currentDate);

		let startDate = startOfWeek(startMonth, { weekStartsOn: 0 });

		while (startDate <= endMonth) {
			const week = [];
			for (let i = 0; i < 7; i++) {
				week.push({
					date: format(startDate, 'yyyy-MM-dd', { locale: es }),
					isCurrentMonth: isSameMonth(startDate, startMonth),
				});
				startDate = addDays(startDate, 1);
			}
			weeks.push(week);
		}

		return weeks;
	}

	navigate(months: number) {
		this.currentDate =
			months > 0 ? addMonths(this.currentDate, 1) : subMonths(this.currentDate, 1);
	}

	isToday(date: string): boolean {
		const today = new Date();

		const dateToCompare = new Date(date);

		return (
			dateToCompare.getDate() === today.getDate() - 1 &&
			dateToCompare.getMonth() === today.getMonth() &&
			dateToCompare.getFullYear() === today.getFullYear()
		);
	}

	loadUserInfo(): void {
		const datos = this.userService.getUserInfo();
		this.userInfo = JSON.parse(datos.userId);
	}
	private actualizarCountPorRubro() {
		this.countPorRubroService
			.getCountPorRubro()
			.subscribe(({ countPorRubro, totalAsociados }) => {
				this.countPorRubro = countPorRubro;
				this.totalAsociados = totalAsociados || 0;

				this.diferenciaAsociados = this.maxTotalAsociados - this.totalAsociados;

				// Calcular el porcentaje
				this.porcentajeDiferencia =
					(this.diferenciaAsociados / this.maxTotalAsociados) * 100;
			});
	}
	calcularStrokeDasharray(): string {
		const porcentaje = (this.totalAsociados / this.maxTotalAsociados) * 100;
		const circunferencia = 2 * Math.PI * 45; // ajusta el radio según tu diseño
		const longitudSegmento = (porcentaje / 100) * circunferencia;
		const longitudRestante = circunferencia - longitudSegmento;

		return `${longitudSegmento} ${longitudRestante}`;
	}
	calcularStrokeDasharrayLocalesDisponibles(): string {
		const porcentaje = this.porcentajeDiferencia;
		const circunferencia = 2 * Math.PI * 45; // ajusta el radio según tu diseño
		const longitudSegmento = (porcentaje / 100) * circunferencia;
		const longitudRestante = circunferencia - longitudSegmento;

		return `${longitudSegmento} ${longitudRestante}`;
	}
}
