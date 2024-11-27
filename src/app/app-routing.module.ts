import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { VentaComponent } from './venta/venta.component';
import { ReporteComponent } from './reporte/reporte.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inventario', component: InventarioComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'login', component: LoginComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
