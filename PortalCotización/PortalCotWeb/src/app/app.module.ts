import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule }   from '@angular/forms';
import {MatMenuModule, MatDialogModule, MatSortModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule} from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import { MatIconModule, MatInputModule, MatButtonModule, MatFormField } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {ServiceService} from './controller/service.service';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { MargenesComponent } from './margenes/margenes.component';
import { ProductosComponent } from './productos/productos.component';
import { AgGridModule } from 'ag-grid-angular';
import { PendingChangesGuard } from './pending-changes.guard';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { GuardarCotizacionComponent } from './guardar-cotizacion/guardar-cotizacion.component';
import { GuardarCotizacionService } from './guardar-cotizacion/guardar-cotizacion.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import { LicenciasComponent } from './licencias/licencias.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CotizacionComponent,
    MargenesComponent,
    ProductosComponent,
    ConfirmationDialogComponent,
    CotizacionesComponent,
    GuardarCotizacionComponent,
    LicenciasComponent,
  ],
  entryComponents:[
    ConfirmationDialogComponent,
    GuardarCotizacionComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    NoopAnimationsModule,
    AgGridModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    RouterModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [
    ServiceService, 
    PendingChangesGuard,
    ConfirmationDialogService,
    GuardarCotizacionService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
