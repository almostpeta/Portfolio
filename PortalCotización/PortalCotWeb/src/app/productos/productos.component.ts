import { Component, OnInit, HostListener } from '@angular/core';
import { ServiceService } from '../controller/service.service';
import {URL } from '../config/config';
import { GridOptions } from '@ag-grid-community/core';
import { ComponentCanDeactivate } from '../pending-changes.guard';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements ComponentCanDeactivate {
  public gridOptions: GridOptions;
  public gridPrivOptions: GridOptions;
  public columnDefs;
  private gridApi;
  private gridColumnApi;
  public selectedMargen;
  public rowData;
  private rowsDeleted = [];
  private margenes;
  private editor;
  public changes:boolean = false;
  
  @HostListener('window:hashchange')
  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return (!this.changes);
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
  }
  
  constructor(public service: ServiceService,private confirmationDialogService: ConfirmationDialogService) { 
    this.gridOptions = <GridOptions>{
      enableFilter: true,
      rowSelection: "single",
      pagination: true,
      paginationAutoPageSize:true,
      onGridReady: function(params) {
        params.api.sizeColumnsToFit();
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      },
      onCellValueChanged: function(data){
        let costo = data.data.costo;
        if(data.column.getColId() === "costo" &&
          (!/^[0-9]+(\.[0-9]{1,2})?$/.test(costo)  || costo < 0)){
          data.data.costo = data.oldValue;
          alert("Costo ingresado es incorrecto, debe ser un numero mayor que cero");
        } 
        else{
          if(data.data.changeType != 1)
            data.data.changeType = 2;
        }
        this.gridApi.refreshCells();
      }
    };
    this.gridPrivOptions = <GridOptions>{
        enableFilter: true,
        onGridReady: function(params) {
            params.api.sizeColumnsToFit();
          }
    };
    this.gridPrivOptions = <GridOptions>{
      enableFilter: true,
      onGridReady: function(params) {
          params.api.sizeColumnsToFit();
        }
    }; 
  }

  async ngOnInit() {
    await this.getMargenes();
    await this.getProductos();
  }

  async getMargenes(){
    this.margenes = await this.service.getResourceAsync(URL.API_URL+"/margen", window.localStorage.token);
    var aux = [];
    this.margenes.forEach(element => {
      aux.push(element.descripcion);
    });
    this.columnDefs = [
      {headerName: 'Código', field: 'codigo' , editable:true},
      {headerName: 'Nombre', field: 'articulo'  , editable:true},
      {headerName: 'Comentario', field: 'comentario' , editable:true},
      
      {headerName: 'Costo', field: 'costo'  , editable:true, cellStyle: {'text-align': 'right'}},
      {headerName: 'Margen', 
      field: 'descripcion',
      editable:true, 
      cellEditorParams: {values: aux},
      cellEditor: 'agSelectCellEditor'
      },
      {headerName: 'Licencia de Usuario', 
      field: 'licenciaDeUsuario',
      editable:true,
      cellEditorParams: {values: [true, false]},
      cellEditor: 'agSelectCellEditor'},
    ];
  }
  
  async getProductos(){
    var aux = await this.service.getResourceAsync(URL.API_URL+"/productos", window.localStorage.token);
    var aux2 = [];
    aux.forEach(element => {
      if(element.articulo){
        this.margenes.forEach(margen => {
          if(margen._id === element.margenId){
            element.descripcion = margen.descripcion;
          }
        });
        aux2.push(element);
      }
    });
    this.rowData = aux2;
    this.rowsDeleted = [];
  }

  onCellValueChanged(event){
    this.changes = true;
    
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    this.selectedMargen = selectedRows[0];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async refresh(){
    this.gridApi.showLoadingOverlay();
    this.getProductos();
  }

  remove(){
    var selectedData = this.gridApi.getSelectedRows();
    if(selectedData.length > 0){
      let selected = selectedData[0];
      selected.changeType = 3;
      this.rowsDeleted.push(selectedData);
      this.gridApi.updateRowData({ remove: selectedData });
    }
    this.changes = true;
  }

  addNew(){
    var newItem = {
      codigo : "",
      articulo : "",
      comentario : "",
      costo : "",
      margenDescripcion : "",
      changeType : 1
    };
    this.rowData.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.changes = true;
    this.gridApi.paginationGoToPage(100000);
    this.rowsDeleted.forEach(element => {
      this.gridApi.updateRowData({remove: element});
    }); 
  }

  getMargenIdFromDescripcion(descripcion){
    var result;
    this.margenes.forEach(element => {
      if(element.descripcion === descripcion){
        result = element._id;
      }
    });
    return result;
  }

  save(){
    this.rowData.forEach(async element => {
      var errors = '';
      let obs;
      var json;
      if(element.changeType){
        let changeType = element.changeType;
        switch(changeType){
          case 1:
            //post
            json = {codigo: element.codigo, nombre: element.articulo, articulo: element.articulo
              ,comentario: element.comentario,costo:element.costo, licenciaDeUsuario: element.licenciaDeUsuario,
              margenId: this.getMargenIdFromDescripcion(element.descripcion)};
            var aux = await this.service.postResource(URL.API_URL+"/productos", json);
            if(aux.status === 201 || aux.status===200 || aux.status===204){
              this.confirmationDialogService.message('Mensaje', 'Producto '+element.articulo+' creado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al crear el Producto '+element.articulo);
            }
          break;
          case 2:
            json = {_id: element._id, codigo: element.codigo, nombre: element.articulo, articulo: element.articulo
              ,comentario: element.comentario,costo:element.costo, licenciaDeUsuario: element.licenciaDeUsuario,
              margenId:this.getMargenIdFromDescripcion(element.descripcion)};
            var aux = await this.service.putResource(URL.API_URL+"/productos", json, window.localStorage.token);
            if(aux.status === 201 || aux.status===200 || aux.status===204){
              this.confirmationDialogService.message('Mensaje', 'Producto ' +element.articulo+' editado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al editar el Producto '+element.articulo);
            }
          break;
          case 3:
            //delete
            var aux = await this.service.deleteResource(URL.API_URL+"/productos/" + element._id);
            if(aux.status === 201 || aux.status===200 || aux.status===204){ 
              this.confirmationDialogService.message('Mensaje', 'Producto '+element.articulo+' eliminado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al eliminar el Producto '+element.articulo);
            }
          break;
        }
      }
    });
    this.changes =  false;
  }
}
