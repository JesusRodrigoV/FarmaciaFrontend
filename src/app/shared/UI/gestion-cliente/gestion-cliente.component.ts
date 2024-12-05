import { ClienteService } from './../../../services/cliente/cliente.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-cliente.component.html',
  styleUrl: './gestion-cliente.component.css'
})
export class GestionClienteComponent {
  clientes: any[] = [];
  mostrarModal: boolean = false;
  tituloFormulario: string = 'Agregar Cliente';
  clienteNuevo: any = {
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  };

  constructor(private clienteService: ClienteService) {
    this.obtenerClientes();
  }
  mostrarFormCliente(accion: string, cliente?: any): void {
    this.mostrarModal = true;
    if (accion === 'editar' && cliente) {
      this.tituloFormulario = 'Editar Cliente';
      this.clienteNuevo = { ...cliente }; // Cargar datos del cliente
    } else {
      this.tituloFormulario = 'Agregar Cliente';
      this.limpiarFormulario(); // Limpiar los campos del formulario
    }
  }
  cerrarFormCliente() {
    this.mostrarModal = false;
  }

  obtenerClientes() {
    this.clienteService.getAllClientes().subscribe(data => {
      this.clientes = data;
    });
  }
  guardarCliente(): void {
    if (this.clienteNuevo.id) {
      // Editar cliente
      this.clienteService.actualizarCliente(this.clienteNuevo.id, this.clienteNuevo).subscribe(
        () => {
          alert('Cliente actualizado con éxito');
          this.obtenerClientes();
          this.cerrarFormCliente();
        },
        (error) => {
          console.error('Error al actualizar cliente:', error);
          alert('No se pudo actualizar el cliente.');
        }
      );
    } else {
      // Agregar cliente
      this.clienteService.registrarCliente(this.clienteNuevo).subscribe(
        () => {
          alert('Cliente agregado con éxito');
          this.obtenerClientes();
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
  actualizarCliente(): void {
    if (this.clienteNuevo.id) {
      this.clienteService
        .actualizarCliente(this.clienteNuevo.id, this.clienteNuevo)
        .subscribe(
          (response) => {
            console.log('Cliente actualizado:', response);
            alert('Cliente actualizado correctamente.');
          },
          (error) => {
            console.error('Error al actualizar cliente:', error);
            alert('No se pudo actualizar el cliente.');
          }
        );
    }
  }
  borrarCliente(id: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService.borrarCliente(id).subscribe(
        () => {
          console.log('Cliente eliminado con éxito');
          this.obtenerClientes();
        },
        (error) => {
          console.error(error);
          console.log('No se pudo eliminar el cliente');
        }
      );
    }
  }
  limpiarFormulario(): void {
    this.clienteNuevo = {
      nombre: '',
      direccion: '',
      email: '',
      telefono: '',
    };
  }
}
