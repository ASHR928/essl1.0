import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CanlendarService } from './canlendar.service';

export const canlendarResolver: ResolveFn<boolean> = (route, state) => {
  return inject(CanlendarService).calendar;
};
