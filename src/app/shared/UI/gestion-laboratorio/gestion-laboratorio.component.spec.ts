import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLaboratorioComponent } from './gestion-laboratorio.component';

describe('GestionLaboratorioComponent', () => {
  let component: GestionLaboratorioComponent;
  let fixture: ComponentFixture<GestionLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLaboratorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
