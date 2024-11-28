import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Venta, VentaService } from '../../../services/venta/venta.service';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto/producto.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-venta-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './venta-form.component.html',
  styleUrl: './venta-form.component.css'
})

export class VentaFormComponent implements OnInit {

  ventaForm!: FormGroup;
  productos: any[] = [];
  filteredProductos: any[] = [];
  mensajeExito: string | null = null;

  constructor(private fb: FormBuilder, private ventaService: VentaService, private productoService: ProductoService,private router: Router) { }

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10)],
      cliente: ['', Validators.required],
      metodoPago: ['', Validators.required],
      total: [{ value: 0, disabled: true }],
      detalles: this.fb.array([])
    });
    this.obtenerProductos();
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
    console.log("Agregar Detalle");
    const detalle = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precioUnitario: ['', Validators.required]
    });
    detalle.get('cantidad')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
    detalle.get('precioUnitario')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
    console.log(this.detalles.get('productoId'));
    console.log(this.detalles.get('precioUnitario'));
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

  agregarVenta() {
    console.log("Empezando venta");
    console.log("Datos enviados al backend:", this.ventaForm.getRawValue());
    if (this.ventaForm.valid) {
      const venta: Venta = this.ventaForm.getRawValue();
      this.ventaService.saveVenta(venta).subscribe(response => {
        console.log('Venta creada con éxito', response);
        this.mensajeExito = '¡Venta añadida con éxito!'; setTimeout(() => { this.mensajeExito = null; this.router.navigate(['/venta'])}, 4000);
         }, error => { console.error('Error al crear la venta:', error); });

    } else{
      console.log("Formulario no sirve");
    }
  }
}




