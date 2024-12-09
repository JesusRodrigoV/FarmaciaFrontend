import { Component, OnInit } from '@angular/core';
import { Cliente, Producto, Venta, VentaService } from '../../../services/venta/venta.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../services/producto/producto.service';
import { ClienteService } from '../../../services/cliente/cliente.service';

@Component({
  selector: 'app-venta',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {
  filtroSeleccionado: string = 'dia';
  fecha: string = '';
  mes: number = new Date().getMonth() + 1;
  anio: number = new Date().getFullYear();
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[][] = [];
  mostrarModal = false;
  mostrarModalCliente = false;
  mostrarModalProducto = false;
  verModalDetalles = false;
  ventaSeleccionada: Venta | null = null;


  ventaForm: FormGroup;
  clienteNuevo: Partial<Cliente> = {
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  };

  nuevoProducto = {
    nombre: '',
    descripcion: '',
    categoria: '',
    laboratorio: '',
    stock: 0,
    precio: 0.0,
    fechaVencimiento: '',
    numeroLote: '',
    fechaFabricacion: '',
    formaFarmaceutica: '',
    puntoReorden: 0,
  };

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.ventaForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      total: [{ value: 0, disabled: true }],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.fecha = today.toISOString().split('T')[0];
    this.filtroSeleccionado = 'dia';
    this.filtrarVentas();
    this.cargarVentas();
    this.obtenerClientes();
    this.obtenerProductos();
  }


  mostrarFormularioAgregarProducto() {
    console.log('Boton Pulsado')
    this.mostrarModal = true;
    console.log(this.mostrarModal);
  }

  mostrarModalVenta() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }


  cargarVentas(): void {
    this.ventaService.getAllVentas().subscribe((data) => {
      this.ventas = data;
    });
  }

  limpiarFormulario(): void {

  }

  calcularTotal(): void {
    const total = this.detalles.controls.reduce((acc, detalle) => {
      const cantidad = detalle.get('cantidad')?.value || 0;
      const precioUnitario = detalle.get('precioUnitario')?.value || 0;
      return acc + cantidad * precioUnitario;
    }, 0);
    this.ventaForm.patchValue({ total });
  }


  get detalles() {
    return this.ventaForm.get('detalles') as FormArray;
  }

  agregarDetalle() {
    const detalleForm = this.fb.group({
      producto: [null, Validators.required], // Objeto completo del producto
      productoNombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
    });
    this.detalles.push(detalleForm);
  }


  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  agregarVenta(): void {
    if (this.ventaForm.invalid) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const nuevaVenta: Venta = {
      cliente: this.ventaForm.value.cliente,
      metodoPago: this.ventaForm.value.metodoPago,
      fecha: this.ventaForm.value.fecha,
      total: this.ventaForm.value.total,
      detalles: this.detalles.value.map((detalle: any) => ({
        producto: detalle.producto, // Objeto completo
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
      })),
    };

    this.ventaService.crearVenta(nuevaVenta).subscribe(() => {
      this.cargarVentas();
      this.ventaForm.reset();
      this.mostrarModal = false;
    });
  }



  /* De los clientes */
  mostrarFormCliente(): void {
    this.mostrarModalCliente = true;
  }
  cerrarFormCliente() {
    this.mostrarModalCliente = false;
  }
  obtenerClientes() {
    this.clienteService.getAllClientes().subscribe((data) => {
      this.clientes = data;
    });
  }
  buscarClientes(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(query)
    );
    if (!this.clientesFiltrados.length && query) {
      this.clientesFiltrados = [{ id: 0, nombre: 'Agregar nuevo cliente', direccion: '', email: '', telefono: '' }];
    }
  }
  seleccionarCliente(cliente: any) {
    if (cliente.id === null) {
      // Mostrar formulario para agregar una nueva categoría
      this.mostrarFormCliente();
    } else {
      this.ventaForm.patchValue({ cliente });
      this.clientesFiltrados = [];
    }
  }
  guardarLaboratorio(): void {
    this.clienteService.registrarCliente(this.clienteNuevo).subscribe(() => {
      console.log('Categoria agregada exitosamente')
      this.obtenerClientes();
      this.cerrarFormCliente()
    });
  }

  /* De los productos */
  mostrarFormProducto(): void {
    this.mostrarModalProducto = true;
  }
  cerrarFormProducto() {
    this.mostrarModalProducto = false;
  }
  obtenerProductos() {
    this.productoService.getAllProductos().subscribe(data => {
      this.productos = data;
    });
  }
  buscarProductos(event: Event, index: number): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.productosFiltrados[index] = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
  }
  seleccionarProducto(producto: any, index: number) {
    if (producto.id === null) {
      this.mostrarFormProducto(); // Agregar nuevo producto
    } else {
      const detalle = this.detalles.at(index) as FormGroup;
      detalle.patchValue({
        producto: producto, // Objeto completo
        productoNombre: producto.nombre, // Solo el nombre para mostrar
        precioUnitario: producto.precio,
      });
      this.productosFiltrados[index] = [];
    }
  }
  guardarProducto(): void {
    this.productoService.saveProducto(this.nuevoProducto).subscribe(() => {
      console.log('Producto agregada exitosamente')
      this.obtenerProductos();
      this.cerrarFormProducto()
    });
  }

  /* Mostrar Detalles de la venta */

  mostrarModalDetalles(venta: Venta): void {
    this.verModalDetalles = true;
    this.ventaSeleccionada = venta;
  }
  cerrarModalDetalles() {
    this.verModalDetalles = false;
  }
  /*Utiles */
  isToday(date: string): boolean {
    const today = new Date();
    const ventaDate = new Date(date);
    console.log("Hoy: " + today);
    console.log(ventaDate);
    return today.toDateString() === ventaDate.toDateString();
  }

  filtrarVentas() {
    if (this.filtroSeleccionado === 'dia') {
      this.ventaService.obtenerPorDia(this.fecha).subscribe((data) => (this.ventas = data));
    } else if (this.filtroSeleccionado === 'mes') {
      if (this.mes && (this.mes >= 1 && this.mes <= 12)) {
        this.ventaService.obtenerPorMes(this.anio, this.mes).subscribe((data) => (this.ventas = data));
      } else {
        alert('Por favor ingrese un mes válido (1-12).');
        return;
      }

    } else if (this.filtroSeleccionado === 'anio') {
      if (this.anio && this.anio > 1900) {
        this.ventaService.obtenerPorAño(this.anio).subscribe((data) => (this.ventas = data));
      } else {
        alert('Por favor ingrese un año válido.');
        return;
      }

    } else {
      this.ventaService.getAllVentas().subscribe((data) => (this.ventas = data));
    }
  }
}
