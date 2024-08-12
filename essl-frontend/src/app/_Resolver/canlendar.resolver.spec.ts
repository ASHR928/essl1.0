import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { canlendarResolver } from './canlendar.resolver';

describe('canlendarResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => canlendarResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
