import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MargenesComponent } from './margenes.component';

describe('MargenesComponent', () => {
  let component: MargenesComponent;
  let fixture: ComponentFixture<MargenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MargenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MargenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
