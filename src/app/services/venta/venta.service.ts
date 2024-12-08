import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private API_SERVER = "http://localhost:8080/venta"
  private CLIENTE_API_SERVER = "http://localhost:8080/clientes";

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllVentas(): Observable<any>{
    return this.httpClient.get(`${this.API_SERVER}/all`);
  }

  obtenerPorDia(fecha: string): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/dia?fecha=${fecha}`);
  }

  obtenerPorMes(year: number, month: number): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/mes?year=${year}&month=${month}`);
  }

  obtenerPorAño(year: number): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/año?year=${year}`);
  }

  crearVenta(venta: Venta): Observable<Venta> {
    return this.httpClient.post<Venta>(this.API_SERVER, venta);
  }

  obtenerVenta(id: number): Observable<Venta> {
    return this.httpClient.get<Venta>(`${this.API_SERVER}/${id}`);
  }
  public buscarClientesPorNombre(nombre: string): Observable<any> {
    return this.httpClient.get(`${this.CLIENTE_API_SERVER}/buscar`, {
      params: { nombre: nombre }
    });
  }

}

export interface Venta {
  id?: number; // Opcional, porque no existe al crear una nueva venta
  fecha: string; // Usamos string porque las fechas en JSON suelen ir como ISO strings
  cliente: Cliente;
  metodoPago: string;
  total: number;
  detalles: DetalleVenta[];
}
export interface DetalleVenta {
  id?: number; // Opcional
  venta?: Venta; // Puedes omitirlo si no necesitas enviar el objeto completo al backend
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  laboratorio: string;
  stock: number;
  precio: number;
  fechaVencimiento: string; // Fechas como strings
  numeroLote: string;
  fechaFabricacion: string;
  formaFarmaceutica: string;
  cantidadPresentacion: string;
}
export interface Cliente {
  id: number; // Identificador único del cliente
  nombre: string; // Nombre del cliente
  direccion: string; // Dirección del cliente
  email: string; // Correo electrónico del cliente
  telefono: string; // Teléfono del cliente
}
