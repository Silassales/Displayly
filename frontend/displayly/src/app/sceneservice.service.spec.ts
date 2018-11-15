import { TestBed } from '@angular/core/testing';

import { SceneserviceService } from './sceneservice.service';

describe('SceneserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SceneserviceService = TestBed.get(SceneserviceService);
    expect(service).toBeTruthy();
  });
});
