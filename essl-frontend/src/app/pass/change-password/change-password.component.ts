import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../_Material/material/material.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpModule } from '../../_Http/http/http.module';
import { ServicesModule } from '../../_Modules/services/services.module';
import { MessagesService } from '../../_Toastr/messages.service';
import { LoginService } from '../../_Services/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    imports: [
        MaterialModule,
        HttpModule,
        ServicesModule
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  passChangeForm!: FormGroup;
  otpSent: any = false
  otp: any = ''

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private messageService: MessagesService, private loginService: LoginService) { }

  ngOnInit(): void {
    const empID = localStorage.getItem('employee_id')

    this.passChangeForm = this.formBuilder.group({
      Emp_ID: [empID],
      Password: [''],
      OTP: ['']
      // Emp_Company: [''],

    });
  }

  sendOTP() {
    this.otpSent = true

    const email = localStorage.getItem('username')


    const mailBody = {
      //'name': Emp_Name,
      'to': email,
      //'user': res.Emp_ID,
      'OTP': '123456',
    }
    console.log(mailBody);

    this.loginService.sendEmail(mailBody).subscribe(res => {
      console.log(res);

    })

  }
  UpdatePassword() {
    this.otp = '123456'
    const Emp_ID = this.passChangeForm.controls['Emp_ID'].value;
    const Password = this.passChangeForm.controls['Password'].value;
    const OTP = this.passChangeForm.controls['OTP'].value;

    const obj = { Emp_ID, Password }

    if (OTP == this.otp) {
      this.loginService.updatePassword(obj).subscribe((data: any) => {
        console.log(data);
        this.messageService.successMsg('Password updated successfully')

        this.router.navigate(['/']);

      })
    }
    else {
      this.messageService.warningMsg('Please enter correct OTP')
    }

  }

}
