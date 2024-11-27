import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_SERVER = "http://localhost:8080/usuario/";

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllUsuarios():Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }
}
