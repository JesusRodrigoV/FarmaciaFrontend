import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaLaboratorioServiceService } from '../../../services/categoriaLaboratorio/categoria-laboratorio-service.service';

@Component({
  selector: 'app-gestion-laboratorio',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-laboratorio.component.html',
  styleUrl: './gestion-laboratorio.component.css'
})
export class GestionLaboratorioComponent {
  laboratorios: any[] = [];
  mostrarModal: boolean = false;
  tituloFormulario: string = 'Agregar Laboratorio';
  laboratorioNuevo: any = {
    nombre: '',
    ubicacion: ''
  };

  constructor(private laboService: CategoriaLaboratorioServiceService) {
    this.obtenerLaboratorios();
  }
  mostrarFormLaboratorio(accion: string, Laboratorio?: any): void {
    this.mostrarModal = true;
    if (accion === 'editar' && Laboratorio) {
      this.tituloFormulario = 'Editar Laboratorio';
      this.laboratorioNuevo = { ...Laboratorio };
    } else {
      this.tituloFormulario = 'Agregar Laboratorio';
      this.limpiarFormulario();
    }
  }
  cerrarFormLaboratorio() {
    this.mostrarModal = false;
  }

  obtenerLaboratorios() {
    this.laboService.getLaboratorios().subscribe(data => {
      this.laboratorios = data;
    });
  }
  guardarLaboratorio(): void {
    if (this.laboratorioNuevo.id) {
      // Editar Laboratorio
      this.laboService.actualizarLaboratorio(this.laboratorioNuevo.id, this.laboratorioNuevo).subscribe(
        () => {
          alert('Laboratorio actualizado con éxito');
          this.obtenerLaboratorios();
          this.cerrarFormLaboratorio();
        },
        (error) => {
          console.error('Error al actualizar Laboratorio:', error);
          alert('No se pudo actualizar el Laboratorio.');
        }
      );
    } else {
      // Agregar Laboratorio
      this.laboService.addLaboratorio(this.laboratorioNuevo).subscribe(
        () => {
          alert('Laboratorio agregado con éxito');
          this.obtenerLaboratorios();
          this.cerrarFormLaboratorio();
        },
        (error) => {
          console.error('Error al agregar Laboratorio:', error);
          alert('No se pudo agregar el Laboratorio.');
        }
      );
    }


    /*
    this.LaboratorioService.registrarLaboratorio(this.LaboratorioNuevo).subscribe(() => {
      console.log('Laboratorio agregado exitosamente')
      this.limpiarFormulario();
      this.obtenerLaboratorios();
    });*/
  }
  actualizarLaboratorio(): void {
    if (this.laboratorioNuevo.id) {
      this.laboService
        .actualizarLaboratorio(this.laboratorioNuevo.id, this.laboratorioNuevo)
        .subscribe(
          (response) => {
            console.log('Laboratorio actualizado:', response);
            alert('Laboratorio actualizado correctamente.');
          },
          (error) => {
            console.error('Error al actualizar Laboratorio:', error);
            alert('No se pudo actualizar el Laboratorio.');
          }
        );
    }
  }
  borrarLaboratorio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este Laboratorio?')) {
      this.laboService.deleteLaboratorio(id).subscribe(
        () => {
          console.log('Laboratorio eliminado con éxito');
          this.obtenerLaboratorios();
        },
        (error) => {
          console.error(error);
          console.log('No se pudo eliminar el Laboratorio');
        }
      );
    }
  }
  limpiarFormulario(): void {
    this.laboratorioNuevo = {
      nombre: '',
      ubicacion: ''
    };
  }
}
