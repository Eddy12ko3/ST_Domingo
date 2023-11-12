import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Auth } from '../interfaces/auth.interface';

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
