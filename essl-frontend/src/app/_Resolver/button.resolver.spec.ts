import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { buttonResolver } from './button.resolver';

describe('buttonResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => buttonResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
