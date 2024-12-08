import { provideCharts } from 'ng2-charts';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto/producto.service';
import { CategoriaLaboratorioServiceService } from '../../../services/categoriaLaboratorio/categoria-laboratorio-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventario',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export default class InventarioComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  nuevaCategoria: string = '';
  categoriaFiltrada: any[] = [];
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
    cantidadPresentacion: '',
  };
  mostrarModal: boolean = false;
  mostrarModalCategoria: boolean = false;
  categoriaNueva: any = {
    nombre: ''
  };
  laboratorios: any[] = [];
  laboratoriosFiltrada: any[] = [];
  mostrarModalLaboratorio: boolean = false;
  laboratorioNuevo: any = {
    nombre: '',
    ubicacion: ''
  };

  constructor(private productoService: ProductoService, private categoriaService: CategoriaLaboratorioServiceService) {
    this.obtenerCategorias();
    this.obtenerLaboratorios();
    this.obtenerProductos();
  }
  ngOnInit(): void {
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
    console.log('Nuevo Producto:', this.nuevoProducto);
    this.productoService.saveProducto(this.nuevoProducto).subscribe({
      next: (response) => {
        console.log('Producto agregado', response);
        this.obtenerProductos();
        this.cerrarModal();
        this.nuevoProducto = {
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
          cantidadPresentacion: '',
        };
        this.mostrarModal = false;
      },
      error: (error) => {
        console.error('Error al agregar producto', error);
      },
      complete: () => {
        console.log('Completado');
      }
    });
  }

  // Obtener categorías desde el backend
  obtenerCategorias() {
    this.categoriaService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  // Filtrar categorías al escribir
  buscarCategorias(event: any) {
    const query = event.target.value.toLowerCase();
    this.categoriaFiltrada = this.categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(query)
    );
    if (!this.categoriaFiltrada.length && query) {
      this.categoriaFiltrada = [{ id: null, nombre: 'Agregar nueva categoría' }];
    }
  }
  mostrarFormCategoria(): void {
    this.mostrarModalCategoria = true;
  }
  cerrarFormCategoria() {
    this.mostrarModalCategoria = false;
  }
  seleccionarCategoria(categoria: any) {
    if (categoria.id === null) {
      // Mostrar formulario para agregar una nueva categoría
      this.mostrarFormCategoria();
    } else {
      this.nuevoProducto.categoria = categoria.nombre;
      this.categoriaFiltrada = [];
    }
  }

  // Agregar nueva categoría
  guardarCategoria(): void {
    this.categoriaService.addCategoria(this.categoriaNueva).subscribe(() => {
      console.log('Categoria agregada exitosamente')
      this.obtenerCategorias();
      this.cerrarFormCategoria()
    });
  }

  /*
    Laboratorios
  */
  mostrarFormLaboratorio(): void {
    this.mostrarModalLaboratorio = true;
  }
  cerrarFormLaboratorio() {
    this.mostrarModalLaboratorio = false;
  }
  obtenerLaboratorios() {
    this.categoriaService.getLaboratorios().subscribe((data) => {
      this.laboratorios = data;
    });
  }
  buscarLaboratorios(event: any) {
    const query = event.target.value.toLowerCase();
    this.laboratoriosFiltrada = this.laboratorios.filter((laboratorio) =>
      laboratorio.nombre.toLowerCase().includes(query)
    );
    if (!this.laboratoriosFiltrada.length && query) {
      this.laboratoriosFiltrada = [{ id: null, nombre: 'Agregar nuevo laboratorio' }];
    }
  }
  seleccionarLaboratorio(laboratorio: any) {
    if (laboratorio.id === null) {
      // Mostrar formulario para agregar una nueva categoría
      this.mostrarFormLaboratorio();
    } else {
      this.nuevoProducto.laboratorio = laboratorio.nombre;
      this.laboratoriosFiltrada = [];
    }
  }
  guardarLaboratorio(): void {
    this.categoriaService.addLaboratorio(this.laboratorioNuevo).subscribe(() => {
      console.log('Categoria agregada exitosamente')
      this.obtenerLaboratorios();
      this.cerrarFormLaboratorio()
    });
  }

  downloadReport() {
    this.productoService.downloadInventoryReport().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reporte_Inventario.pdf';
      a.click(); window.URL.revokeObjectURL(url);
    });
  }
}
