import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private API_SERVER = "http://localhost:8080/producto";

  constructor(
    private httpClient: HttpClient
  ) { }

  getProductos(): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/all`);
  }

  public getAllProductos(): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/all`);
  }

  public saveProducto(producto: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, producto);
  }

  public deleteProducto(id: number): Observable<any> {
    return this.httpClient.delete(`${this.API_SERVER}delete/${id}`);
  }

  public buscarProductosPorNombre(nombre: string): Observable<any> {
    return this.httpClient.get(`${this.API_SERVER}/buscar?nombre=${nombre}`);
  }

  public downloadInventoryReport(): Observable<Blob> {
    return this.httpClient.get(`${this.API_SERVER}/inventory`, { responseType: 'blob' });
  }
  public calcularInventario(id: number, costoPedido: number, costoAlmacenamiento: number): Observable<any> {
    return this.httpClient.post<any>(`${this.API_SERVER}/calcular-inventario`, null, {
      params: {
        id: id.toString(),
        costoPedido: costoPedido.toString(),
        costoAlmacenamiento: costoAlmacenamiento.toString(),
      },
    });
  }

  public obtenerPredicciones(idProducto: number): Observable<number[][]> {
    return this.httpClient.get<number[][]>(`${this.API_SERVER}/predicciones/${idProducto}`);
  }
}
