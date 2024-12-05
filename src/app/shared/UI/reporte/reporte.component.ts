import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto/producto.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reporte',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit{
  productos: any[] = [];
  pieChart: any;
  totalProductos = 0;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.contarProductos();
  }
  contarProductos(): void{
    this.productoService.getAllProductos().subscribe((data) => {
      this.productos = data;
      this.totalProductos = this.productos.length;
    });
  }
  obtenerProductos(): void {
    this.productoService.getAllProductos().subscribe((data) => {
      this.productos = data;
      this.crearGrafico();
    });
  }


  crearGrafico(): void {
    const labels = this.productos.map((producto) => producto.nombre);
    const data = this.productos.map((producto) => producto.cantidad);

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data: data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }
  getAlertClass(producto: any): string {
    if (producto.cantidad <= 5) return 'red';
    else if (producto.cantidad <= 10) return 'yellow';
    return 'green';
  }
}
