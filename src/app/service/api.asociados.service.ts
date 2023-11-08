import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Associate{
    folio: number;
    numDocument: number;
    name: string;
    lastname: string;
    date_birth: Date;
    gender: number;
    document: number
    direccion: string
    celular: number,
    operador: number;
    code: string, 
    area: string,
    sector: string
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
}
