import { TestBed } from '@angular/core/testing';

import { RecoveryService } from './recovery.service';

describe('RecoveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecoveryService = TestBed.get(RecoveryService);
    expect(service).toBeTruthy();
  });
});
