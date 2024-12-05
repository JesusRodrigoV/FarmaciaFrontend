import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente/cliente.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-cliente',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro-cliente.component.html',
  styleUrl: './registro-cliente.component.css'
})
export class RegistroClienteComponent implements OnInit {
  clienteForm: FormGroup;
  @Input()
  message!: string;
  @Input()
  redirectUrl!: string;
  show: boolean = false;
  constructor(private fb: FormBuilder, private clienteService: ClienteService, private router: Router) {

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void { }

  showModal(message: string, redirectUrl: string): void {
    this.message = message;
    this.redirectUrl = redirectUrl;
    this.show = true; setTimeout(() => {
      this.hide(); this.router.navigate([redirectUrl]);
    },
      5000);
  }
  hide(): void {
    this.show = false;
  }
  redirect(): void {
    this.hide();
    this.router.navigate([this.redirectUrl]);
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      this.clienteService.registrarCliente(this.clienteForm.value).subscribe(
        response => {
          console.log('Cliente registrado:', response);
          const backendResponse = {
            message: "Operación exitosa",
            redirectUrl: "/ventaform"
          };
          this.showModal(backendResponse.message, backendResponse.redirectUrl);
        },
        error => {
          console.error('Error al registrar el cliente:', error);
        }
      );
    }
  }
}
