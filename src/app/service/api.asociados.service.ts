import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Associate {
  folio: number;

  numDocument: {
    numDocId: number;
    numDocument: number;
    tipoDocumento: {
      tipoDocId: number;
      description: string;
    };
  };
  name: string;
  lastname: string;
  date_birth: Date;
  gender: number;
  document: number;
  direccion: string;
  celular: number;
  operador: number;
  code: string;
  area: string;
  sector: string;
  rubro: string;
  
}






@Injectable({
  providedIn: 'root'
})
export class ApiAsociadosService {
  private urlget = 'http://localhost:5000/asociado';
  constructor(private http: HttpClient) { }

  public insertAsociado(asociados: Associate){
    return this.http.post(`${this.urlget}/create`, asociados);
  }

  public obtenerAsociado(): Observable<any>{
    return this.http.get(`${this.urlget}/load`);
  }

  
}
