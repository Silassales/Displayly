import { TestBed } from '@angular/core/testing';

import { WorkspaceserviceService } from './workspaceservice.service';

describe('WorkspaceserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkspaceserviceService = TestBed.get(WorkspaceserviceService);
    expect(service).toBeTruthy();
  });
});
