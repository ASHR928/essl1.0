import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { HttpModule } from '../_Http/http/http.module';
import { ServicesModule } from '../_Modules/services/services.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../_Toastr/messages.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LoginService } from '../_Services/login.service';
import { UserTypeListService } from '../_Services/user-type-list.service';
import { SessionService } from '../_Services/session.service';

@Component({
    selector: 'app-login',
    imports: [
        MaterialModule,
        HttpModule,
        ServicesModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  url: string = '';
  dynamicUrl!: SafeResourceUrl;
  unsafeUrl: string = '';
  error: string = '';
  loader: boolean = true;
  loginForm!: FormGroup;
  selectedType = '';
  selectedTypeValue = '';
  userType: any = [];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private messageService: MessagesService,
    private router: Router, private loginService: LoginService, private userTypeListService: UserTypeListService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.userTypeListService.getUserTypeList().subscribe((res: any) => {
      this.userType = res;
    }, error => {
      this.messageService.errorMsg(JSON.stringify(error));
    });

    this.loginForm = this.formBuilder.group({
      Emp_ID: ['', [Validators.required]],
      usertype: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  getValue(data: any) {
    this.selectedTypeValue = data.value;
    this.selectedType = data.triggerValue.toLowerCase();
  }

  login() {
    const userName = this.loginForm.controls['Emp_ID'].value;
    const userType = this.loginForm.controls['usertype'].value;
    const pwd = this.loginForm.controls['password'].value;

    const obj = { Emp_ID: userName, Role: userType, pwd: pwd };

    this.loginService.login(obj).subscribe({
      next: (response: any) => {
        if (response.sqlMessage == undefined) {
          response[0].userType = this.selectedType;
          localStorage.setItem('token', JSON.stringify(response));
          localStorage.setItem('userType', userType);
          localStorage.setItem('username', response[0].Emp_Name);
          localStorage.setItem('employee_id', response[0].Emp_ID);
          
          // Initialize session management after successful login
          this.sessionService.initializeSession();
          
          this.router.navigate(['/', 'dashboard', 'admin'], { 
            queryParams: { type: userType, unique: 1 } 
          });
        } else {
          this.error = response.sqlMessage;
        }
      },
      error: (error) => {
        this.messageService.errorMsg(error);
      }
    });
  }
}
