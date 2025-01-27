import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { MargenesComponent } from "./margenes/margenes.component";
import { ProductosComponent } from "./productos/productos.component";
import { CotizacionComponent } from "./cotizacion/cotizacion.component";
import { PendingChangesGuard } from './pending-changes.guard';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '#/login' },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ProductosComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'margenes', component: MargenesComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'cotización', component: CotizacionComponent},
  { path: 'cotizaciones', component: CotizacionesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
