import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecetaMedicaService {

  private API_SERVER = "http://localhost:8080/recetamedica/";

  constructor(
    private httpClient: HttpClient
  ) { }
}
