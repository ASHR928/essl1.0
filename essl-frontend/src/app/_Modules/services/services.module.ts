import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessagesService } from '../../_Toastr/messages.service';
import { LoginService } from '../../_Services/login.service';
import { DashboardMenuService } from '../../_Services/dashboard-menu.service';
import { EmployeeService } from '../../_Services/employee.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToastrModule.forRoot()
  ],
  providers: [
    ToastrService,
    MessagesService,
    LoginService,
    DashboardMenuService,
    EmployeeService
  ]
})
export class ServicesModule { }
