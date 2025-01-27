import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {URL } from '../config/config';
import { ServiceService } from '../controller/service.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Router } from "@angular/router";

@Component({
  selector: 'app-guardar-cotizacion',
  templateUrl: './guardar-cotizacion.component.html',
  styleUrls: ['./guardar-cotizacion.component.css'],
})
export class GuardarCotizacionComponent implements OnInit {

  @Input() carrito: any[];
  @Input() margenes: any[];
  @Input() cotizacionId: string;
  @Input() cotizacion: any;
  @Input() redundancia: any;
  public nombre:string;
  public cliente:string;
  public comentario:string;

  constructor(public service: ServiceService,private activeModal: NgbActiveModal,private router: Router) { }

  ngOnInit() {
    console.log(this.cotizacion);
    if(this.cotizacion){
      this.cliente = this.cotizacion.cliente;
      this.comentario = this.cotizacion.comentario;
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public async accept() {
    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 

    await this.achicarArrays();
    await this.service.getResourceAsync(URL.API_URL+'/sessions?token=' +
      window.localStorage.ACCESS_TOKEN, window.localStorage.ACCESS_TOKEN).then(res =>{
          this.nombre = res.nombre;
      });
    var json = {
      cliente: this.cliente, 
      comentario: this.comentario,
      fechaEditado: formatted_date,
      ultimaModificacion: this.nombre,
      carrito: this.carrito,
      margenes: this.margenes,
      redundancia: this.redundancia,
    }
    
    if(this.cotizacionId){
      json['id'] = this.cotizacionId
      var aux =  await this.service.putResourceAsync(URL.API_URL+"/cotizacion", json, window.localStorage.token);    
    }else{
      json['creador'] = this.nombre;
      json['fechaCreado'] = formatted_date;
      var aux =  await this.service.postResource(URL.API_URL+"/cotizacion", json);
    }
    if(aux.status == 201){
      alert("Cotización guardada correctamente");
    }
    this.activeModal.close(true);
    this.router.navigate(["cotizaciones"]);
  }

  async achicarArrays() {
    this.carrito = await this.carrito.map(function(x:any){
      x = {producto:x._id, cantidad:x.cantidad}
      return x;
    });
    this.margenes = await this.margenes.map(function(x:any){
      x = {margen:x._id, cantidad:x.margenEstandar.toString()}
      return x;
    });
  }

  public dismiss() {
    this.activeModal.dismiss();

  }

}