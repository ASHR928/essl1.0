import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { HttpModule } from '../_Http/http/http.module';
import { ServicesModule } from '../_Modules/services/services.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../_Toastr/messages.service';
import { Router } from '@angular/router';
import { LoginService } from '../_Services/login.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MaterialModule,
    HttpModule,
    ServicesModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  error: any;
  signUpForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private messageService: MessagesService,
    private router: Router, private loginService: LoginService) { }

    ngOnInit(): void {
      this.signUpForm = this.formBuilder.group({
        Emp_Name: ['', [Validators.required]],
        Emp_Alias_Name: [''],
        Emp_Company: [''],
        Emp_Designation: [''],
        Emp_Contact_No: ['', [Validators.required]],
        Emp_email: ['', [Validators.required]],
        Emp_Team_Name: [''],
        Emp_Location: [''],
        dob: [''],
        Emp_Department_Name: [''],
        PAN_Number: [''],
        UAN_Number: [''],
        ESIC_Number: ['']
      });
    }

    signUp() {}
}
