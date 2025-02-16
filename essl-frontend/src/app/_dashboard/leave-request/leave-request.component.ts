import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../_Material/material/material.module';
import { HttpModule } from '../../_Http/http/http.module';
import { ServicesModule } from '../../_Modules/services/services.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LeaveRequestService } from '../../_Services/leave-request.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  
  imports: [
    MaterialModule,
    HttpModule,
    ServicesModule,
    DatePipe
  ],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.scss'
})
export class LeaveRequestComponent {
  error: any;
  leaveRequestForm!: FormGroup;
  flag: boolean = false;

  constructor(private formBuilder: FormBuilder,  private leaveRequestService: LeaveRequestService) { }

  ngOnInit(): void {
    const employeeid = localStorage.getItem("employee_id")
    this.leaveRequestForm = this.formBuilder.group({
      Employee_Id: [employeeid, [Validators.required]],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      LeaveTypeId: ['', [Validators.required]],
      // ESIC_Number: ['']
    });
  }



  leaveRequest() {
    if (this.leaveRequestForm.invalid) return;

    const { Employee_Id, FromDate, ToDate,LeaveTypeId } = this.leaveRequestForm.value;
    const obj = { Employee_Id, FromDate, ToDate,LeaveTypeId };

    this.flag = true;

    this.leaveRequestService.createLeaveRequest(obj).subscribe({
      next: (res: any) => {
        this.flag = false;
        alert('Leave Request Submitted Successfully!');
        this.leaveRequestForm.reset();
      },
      error: () => {
        this.flag = false;
      }
    });
  }
}
