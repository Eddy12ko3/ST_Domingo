import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUserService } from '../service/api/api.user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/controllers/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    formLogin!: FormGroup;

    constructor(
        private apiService: ApiUserService,
        private formGroup: FormBuilder,
        private router: Router,
        private notificationService: NotificationService
    ) {}
    ngOnInit(): void {
        this.formLogin = this.formGroup.group({
            usuario: ['', [Validators.required, Validators.maxLength(8)]],
            contraseña: ['', [Validators.required, Validators.maxLength(50)]],
        });
    }

    loginUser() {
        if (this.formLogin.valid) {
            this.apiService
                .login({
                    numDocument: this.formLogin.get('usuario')?.value ?? 0,
                    password: this.formLogin.get('contraseña')?.value ?? '',
                })
                .subscribe({
                    next: value => {
                        localStorage.setItem('SessionToken', value);
                        this.notificationService.success(
                            'Has sido logueado correctamente',
                            'Bienvenido'
                        );
                        this.router.navigate(['/dashboard/inicio']);
                    },
                    error: value => {
                        this.notificationService.errorEvent(value);
                    },
                });
        }
    }
}
