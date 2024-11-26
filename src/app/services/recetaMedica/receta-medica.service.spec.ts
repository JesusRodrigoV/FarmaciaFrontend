import { TestBed } from '@angular/core/testing';

import { RecetaMedicaService } from './receta-medica.service';

describe('RecetaMedicaService', () => {
  let service: RecetaMedicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetaMedicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
