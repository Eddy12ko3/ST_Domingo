import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUserService } from '../service/api/api.user.service';
import { Router } from '@angular/router';
import { User } from 'src/interfaces/user.interface';
import { NotificationService } from '../service/controllers/notification.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	formRegister!: FormGroup;
	dataUsers: Array<User> = new Array<User>();

	constructor(
		private apiservice: ApiUserService,
		private formgroup: FormBuilder,
		private router: Router,
		private notificationService: NotificationService,
	) {}

	ngOnInit(): void {
		this.formRegister = this.formgroup.group({
			usuario: ['', [Validators.required, Validators.maxLength(8)]],
			contraseña: ['', [Validators.required, Validators.maxLength(50)]],
			nombre: ['', [Validators.required, Validators.maxLength(50)]],
			apellidos: ['', [Validators.required, Validators.maxLength(50)]],
			fecha_nac: ['', [Validators.required]],
			tipodoc: ['', [Validators.required]],
		});
	}

	registrarUsuario() {
		console.log(this.formRegister.value);
		if (this.formRegister.valid) {
			this.apiservice
				.register({
					numDocument: this.formRegister.get('usuario')?.value ?? 0,
					password: this.formRegister.get('contraseña')?.value ?? '',
					name: this.formRegister.get('nombre')?.value ?? '',
					lastname: this.formRegister.get('apellidos')?.value ?? '',
					date_birth: this.formRegister.get('fecha_nac')?.value ?? '',
					document: this.formRegister.get('tipodoc')?.value ?? '',
				})
				.subscribe({
					next: (value) => {
						this.notificationService.success(value.success);
						this.router.navigate(['/login']);
					},
					error: (value) => {
						this.notificationService.errorEvent(value);
					},
				});
		}
	}
}
