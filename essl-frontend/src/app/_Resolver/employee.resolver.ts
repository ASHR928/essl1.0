import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EmpService } from './emp.service';

export const employeeResolver: ResolveFn<boolean> = (route, state) => {
  const empService = inject(EmpService);
  return empService.isEmployeeId;
};
