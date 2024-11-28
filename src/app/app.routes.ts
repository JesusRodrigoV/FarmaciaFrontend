import { Routes } from '@angular/router';
import { LoginComponent } from './shared/UI/login/login.component';
import { VentaComponent } from './shared/UI/venta/venta.component';
import { ReporteComponent } from './shared/UI/reporte/reporte.component';
import { InventarioComponent } from './shared/UI/inventario/inventario.component';
import { VentaFormComponent } from './shared/UI/venta-form/venta-form.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'ventaform', component: VentaFormComponent },
];
