import { Component } from '@angular/core';
import { MaterialModule } from '../_Material/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardMenuService } from '../_Services/dashboard-menu.service';
import { MessagesService } from '../_Toastr/messages.service';
import { ServicesModule } from '../_Modules/services/services.module';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    RouterModule,
    NgxBootstrapIconsModule,
    ServicesModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName: string = '';
  login: any;
  MenuList: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private dashboardMenuServices: DashboardMenuService, private messageService: MessagesService) { }

  ngOnInit(): void {
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
}
