import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PuestosComponent } from './puestos/puestos.component';
import { TrasferenciasComponent } from './trasferencias/trasferencias.component';
import { PagosComponent } from './pagos/pagos.component';
import { ModalComponent } from './modal/modal.component';
import { AuthGuard } from '../service/guard/router-protected.guard';

const routes: Routes = [
  {path: '', component: DashboardComponent, children:[
    {path: 'inicio', component: InicioComponent, canActivate: [AuthGuard]},
    {path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard]},
    {path: 'puestos', component: PuestosComponent, canActivate: [AuthGuard]},
    {path: 'trasferencias', component: TrasferenciasComponent, canActivate: [AuthGuard]},
    {path: 'pagos', component: PagosComponent, canActivate: [AuthGuard]},
    {path: 'modal', component: ModalComponent, canActivate: [AuthGuard]},
    
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
