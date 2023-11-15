import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap} from 'rxjs';
import { DetailPayment } from '../interfaces/pagos.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiPagosService {
    private urlget = 'http://localhost:5000/pagos';
    private _refresh = new Subject<void>();
    
    constructor(private http: HttpClient) { }

    get refresh(){
      return this._refresh; 
    }
    public insertPagos(pagos: DetailPayment){
      return this.http.post(`${this.urlget}/create`, pagos)
      .pipe(
        tap(()=> {
          this._refresh.next(); 
        })
      );
    }
    public obtenerPagos(): Observable<any>{
      return this.http.get(`${this.urlget}/load`);
    }
    
}
