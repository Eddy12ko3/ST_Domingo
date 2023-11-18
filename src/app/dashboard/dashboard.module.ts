import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PagosComponent } from './pagos/pagos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { TrasferenciasComponent } from './trasferencias/trasferencias.component';
import { InicioComponent } from './inicio/inicio.component';
import { PuestosComponent } from './puestos/puestos.component';
import { ModalComponent } from './modal/modal.component';
import { ThemeService } from '../service/controllers/theme.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    PagosComponent,
    ReportesComponent,
    TrasferenciasComponent,
    InicioComponent,
    PuestosComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ThemeService],
})
export class DashboardModule { }
