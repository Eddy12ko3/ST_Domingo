import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap} from 'rxjs';
import { DetailPayment } from '../../../interfaces/pagos.interface';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiPagosService {
    private _refresh = new Subject<void>();
    
    constructor(private http: HttpClient) { }

    get refresh(){
      return this._refresh; 
    }
    public insertPagos(pagos: DetailPayment){
      return this.http.post(`${environment.API_REST.URL}/pagos/create`, pagos)
      .pipe(
        tap(()=> {
          this._refresh.next(); 
        })
      );
    }
    public obtenerPagos(): Observable<any>{
      return this.http.get(`${environment.API_REST.URL}/pagos/load`);
    }
    
}
