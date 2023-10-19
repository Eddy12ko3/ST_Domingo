import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Producto{
  nombre: string,
  precio: number,
  cantidad: number,
  estado: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlget = 'http://localhost:5000/producto';
  
  constructor(private http: HttpClient) { }

  public getData(): Observable<any>{
    return this.http.get(`${this.urlget}/load`);
  }
  public create(body: Producto): Observable<any>{
    return this.http.post(`${this.urlget}/create`, body);
  }
}
