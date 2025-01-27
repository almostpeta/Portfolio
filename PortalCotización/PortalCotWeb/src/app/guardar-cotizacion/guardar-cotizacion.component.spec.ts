import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarCotizacionComponent } from './guardar-cotizacion.component';

describe('GuardarCotizacionComponent', () => {
  let component: GuardarCotizacionComponent;
  let fixture: ComponentFixture<GuardarCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
