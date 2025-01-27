import { Component, OnInit, Inject, ViewChild, ContentChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../controller/service.service';
import {URL } from '../config/config';
import { MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { GuardarCotizacionService } from '../guardar-cotizacion/guardar-cotizacion.service';
import { Router } from "@angular/router";
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
  public displayedColumns: string[] = ['codigo', 'cliente', 'comentario', 'creador',
  'ultimaModificacion', 'fechaCreado', 'fechaEditado', 'acciones'];
  public cotizaciones;
  private cotizacionesAux;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public service: ServiceService, private confirmationDialogService: ConfirmationDialogService, private guardarCotizacionService: GuardarCotizacionService, private router: Router) { }

  async ngOnInit() {
    this.cotizaciones = new MatTableDataSource();
    await this.getCotizaciones();
    this.cotizaciones.sort = this.sort;
    this.cotizaciones.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.startSort();
  }

  async getCotizaciones(){
    this.cotizaciones.data = await this.service.getResourceAsync(URL.API_URL+"/cotizacion", window.localStorage.token);
    this.cotizacionesAux = this.cotizaciones.data;
  }

  iraCotizacion(cotizacion){
    this.router.navigate(["cotización"], { queryParams: { codigo: cotizacion._id } });
  }

  async applyFilter() {
    let cotizacionesAux2 = []
    let codigoFiltro : any = document.getElementById("filtroCodigo");
    let clienteFiltro : any = document.getElementById("filtroCliente");
    let comentarioFiltro : any = document.getElementById("filtroComentario");
    let creadorFiltro : any = document.getElementById("filtroCreador");
    //this.productos.data.splice(0,this.productos.data.length);
    await this.cotizacionesAux.forEach(element => {
      if(element.codigo.toString().toLowerCase().includes(codigoFiltro.value.toLowerCase()) 
      && element.cliente.toLowerCase().includes(clienteFiltro.value.toLowerCase()) 
      && element.comentario.toLowerCase().includes(comentarioFiltro.value.toLowerCase())
      && element.creador.toLowerCase().includes(creadorFiltro.value.toLowerCase())){
        cotizacionesAux2.push(element);
      }
    });
    this.cotizaciones.data = cotizacionesAux2;
  }

  startSort(){
    this.cotizaciones.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'codigo': {
          let number = parseInt(item[property]);
          return number;
        }
        default: {
          return item[property];
        }
      }
    };
  }
}
