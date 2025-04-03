import { TestBed } from '@angular/core/testing';

import { RosterRequestService } from './roster-request.service';

describe('RosterRequestService', () => {
  let service: RosterRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RosterRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
