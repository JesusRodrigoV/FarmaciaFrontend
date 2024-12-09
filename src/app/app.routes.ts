import { Routes } from '@angular/router';
import { LoginComponent } from './shared/UI/login/login.component';
import { ReporteComponent } from './shared/UI/reporte/reporte.component';
import { VentaComponent } from './shared/UI/venta/venta.component';
import LayoutComponent from './shared/UI/layout/layout.component';
import { InexistenteComponent } from './shared/UI/inexistente/inexistente.component';
import { GestionClienteComponent } from './shared/UI/gestion-cliente/gestion-cliente.component';
import { GestionCategoriaComponent } from './shared/UI/gestion-categoria/gestion-categoria.component';
import { GestionLaboratorioComponent } from './shared/UI/gestion-laboratorio/gestion-laboratorio.component';
import { GestionUsuariosComponent } from './shared/UI/gestionUsuarios/gestion-usuarios/gestion-usuarios.component';
import { CategoriaFormComponent } from './shared/UI/categoriaForm/categoria-form/categoria-form.component';
import { BienvenidaComponent } from './shared/UI/bienvenida/bienvenida.component';

export const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: '', component: LayoutComponent ,
    children:[
      {path: '', component:BienvenidaComponent}
    ]
  },
  {
    path: 'gestion',
    loadComponent: () => import('./shared/UI/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/UI/dashboard/dashboard.component'),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./shared/UI/inventario/inventario.component'),
      },
      {
        path: 'reporte',
        component: ReporteComponent
      },
      {
        path: 'venta',
        component: VentaComponent
      },
      {
        path: '',
        loadComponent: () => import('./shared/UI/inventario/inventario.component'),
      },
      { path: 'cliente', component: GestionClienteComponent},
      { path: 'categoria', component: GestionCategoriaComponent},
      { path: 'laboratorio', component: GestionLaboratorioComponent},
      { path: 'usuario', component: GestionUsuariosComponent}
    ]

  },

  { path: '**', component: InexistenteComponent}
  //{path:'dashboard', component: LoginComponent},
];
