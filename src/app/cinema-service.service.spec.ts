import { TestBed } from '@angular/core/testing';

import { CinemaServiceService } from './cinema-service.service';

describe('CinemaServiceService', () => {
  let service: CinemaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CinemaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
