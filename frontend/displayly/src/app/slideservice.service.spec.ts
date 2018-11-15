import { TestBed } from '@angular/core/testing';

import { SlideserviceService } from './slideservice.service';

describe('SlideserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlideserviceService = TestBed.get(SlideserviceService);
    expect(service).toBeTruthy();
  });
});
