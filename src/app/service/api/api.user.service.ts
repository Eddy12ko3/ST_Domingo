import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { Auth } from '../../../interfaces/auth.interface';
import { environment } from 'src/environment/environment.prod';

@Injectable({
    providedIn: 'root'
  })
  export class ApiUserService {
    constructor(private http: HttpClient) { }
  
    public register(usuario: User): Observable<any>{
      return this.http.post(`${environment.API_REST.URL}/auth/register`, usuario);
    }

    public login(usuario: Auth): Observable<any>{
        return this.http.post(`${environment.API_REST.URL}/auth/login`, usuario);
    }

    public logout(): void{
      localStorage.clear();
    }

    public getUserInfo(): any {
      const token = localStorage.getItem('SessionToken')
      if (token) {
        // Decodificar el token para obtener información del usuario
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const data = JSON.parse(atob(base64));
        return data;
      }
      return null;
    }
    
  }
