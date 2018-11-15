import { TestBed } from '@angular/core/testing';

import { DisplayserviceService } from './displayservice.service';

describe('DisplayserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayserviceService = TestBed.get(DisplayserviceService);
    expect(service).toBeTruthy();
  });
});
