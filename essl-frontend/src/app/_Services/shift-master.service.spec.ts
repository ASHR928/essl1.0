import { TestBed } from '@angular/core/testing';

import { ShiftMasterService } from './shift-master.service';

describe('ShiftMasterService', () => {
  let service: ShiftMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
