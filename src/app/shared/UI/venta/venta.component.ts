import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DetalleVenta, Venta, VentaService } from '../../../services/venta/venta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-venta',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  mostrarModal: boolean = false;
  nuevaVenta: Venta = {
    cliente: '',
    metodoPago: '',
    fecha:'',
    total: 0,
    detalles: [], // Campo adicional para detalles en texto
  };

  venta: Venta = {
    cliente: '',
    fecha:'',
    metodoPago: '',
    total: 0,
    detalles: []
  };
  detalle: DetalleVenta = {
    productoId: 0,
    cantidad: 0,
    precio: 0
  };
  constructor(private ventaService: VentaService) {}
  mostrarFormularioAgregarProducto() {
    console.log('Boton Pulsado')
    this.mostrarModal = true;
    console.log(this.mostrarModal);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.getAllVentas().subscribe((data) => {
      this.ventas = data;
    });
  }

  agregarVenta(): void {
    this.venta.fecha = new Date().toISOString();
    this.venta.detalles.push({ ...this.detalle });

    this.ventaService.saveVenta(this.venta).subscribe(() => {
      alert('Venta agregada exitosamente');
      this.limpiarFormulario();
    });
  }

  limpiarFormulario(): void {
    this.venta = {
      cliente: '',
      fecha:'',
      metodoPago: '',
      total: 0,
      detalles: []
    };
    this.detalle = {
      productoId: 0,
      cantidad: 0,
      precio: 0
    };
  }
}
