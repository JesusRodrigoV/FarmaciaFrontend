import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { ReporteComponent } from '../reporte/reporte.component';
import { InventarioComponent } from '../inventario/inventario.component';

@Component({
    selector: 'app-navbar',
    imports: [ LoginComponent, NavbarComponent, ReporteComponent, InventarioComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
