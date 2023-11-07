import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferenciasComponent } from './trasferencias.component';

describe('TrasferenciasComponent', () => {
  let component: TrasferenciasComponent;
  let fixture: ComponentFixture<TrasferenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrasferenciasComponent]
    });
    fixture = TestBed.createComponent(TrasferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
