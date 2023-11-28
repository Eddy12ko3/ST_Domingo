import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DetailPayment } from '../../../interfaces/pagos.interface';
import { environment } from 'src/environment/environment.prod';

@Injectable({
	providedIn: 'root',
})
export class ApiPersonasService {
	private _refresh = new Subject<void>();

	constructor(private http: HttpClient) {}

	get refresh() {
		return this._refresh;
	}

	public obtenerPersona(): Observable<any> {
		return this.http.get(`${environment.API_REST.URL}/persona/load`);
	}
}
