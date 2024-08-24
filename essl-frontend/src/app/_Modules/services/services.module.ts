import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MessagesService } from '../../_Toastr/messages.service';
import { LoginService } from '../../_Services/login.service';
import { DashboardMenuService } from '../../_Services/dashboard-menu.service';
import { EmployeeService } from '../../_Services/employee.service';
import { AttendancepunchlogService } from '../../_Services/attendancepunchlog.service';
import { ApplicationLogService } from '../../_Services/application-log.service';


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
    EmployeeService,
    AttendancepunchlogService,
    ApplicationLogService
  ]
})
export class ServicesModule { }
