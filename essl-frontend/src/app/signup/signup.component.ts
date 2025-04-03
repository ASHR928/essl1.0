import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { HttpModule } from '../_Http/http/http.module';
import { ServicesModule } from '../_Modules/services/services.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../_Toastr/messages.service';
import { LoginService } from '../_Services/login.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-signup',
    imports: [
        MaterialModule,
        HttpModule,
        ServicesModule,
        DatePipe
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  error: any;
  signUpForm!: FormGroup;
  flag: boolean = false;

  constructor(private formBuilder: FormBuilder, private messageService: MessagesService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      Emp_Name: ['', [Validators.required]],
      Emp_Alias_Name: ['', [Validators.required]],
      // Emp_Company: [''],
      Emp_Designation: ['', [Validators.required]],
      Emp_Contact_No: ['', [Validators.required]],
      Emp_email: ['', [Validators.required]],
      // Emp_Team_Name: [''],
      Emp_Location: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      doj: ['', [Validators.required]],
      Emp_Department_Name: ['', [Validators.required]],
      PAN_Number: ['', [Validators.required]],
      AADHAR_Number: ['', [Validators.required]],
      // ESIC_Number: ['']
    });
  }

  signUp() {
    const Emp_Name = this.signUpForm.controls['Emp_Name'].value;
    const Emp_Alias_Name = this.signUpForm.controls['Emp_Alias_Name'].value;
    // const Emp_Company = this.signUpForm.controls['Emp_Company'].value;
    const Emp_Designation = this.signUpForm.controls['Emp_Designation'].value;
    const Emp_Contact_No = this.signUpForm.controls['Emp_Contact_No'].value;
    const Emp_email = this.signUpForm.controls['Emp_email'].value;
    // const Emp_Team_Name = this.signUpForm.controls['Emp_Team_Name'].value;
    const Emp_Location = this.signUpForm.controls['Emp_Location'].value;
    const dob = this.signUpForm.controls['dob'].value;
    const doj = this.signUpForm.controls['doj'].value;
    const Emp_Department_Name = this.signUpForm.controls['Emp_Department_Name'].value;
    const PAN_Number = this.signUpForm.controls['PAN_Number'].value;
    const AADHAR_Number = this.signUpForm.controls['AADHAR_Number'].value;
    // const ESIC_Number = this.signUpForm.controls['ESIC_Number'].value;

    const obj = {
      Emp_Name: Emp_Name, Emp_Alias_Name: Emp_Alias_Name, Emp_Designation: Emp_Designation,
      Emp_Contact_No: Emp_Contact_No, Emp_email: Emp_email, Emp_Location: Emp_Location, dob: dob, doj: doj,
      Emp_Department_Name: Emp_Department_Name, PAN_Number: PAN_Number, AADHAR_Number: AADHAR_Number
    };

    this.flag = true;

    this.loginService.insertEmployee(obj).subscribe((res: any) => {
      const body = {
        Emp_ID: res.employee
      }
      this.loginService.signUp(body).subscribe((res:any) => {
        const mailBody = {
          'name':Emp_Name,
          'to': Emp_email,
          'user':res.Emp_ID  ,
          'pass':res.Password ,
        }
        this.loginService.sendEmail(mailBody).subscribe(res=>{
          
        })



        this.flag = false;
        this.messageService.successMsg('Details submitted successfully, Please check your email for login credentials');
      })

      this.signUpForm.reset();
    });
  }

  generateEmployeeId() {

  }
}
