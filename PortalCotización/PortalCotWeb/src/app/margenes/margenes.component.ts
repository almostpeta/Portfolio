import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../controller/service.service';
import {URL } from '../config/config';
import {GridOptions} from "@ag-grid-community/all-modules";
import { ComponentCanDeactivate } from '../pending-changes.guard';
import { HostListener } from '@angular/core';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';


@Component({
  selector: 'app-margenes',
  templateUrl: './margenes.component.html',
  styleUrls: ['./margenes.component.css']
})
export class MargenesComponent implements ComponentCanDeactivate{
  public gridOptions: GridOptions;
  public gridPrivOptions: GridOptions;
  public columnDefs;
  private gridApi;
  private gridColumnApi;
  public selectedMargen;
  public rowData;
  private rowsDeleted = [];
  public changes:boolean = false;

  @HostListener('window:hashchange')
  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return (!this.changes);
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
  }
 
  constructor(public service : ServiceService, private confirmationDialogService: ConfirmationDialogService) { 
    var helper = this.changes;
    this.columnDefs = [
      {headerName: 'Nombre', field: 'descripcion' , editable:true},
      {headerName: 'Margen Estándar', field: 'margenEstandar'  , editable:true, cellStyle: {'text-align': 'right'}},
    ];
  
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
        let margen = data.data.margenEstandar 
        if(data.column.getColId() === "margenEstandar" && 
        (!/^[0-9]+(\.[0-9]{1,2})?$/.test(margen)  || margen < 0 || margen > 100)){
            data.data.margenEstandar = data.oldValue;
            alert("valor ingresado es incorrecto, debe ser un número entre 0 y 100");
        }
        else{
          if(data.data.changeType != 1){
            data.data.changeType = 2;
            helper = true;
          }
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
    console.log(this.rowData);
  }

  onSelectionChanged() {
    let selectedRows = this.gridApi.getSelectedRows();
    this.selectedMargen = selectedRows[0];
  }
  onCellValueChanged(event)
  {
    this.changes = true;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async getMargenes(){
    try{
      this.gridApi.showLoadingOverlay();
    }
    catch{}
    let aux = await this.service.getResourceAsync(URL.API_URL+"/margen", window.localStorage.token);
    this.rowData = aux;
    this.rowsDeleted = [];
  }


  remove(){
    let selectedData = this.gridApi.getSelectedRows();
    if(selectedData.length > 0){
      let selected = selectedData[0];
      selected.changeType = 3;
      this.rowsDeleted.push(selectedData);
      this.gridApi.updateRowData({ remove: selectedData });
    }
    this.changes = true;
  }

  addNew(){
    let newItem = {
      margenEstandar : "",
      descripcion : "",
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

  async save(){
    this.rowData.forEach(async element => {
      let json;
      if(element.changeType){
        let changeType = element.changeType;
        switch(changeType){
          case 1:
            //post
            json = {descripcion: element.descripcion, margenEstandar: element.margenEstandar};
            var aux =  await this.service.postResource(URL.API_URL+"/margen", json);
            if(aux.status === 201 || aux.status===200 || aux.status===204){
              this.confirmationDialogService.message('Mensaje', 'Margen ' +element.descripcion+' creado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al crear el margen '+element.descripcion);
            }
            break;
          case 2:
            //put
            json = {id: element._id, descripcion: element.descripcion, margenEstandar: element.margenEstandar};
            var aux =  await this.service.putResource(URL.API_URL+"/margen", json, window.localStorage.token);
            if(aux.status === 201 || aux.status===200 || aux.status===204){
              this.confirmationDialogService.message('Mensaje', 'Margen ' +element.descripcion+' editado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al editar el margen '+element.descripcion);
            }
            break;
          case 3:
            //delete
            var aux = await this.service.deleteResource(URL.API_URL+"/margen/" + element._id);
            if(aux.status === 201 || aux.status===200 || aux.status===204){
              this.confirmationDialogService.message('Mensaje', 'Margen '+element.descripcion+' Eliminado correctamente');
              delete element.changeType;
            }
            else{
              this.confirmationDialogService.message('Error', 'Error al eliminar el margen '+element.descripcion);
            }
            break;
        }
      }
    });
    this.changes = false;
  }
}
