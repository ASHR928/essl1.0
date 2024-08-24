import { TestBed } from '@angular/core/testing';

import { ApplicationLogService } from './application-log.service';

describe('ApplicationLogService', () => {
  let service: ApplicationLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
