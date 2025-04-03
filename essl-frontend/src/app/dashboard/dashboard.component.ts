import { Component } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardMenuService } from '../_Services/dashboard-menu.service';
import { MessagesService } from '../_Toastr/messages.service';
import { ServicesModule } from '../_Modules/services/services.module';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { EmployeeService } from '../_Services/employee.service';
import { SessionTimerComponent } from '../_Popup/session-timer/session-timer.component';
@Component({
    selector: 'app-dashboard',
    imports: [
        MaterialModule,
        RouterModule,
        NgxBootstrapIconsModule,
        ServicesModule,
        SessionTimerComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName: string = '';
  login: any;
  token: any;
  MenuList: any = [];
  

  constructor(private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute, private dashboardMenuServices: DashboardMenuService, private messageService: MessagesService) { }

  ngOnInit(): void {

   

    const getToken = localStorage.getItem('token');
    const username = localStorage.getItem('username')
    if (username != null) {

      this.userName = (username)
    }

    if (getToken != null) {
      this.token = JSON.parse(getToken)[0];
    }

    this.dashboardMenuServices.getDashboardMenuList().subscribe((data: any) => {
      this.route.queryParams.subscribe(params => {
        const type = params['type'];
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          localStorage.setItem('userType', type);
          localStorage.getItem('userType');
        }
        this.MenuList = data.filter((item: any) => item.loginType === type);
      });
    }, (error: any) => {
      this.messageService.errorMsg(JSON.stringify(error));
    });
  }
  logout() {
    localStorage.setItem('token', '');
    this.router.navigate(['/']);
  }
  changePassword(){
    this.router.navigate(['/changePassword'])
  }
}
