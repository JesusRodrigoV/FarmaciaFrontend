import { TestBed } from '@angular/core/testing';

import { CategoriaLaboratorioServiceService } from './categoria-laboratorio-service.service';

describe('CategoriaLaboratorioServiceService', () => {
  let service: CategoriaLaboratorioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaLaboratorioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
