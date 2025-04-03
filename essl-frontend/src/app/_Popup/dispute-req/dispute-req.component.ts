import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../_Material/material/material.module';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DisputeRequestService } from '../../_Services/dispute-request.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-dispute-req',
    imports: [DatePipe,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MaterialModule],
    providers: [DatePipe],
    templateUrl: './dispute-req.component.html',
    styleUrl: './dispute-req.component.scss'
})
export class DisputeReqComponent implements OnInit {
  disputeForm!: FormGroup;
  formattedAttendanceDate: string;
  statusOptions = [
    { key: 'Present', value: 'Present' },
    { key: 'Absent', value: 'Absent' },
    { key: 'Half_day', value: 'Half Day' },
    { key: 'Leave', value: 'Leave' }
  ];
  isSubmitting = false; // To show loader while submitting

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DisputeReqComponent>,
    private datePipe: DatePipe,
    private disputeRequestService: DisputeRequestService, // Inject the service
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formattedAttendanceDate = this.formatToDatabaseDate(new Date(this.data.AttendanceDate));
  }
  ngOnInit() {
    this.initializeForm();
    
  }

  private initializeForm() {
    let empId = localStorage.getItem('employee_id')
    this.disputeForm = this.fb.group({
      EmployeeId:empId ,
      Current_status:[ this.data.Current_status],
      Requested_status: ['', Validators.required],
      Reason: ['', Validators.required],
      AttendanceDate: this.formattedAttendanceDate
    });
  }

  submitDispute() {
    if (this.disputeForm.valid) {
      this.isSubmitting = true; // Start loader
      const disputeRequest = {
        ...this.disputeForm.value,
       
      };
      console.log(disputeRequest)
      this.disputeRequestService.createDisputeRequest(disputeRequest).subscribe({
        next: (response) => {
          console.log('Dispute submitted successfully:', response);
          this.dialogRef.close(disputeRequest); // Close dialog with the request data
        },
        error: (error) => {
          console.error('Error submitting dispute:', error);
          alert('Failed to submit dispute. Please try again.');
        },
        complete: () => {
          this.isSubmitting = false; // Stop loader
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  formatToDatabaseDate(date: Date | null): string {
    if (!date) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
  
    // Format: yyyy-MM-dd HH:mm:ss.SSSSSSS +00:00
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000 +00:00`;
  }
}