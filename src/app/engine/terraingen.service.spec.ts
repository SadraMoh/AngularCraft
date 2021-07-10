import { TestBed } from '@angular/core/testing';

import { TerraingenService } from './terraingen.service';

describe('TerraingenService', () => {
  let service: TerraingenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerraingenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
