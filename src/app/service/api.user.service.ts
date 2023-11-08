import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Auth{
    numDocument: number;
    password: string;
}

interface User extends Auth{
    name: string;
    lastname: string;
    date_birth: Date;
    gender: string;
    document: string;
}
@Injectable({
    providedIn: 'root'
  })
  export class ApiUserService {
  
    private urlget = 'http://localhost:5000/auth';
    
    constructor(private http: HttpClient) { }
  
    public register(usuario: User): Observable<any>{
      return this.http.post(`${this.urlget}/register`, usuario);
    }

    public login(usuario: Auth): Observable<any>{
        return this.http.post(`${this.urlget}/login`, usuario);
      }
  }
