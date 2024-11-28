
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto/producto.service';

@Component({
    selector: 'app-inventario',
    imports: [FormsModule, CommonModule, NavbarComponent],
    templateUrl: './inventario.component.html',
    styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  productos: any[] = [];
  nuevoProducto: any = {};
  mostrarModal: boolean = false;

  constructor(private productoService: ProductoService) {
    this.obtenerProductos();
  }


  obtenerProductos() {
    this.productoService.getAllProductos().subscribe(data => {
      this.productos = data;
    });
  }
  mostrarFormularioAgregarProducto() {
    console.log('Boton Pulsado')
    this.mostrarModal = true;
    console.log(this.mostrarModal);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
  getAlertClass(producto: any): string {
    if (producto.cantidad <= 5) return 'red';
    else if (producto.cantidad <= 10) return 'yellow';
    return 'green';
  }


  agregarProducto() {
    this.productoService.saveProducto(this.nuevoProducto).subscribe(data => {
      this.productos.push(data);
      this.nuevoProducto = {};
      this.mostrarModal = false;
    });
  }

}
