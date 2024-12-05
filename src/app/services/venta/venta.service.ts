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

  saveVenta(venta: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, venta);
  }
  public buscarClientesPorNombre(nombre: string): Observable<any> {
    return this.httpClient.get(`${this.CLIENTE_API_SERVER}/buscar`, {
      params: { nombre: nombre }
    });
  }

}
export interface Venta {
  id?: number;
  fecha: string;
  cliente: string;
  metodoPago: string;
  total: number;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  id?: number;
  productoId: number;
  cantidad: number;
}
