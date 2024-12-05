import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InexistenteComponent } from './inexistente.component';

describe('InexistenteComponent', () => {
  let component: InexistenteComponent;
  let fixture: ComponentFixture<InexistenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InexistenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InexistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
