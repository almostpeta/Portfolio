import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { from } from 'rxjs';


export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> { 
  constructor(private confirmationDialogService: ConfirmationDialogService){}
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean>{
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate() ? true :  this.showCartelito();
  }

  showCartelito(): Observable<boolean>{
    var cartelito = this.confirmationDialogService.confirm('WARNING: Hay cambios sin guardar', 'Pulsa cancelar para volver o OK para salir.')
    .then((confirmed) => {return confirmed})
    .catch(() => {return false})
    const observable = from(cartelito);
    console.log(observable);
    return observable
  }
}