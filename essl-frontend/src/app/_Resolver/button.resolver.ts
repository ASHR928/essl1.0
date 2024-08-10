import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ButtonService } from './button.service';

export const buttonResolver: ResolveFn<boolean> = (route, state) => {
  const buttonService = inject(ButtonService);
  return buttonService.isButtonVisible;
};
