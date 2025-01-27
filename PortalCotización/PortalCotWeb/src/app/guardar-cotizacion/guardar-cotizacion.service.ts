import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuardarCotizacionComponent } from './guardar-cotizacion.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GuardarCotizacionService {

  constructor(private modalService: NgbModal) { }

  public show(margenes, carrito, cotizacion, redundancia): Promise<boolean> {
    const modalRef = this.modalService.open(GuardarCotizacionComponent, { size: "lg" });
    modalRef.componentInstance.margenes = margenes;
    modalRef.componentInstance.carrito = carrito;
    modalRef.componentInstance.redundancia = redundancia;
    if(cotizacion){
      modalRef.componentInstance.cotizacionId = cotizacion._id;
      modalRef.componentInstance.cotizacion = cotizacion;
    }
    return modalRef.result;
  }
}
