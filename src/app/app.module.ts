import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosComponent } from './productos/productos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authSessionGuard } from './service/auth-session.guard';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    // Registra el interceptor como un proveedor
    { provide: HTTP_INTERCEPTORS, useClass: authSessionGuard, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule{ }
