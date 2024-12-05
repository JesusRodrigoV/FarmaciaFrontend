import { Component } from '@angular/core';
import { CategoriaLaboratorioServiceService } from '../../../services/categoriaLaboratorio/categoria-laboratorio-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-categoria.component.html',
  styleUrl: './gestion-categoria.component.css'
})
export class GestionCategoriaComponent {

  categorias: any[] = [];
  mostrarModal: boolean = false;
  tituloFormulario: string = 'Agregar Categoria';
  categoriaNueva: any = {
    nombre: ''
  };

  constructor(private catLabService: CategoriaLaboratorioServiceService) {
    this.obtenerCategorias();
  }
  mostrarFormCliente(accion: string, cate?: any): void {
    this.mostrarModal = true;
    if (accion === 'editar' && cate) {
      this.tituloFormulario = 'Editar Categoria';
      this.categoriaNueva = { ...cate };
    } else {
      this.tituloFormulario = 'Agregar Categoria';
      this.limpiarFormulario();
    }
  }
  cerrarFormCliente() {
    this.mostrarModal = false;
  }

  obtenerCategorias() {
    this.catLabService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }
  actualizarCategoria(): void {
    if (this.categoriaNueva.id) {
      this.catLabService
        .actualizarCategoria(this.categoriaNueva.id, this.categoriaNueva)
        .subscribe(
          (response) => {
            console.log('Categoria actualizado:', response);
            alert('Categoria actualizado correctamente.');
          },
          (error) => {
            console.error('Error al actualizar Categoria:', error);
            alert('No se pudo actualizar el Categoria.');
          }
        );
    }
  }
  guardarCategoria(): void {
    if (this.categoriaNueva.id) {
      // Editar cate
      this.catLabService.actualizarCategoria(this.categoriaNueva.id, this.categoriaNueva).subscribe(
        () => {
          alert('Categoria actualizado con éxito');
          this.obtenerCategorias();
          this.cerrarFormCliente();
        },
        (error) => {
          console.error('Error al actualizar cliente:', error);
          alert('No se pudo actualizar el cliente.');
        }
      );
    } else {
      // Agregar cliente
      this.catLabService.addCategoria(this.categoriaNueva).subscribe(
        () => {
          alert('Categoria agregado con éxito');
          this.obtenerCategorias();
          this.cerrarFormCliente();
        },
        (error) => {
          console.error('Error al agregar cliente:', error);
          alert('No se pudo agregar el cliente.');
        }
      );
    }


    /*
    this.clienteService.registrarCliente(this.clienteNuevo).subscribe(() => {
      console.log('Cliente agregado exitosamente')
      this.limpiarFormulario();
      this.obtenerClientes();
    });*/
  }

  borrarCliente(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta Categoria?')) {
      this.catLabService.deleteCategoria(id).subscribe(
        () => {
          console.log('Categoria eliminada con éxito');
          this.obtenerCategorias();
        },
        (error) => {
          console.error(error);
          console.log('No se pudo eliminar la categoria');
        }
      );
    }
  }
  limpiarFormulario(): void {
    this.categoriaNueva = {
      nombre: ''
    };
  }

}
