import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PuestosComponent } from './puestos/puestos.component';
import { TrasferenciasComponent } from './trasferencias/trasferencias.component';
import { PagosComponent } from './pagos/pagos.component';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children:[
    {path: 'inicio', component: InicioComponent},
    {path: 'reportes', component: ReportesComponent},
    {path: 'puestos', component: PuestosComponent},
    {path: 'trasferencias', component: TrasferenciasComponent},
    {path: 'pagos', component: PagosComponent},
    {path: 'modal', component: ModalComponent},
    
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
