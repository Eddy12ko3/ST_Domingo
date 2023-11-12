import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Associate } from '../interfaces/asociado.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiAsociadosService {
  private urlget = 'http://localhost:5000/asociado';
  private _refresh = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh(){
    return this._refresh; 
  }
  public insertAsociado(asociados: Associate){
    return this.http.post(`${this.urlget}/create`, asociados)
      .pipe(
        tap(()=> {
          this._refresh.next(); 
        })
      )
  }

  public obtenerAsociado(): Observable<any>{
    return this.http.get(`${this.urlget}/load`);
  }

  
}
