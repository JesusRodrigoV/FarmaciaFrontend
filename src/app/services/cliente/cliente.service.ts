import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private API_URL = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) {}

  registrarCliente(cliente: any): Observable<any> {
    return this.http.post(this.API_URL, cliente);
  }
  getAllClientes(): Observable<any> {
    return this.http.get(this.API_URL);
  }
  actualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, cliente);
  }
  borrarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
