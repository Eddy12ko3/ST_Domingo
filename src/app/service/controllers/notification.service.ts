import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PositionToastr } from 'src/interfaces/proyect.interface';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	constructor(private notification: ToastrService) {}

	show(message?: string, title?: string, position: PositionToastr = PositionToastr.top_right) {
		return this.notification.success(message, title, {
			positionClass: position,
		});
	}
	success(message?: string, title?: string, position: PositionToastr = PositionToastr.top_right) {
		return this.notification.success(message, title, {
			positionClass: position,
		});
	}
	error(message?: string, title?: string, position: PositionToastr = PositionToastr.top_right) {
		return this.notification.error(message, title, {
			positionClass: position,
		});
	}
	info(message?: string, title?: string, position: PositionToastr = PositionToastr.top_right) {
		return this.notification.info(message, title, {
			positionClass: position,
		});
	}
	warning(message?: string, title?: string, position: PositionToastr = PositionToastr.top_right) {
		return this.notification.warning(message, title, {
			positionClass: position,
		});
	}
	errorEvent(event: HttpErrorResponse) {
		if (event.error.error) {
			this.notification.error(event.error.error, event.error.errorRaw);
		} else {
			this.notification.error(
				'Ocurrió un error desconocido, contactar con el equipo de soporte.',
				'Error',
			);
			console.error('Error desconocido: ', event.error);
		}
	}
}
