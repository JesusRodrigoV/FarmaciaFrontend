import { UsuarioService } from './../../../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  usuarios: any[] = [];
  mostrarModal: boolean = false;
  tituloFormulario: string = 'Agregar Usuario';
  usuarioNuevo: any = {
    name: '',
    password: '',
    rol: '',
  };

  constructor(private usuarioService: UsuarioService) {
    this.obtenerClientes();
  }
  mostrarFormCliente(accion: string, cliente?: any): void {
    /*
    this.mostrarModal = true;
    if (accion === 'editar' && cliente) {
      this.tituloFormulario = 'Editar Cliente';
      this.clienteNuevo = { ...cliente }; // Cargar datos del cliente
    } else {
      this.tituloFormulario = 'Agregar Cliente';
      this.limpiarFormulario(); // Limpiar los campos del formulario
    }*/
  }
  cerrarFormCliente() {
    this.mostrarModal = false;
  }

  obtenerClientes() {
    this.usuarioService.getAllUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  guardarCliente(): void {
    /*
    if (this.clienteNuevo.id) {
      // Editar cliente
      this.usuarioService.actualizarCliente(this.clienteNuevo.id, this.clienteNuevo).subscribe(
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
      this.usuarioService.registrarCliente(this.clienteNuevo).subscribe(
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

*/
    /*
    this.clienteService.registrarCliente(this.clienteNuevo).subscribe(() => {
      console.log('Cliente agregado exitosamente')
      this.limpiarFormulario();
      this.obtenerClientes();
    });*/
  }
  actualizarCliente(): void {
    /*
    if (this.clienteNuevo.id) {
      this.usuarioService
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
        */
  }
  borrarCliente(id: number): void {
    /*
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.usuarioService.borrarCliente(id).subscribe(
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
      */
  }
  limpiarFormulario(): void {
    this.usuarioNuevo = {
      name: '',
      password: '',
      rol: '',
    };
  }
}
