import { TestBed } from '@angular/core/testing';

import { CanlendarService } from './canlendar.service';

describe('CanlendarService', () => {
  let service: CanlendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanlendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
