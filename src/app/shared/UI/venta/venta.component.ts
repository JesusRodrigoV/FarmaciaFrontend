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
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  mostrarModal = false;
  mostrarModalCliente = false;
  mostrarModalProducto = false;

  ventaForm: FormGroup;
  clienteNuevo: Partial<Cliente> = {
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  };

  nuevoProducto: Partial<Producto> = {
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    stock: 0,
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
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
    });
    this.detalles.push(detalleForm);
  }


  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  agregarVenta() {
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
        productoId: detalle.producto.id,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
      })),
    };

    this.ventaService.crearVenta(nuevaVenta).subscribe(
      (ventaCreada) => {
        this.ventas.push(ventaCreada);
        this.cerrarModal();
        this.cargarVentas();
        this.ventaForm.reset();
      },
      (error) => {
        console.error('Error al crear la venta:', error);
      }
    );
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
      this.ventaForm.patchValue({ cliente: cliente.nombre });
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
  buscarProductos(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
  }
  seleccionarProducto(producto: any, index: number) {
    if (producto.id === null) {
      this.mostrarFormProducto(); // Agregar nuevo producto
    } else {
      const detalle = this.detalles.at(index) as FormGroup;
      detalle.patchValue({
        producto: producto.nombre,
        precioUnitario: producto.precio,
      });
      this.productosFiltrados = [];
    }
  }
  guardarProducto(): void {
    this.productoService.saveProducto(this.nuevoProducto).subscribe(() => {
      console.log('Producto agregada exitosamente')
      this.obtenerProductos();
      this.cerrarFormProducto()
    });
  }

}
