import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DetalleVenta, Venta, VentaService } from '../../../services/venta/venta.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  mostrarModal: boolean = false;
  nuevaVenta: Venta = {
    cliente: '',
    metodoPago: '',
    fecha: '',
    total: 0,
    detalles: [], // Campo adicional para detalles en texto
  };
  venta: Venta = {
    cliente: '',
    fecha: '',
    metodoPago: '',
    total: 0,
    detalles: []
  };
  detalle: DetalleVenta = {
    productoId: 0,
    cantidad: 0,
  };

  ventaForm: FormGroup;
  mensajeExito: string | null = null;

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  mostrarModalCliente: boolean = false;
  clienteNuevo: any = {
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  };

  productos: any[] = [];
  productosFiltrados: any[] = [];
  mostrarModalProducto: boolean = false;
  nuevoProducto: any = {
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  };

  constructor(private fb: FormBuilder, private ventaService: VentaService, private productoService: ProductoService, private clienteService: ClienteService, private router: Router) {
    this.ventaForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10)],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      total: [{ value: 0, disabled: true }],
      detalles: this.fb.array([])
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
    this.venta = {
      cliente: '',
      fecha: '',
      metodoPago: '',
      total: 0,
      detalles: []
    };
    this.detalle = {
      productoId: 0,
      cantidad: 0
    };
  }

  get detalles() {
    return this.ventaForm.get('detalles') as FormArray;
  }
  calcularTotal() {
    let total = 0;
    this.detalles.controls.forEach(control => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precioUnitario')?.value || 0;
      total += cantidad * precio;
    });
    this.ventaForm.get('total')?.setValue(total);
  }

  agregarDetalle() {
    const detalle = this.fb.group({
      productoId: ['', Validators.required],
      productoNombre: ['', Validators.required], // Añadir este campo
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precioUnitario: ['', Validators.required]
    });
    detalle.get('cantidad')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
    detalle.get('precioUnitario')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
    this.detalles.push(detalle);
  }


  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
    this.calcularTotal();
  }

  agregarVenta() {
    console.log("Empezando venta");
    console.log("Datos enviados al backend:", this.ventaForm.getRawValue());

    const clienteNombre = this.ventaForm.value.cliente;
    console.log(clienteNombre);
    this.ventaService.buscarClientesPorNombre(clienteNombre).subscribe(cliente => {
      const clienteId = cliente.id;
      console.log(Object.keys(cliente));
      console.log("Nombre del objeto " + cliente.nombre);
      console.log(clienteId);
      console.log("Mis pruebas" + cliente.nombre);
      if (this.ventaForm.valid) {
        const venta = {
          fecha: this.ventaForm.value.fecha,
          clienteId: clienteId,  // Aquí usamos el ID del cliente obtenido
          metodoPago: this.ventaForm.value.metodoPago,
          total: this.ventaForm.value.total,
          detalles: this.ventaForm.value.detalles
        };

        console.log('Cliente:', this.ventaForm.value.cliente);

        this.ventaService.saveVenta(venta).subscribe(response => {
          console.log('Venta creada con éxito', response);
          this.mensajeExito = '¡Venta añadida con éxito!';
          setTimeout(() => {
            this.mensajeExito = null;
            this.router.navigate(['/venta']);
          }, 4000);
        }, error => {
          console.error('Error al crear la venta:', error);
        });
      } else {
        console.log("Formulario no válido");
      }
    }, error => {
      console.error('Error al buscar el cliente:', error);
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
  buscarClientes(event: any) {
    const query = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(query)
    );
    if (!this.clientesFiltrados.length && query) {
      this.clientesFiltrados = [{ id: null, nombre: 'Agregar nuevo cliente' }];
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
  buscarProductos(event: any) {
    const query = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
    if (!this.productosFiltrados.length && query) {
      this.productosFiltrados = [{ id: null, nombre: 'Agregar nuevo Producto' }];
    }
  }
  seleccionarProducto(producto: any) {
    if (producto.id === null) {
      // Mostrar formulario para agregar una nueva categoría
      this.mostrarFormCliente();
    } else {
      this.nuevoProducto.producto = producto.nombre;
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
