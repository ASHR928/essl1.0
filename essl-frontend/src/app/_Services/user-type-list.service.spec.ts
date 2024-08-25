import { TestBed } from '@angular/core/testing';

import { UserTypeListService } from './user-type-list.service';

describe('UserTypeListService', () => {
  let service: UserTypeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTypeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
