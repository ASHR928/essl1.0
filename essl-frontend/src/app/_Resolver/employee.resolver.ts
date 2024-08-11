import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EmpService } from './emp.service';

export const employeeResolver: ResolveFn<any> = (route, state) => {
  return inject(EmpService).isEmployeeId;
};
