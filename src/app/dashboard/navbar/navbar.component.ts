import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/controllers/theme.service';
import { ApiUserService } from 'src/app/service/api/api.user.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
	isDarkTheme: boolean = false;
	isMoonIcon: boolean = true;
	userInfo: any;

	constructor(
		private themeService: ThemeService,
		private userService: ApiUserService,
	) {
		this.themeService.isDarkMode$.subscribe((isDark) => {
			this.isDarkTheme = isDark;
		});
	}

	ngOnInit(): void {
		this.loadUserInfo();
	}

	toggleTheme() {
		console.log('toggleTheme() se ha activado');
		this.themeService.toggleDarkMode();
		this.isMoonIcon = !this.isMoonIcon;
	}

	logout(): void {
		this.userService.logout();
	}

	loadUserInfo(): void {
		const datos = this.userService.getUserInfo();
		this.userInfo = JSON.parse(datos.userId);
	}
}
