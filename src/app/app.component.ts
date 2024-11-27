import { VentaService } from './services/venta/venta.service';
import { UsuarioService } from './services/usuario/usuario.service';
import { RecetaMedicaService } from './services/recetaMedica/receta-medica.service';
import { ProveedorService } from './services/proveedor/proveedor.service';
import { ProductoService } from './services/producto/producto.service';
import { DetalleVentaService } from './services/detalleVenta/detalle-venta.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ventaForm: UntypedFormGroup;
  detalleVenta: any;
  producto: any;
  proveedor: any;
  recetaMedica: any;
  usuarios: any;
  venta: any;
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['id', 'name', 'password', 'rol', 'options'];


  panelOpenState = false;


  constructor(
    public fb: UntypedFormBuilder,
    public detalleVentaService: DetalleVentaService,
    public productoService: ProductoService,
    public proveedorService: ProveedorService,
    public recetaMedicaService: RecetaMedicaService,
    public usuarioService: UsuarioService,
    public ventaService: VentaService
  ) {

  }
  ngOnInit(): void {
  }



}
