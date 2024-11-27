import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private API_SERVER = "http://localhost:8080/proveedor/";

  constructor(
    private httpClient: HttpClient
  ) { }
}
