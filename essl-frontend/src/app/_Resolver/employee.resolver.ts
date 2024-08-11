import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CommonService } from './common.service';

export const employeeResolver: ResolveFn<any> = (route, state) => {
  return inject(CommonService).commonData;
};
