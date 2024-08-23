import { TestBed } from '@angular/core/testing';

import { AttendancepunchlogService } from './attendancepunchlog.service';

describe('AttendancepunchlogService', () => {
  let service: AttendancepunchlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendancepunchlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
