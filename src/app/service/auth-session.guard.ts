import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class authSessionGuard implements HttpInterceptor{ 
    constructor(private router: Router){}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem('SessionToken');
        if(token){
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            }
          });
        }
        return next.handle(req).pipe(
          catchError((err: HttpErrorResponse) =>{
            if(err.status === 401){
              localStorage.clear();
              this.router.navigate(['/login'])
            }
            return throwError(()=> err)
          }),
        );  
    }
}
