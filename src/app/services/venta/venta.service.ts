import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private API_SERVER = "http://localhost:8080/venta/";

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllVentas(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }
}
