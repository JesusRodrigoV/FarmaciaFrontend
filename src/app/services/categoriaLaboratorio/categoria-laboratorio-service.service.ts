import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLaboratorioServiceService {

  private API_URL = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  // Categorías
  getCategorias(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/categoria`);
  }

  addCategoria(categoria: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/categoria`, categoria);
  }

  actualizarCategoria(id: number, categoria: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/categoria/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/categoria/${id}`);
  }

  // Laboratorios
  getLaboratorios(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/laboratorio`);
  }

  addLaboratorio(laboratorio: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/laboratorio`, laboratorio);
  }
  actualizarLaboratorio(id: number, laboratorio: any): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/laboratorio/${id}`, laboratorio);
  }

  deleteLaboratorio(id: number): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/laboratorio/${id}`);
  }
}
