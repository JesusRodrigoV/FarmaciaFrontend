import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Venta, VentaService } from '../../../services/venta/venta.service';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto/producto.service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../../../services/cliente/cliente.service';

@Component({
  selector: 'app-venta-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, MatInputModule, MatAutocompleteModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './venta-form.component.html',
  styleUrl: './venta-form.component.css'
})

export class VentaFormComponent implements OnInit {
  clientesFiltrados: string[] = [];
  productosFiltrados: any[] = [];
  ventaForm!: FormGroup;
  productos: any[] = [];
  filteredProductos: any[] = [];
  mensajeExito: string | null = null;

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
    this.ventaForm.get('cliente')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.ventaService.buscarClientesPorNombre(value))
    ).subscribe(clientes => this.clientesFiltrados = clientes.map((cliente: any) => cliente.nombre));
    this.obtenerProductos();
    this.agregarDetalle();
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
  filtrarClientes(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.ventaService.buscarClientesPorNombre(valor).subscribe(clientes => {
      this.clientesFiltrados = clientes.map((cliente: any) => cliente.nombre);
    });
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

  obtenerProductos() {
    this.productoService.getAllProductos().subscribe(data => {
      this.productos = data;
    });
  }

  buscarProductos(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProductos = this.productos.filter(producto => producto.nombre.toLowerCase().includes(query));
  }
  buscarClientes(valor: any) {
    this.ventaService.buscarClientesPorNombre(valor).subscribe(clientes => {
      this.clientesFiltrados = clientes;
    });
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
      console.log("Mis pruebas"+cliente.nombre);
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

  filtrarProductos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.productoService.buscarProductosPorNombre(valor).subscribe(productos => {
      this.filteredProductos = productos.map((producto: any) => producto.nombre);
    });
  }

  onProductoSelected(event: MatAutocompleteSelectedEvent, detalleForm: AbstractControl): void {
    const producto = event.option.value;
    const detalleGroup = detalleForm as FormGroup;
    detalleGroup.patchValue({
      productoId: producto.id,
      precioUnitario: producto.precio
    });
  }
}




