import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

export interface DetailPayment{
   
    datepayment:Date; 
    amount: number;
    person: {
      name: string;
      lastname: string;
      date_birth: Date;
    };
}


@Injectable({
  providedIn: 'root'
})
export class ApiPagosService {
    private urlget = 'http://localhost:5000/pagos';
    constructor(private http: HttpClient) { }
  
    public insertPagos(pagos: DetailPayment){
      return this.http.post(`${this.urlget}/create`, pagos);
    }
    public obtenerPagos(): Observable<any>{
      return this.http.get(`${this.urlget}/load`);
    }
    
    
}
