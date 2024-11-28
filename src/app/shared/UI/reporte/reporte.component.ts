import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto/producto.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit{
  productos: any[] = [];
  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
      this.obtenerProductos();
  }
  obtenerProductos() {
    this.productoService.getAllProductos().subscribe(data => {
      this.productos = data;
    });
  }
  getAlertClass(producto: any): string {
    if (producto.cantidad <= 5) return 'red';
    else if (producto.cantidad <= 10) return 'yellow';
    return 'green';
  }
}
