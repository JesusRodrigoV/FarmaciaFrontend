import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { ReporteComponent } from '../reporte/reporte.component';
import { InventarioComponent } from '../inventario/inventario.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, AppRoutingModule, LoginComponent, NavbarComponent, ReporteComponent, InventarioComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
