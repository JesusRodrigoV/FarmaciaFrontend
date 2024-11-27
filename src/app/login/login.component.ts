import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { InventarioComponent } from '../inventario/inventario.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InventarioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() :void{
    const { username, password } = this.loginForm.value;

    this.usuarioService.getAllUsuarios().subscribe(
      (usuarios: any[]) => {
        const user = usuarios.find(u => u.name === username && u.password === password);

        if (user) {
          console.log('Correcto');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/inventario']);
          console.log('Correcto');
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          console.log(this.errorMessage);
        }
      },
      error => {
        console.error(error);
        this.errorMessage = 'Error al intentar iniciar sesión';
      }
    );
  }
}
