import { Component } from '@angular/core';
import { ThemeService } from '../service/controllers/theme.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
	constructor(private themeService: ThemeService) {
		// Puedes utilizar el servicio en este componente y sus rutas hijas.
	}
}
