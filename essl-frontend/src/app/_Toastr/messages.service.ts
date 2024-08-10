import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(private toastrService: ToastrService) { }

  successMsg(msg: any) {
    this.toastrService.success(msg, 'Success', {
      closeButton: true,
      positionClass: 'toast-top-center'
    });
  }

  errorMsg(msg: any) {
    this.toastrService.error(msg, 'Error', {
      closeButton: true,
      positionClass: 'toast-top-center'
    });
  }

  warningMsg(msg: any) {
    this.toastrService.warning(msg, 'Warning', {
      closeButton: true,
      positionClass: 'toast-top-center'
    });
  }

  infoMsg(msg: any) {
    this.toastrService.info(msg, 'Info', {
      closeButton: true,
      positionClass: 'toast-top-center'
    });
  }
}
