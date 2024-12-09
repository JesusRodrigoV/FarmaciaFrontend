import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto/producto.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../services/venta/venta.service';

@Component({
  selector: 'app-reporte',
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit{
  productos: any[] = [];
  productosFiltrados: Producto[] = [];
  pieChart: any;
  totalProductos = 0;
  nombreProducto: string = ''; // Nombre del producto ingresado por el usuario
  productoSeleccionado: any = null; // Datos del producto seleccionado
  productoNoEncontrado: boolean = false; // Indicador de producto no encontrado
  costoPedido: number = 0; // Costo de pedido ingresado
  costoAlmacenamiento: number = 0; // Costo de almacenamiento ingresado

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



  buscarProducto(): void {
    if (!this.nombreProducto.trim()) {
      alert('Por favor ingresa el nombre de un producto.');
      return;
    }

    this.productoService.buscarProductosPorNombre(this.nombreProducto).subscribe({
      next: (productos) => {
        if (productos && productos.length > 0) {
          this.productoSeleccionado = productos[0]; // Selecciona el primer producto encontrado
          this.productoNoEncontrado = false;
        } else {
          this.productoNoEncontrado = true;
          this.productoSeleccionado = null;
        }
      },
      error: (err) => {
        console.error('Error al buscar el producto:', err);
        this.productoNoEncontrado = true;
      },
    });
  }

  calcularEOQ(): void {
    if (this.costoPedido <= 0 || this.costoAlmacenamiento <= 0) {
      alert('Por favor ingresa valores válidos para los costos.');
      return;
    }

    this.productoService
      .calcularInventario(this.productoSeleccionado.id, this.costoPedido, this.costoAlmacenamiento)
      .subscribe({
        next: (productoActualizado) => {
          this.productoSeleccionado = productoActualizado;
          alert(`EOQ calculado: ${productoActualizado.eoq}\nPunto de Reorden: ${productoActualizado.puntoReorden}`);
        },
        error: (err) => {
          console.error('Error al calcular EOQ:', err);
        },
      });
  }
  buscarProductos(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
  }
  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.nombreProducto = producto.nombre; // Autocompletar el input
    this.productosFiltrados = []; // Ocultar la lista de sugerencias
  }
}
