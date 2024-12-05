import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {

  private API_SERVER = "http://localhost:8080/detalleventa/";

  constructor(
    private httpClient: HttpClient
  ) { }


}
