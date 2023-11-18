import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Associate } from '../../../interfaces/asociado.interface';
import { environment } from 'src/environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiAsociadosService {
  private _refresh = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh(){
    return this._refresh;
  }
  public insertAsociado(asociados: Associate){
    return this.http.post(`${environment.API_REST.URL}/asociado/create`, asociados)
      .pipe(
        tap(()=> {
          this._refresh.next();
        })
      )
  }

  public obtenerAsociado(): Observable<any>{
    return this.http.get(`${environment.API_REST.URL}/asociado/load`);
  }

  public updateAsociado(id:string,asociados: Associate){
    return this.http.put(`${environment.API_REST.URL}/asociado/update/${id}`, asociados)
      .pipe(
        tap(()=> {
          this._refresh.next();
        })
      )
  }

  public deleteAsociado(id:string){
    return this.http.delete(`${environment.API_REST.URL}/asociado/delete/${id}`)
      .pipe(
        tap(()=> {
          this._refresh.next();
        })
      )
  }
}
