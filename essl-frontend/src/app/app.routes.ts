import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './_dashboard/admin/admin.component';
import { EmployeeListComponent } from './_dashboard/employee-list/employee-list.component';
import { EmployeeRosterComponent } from './_dashboard/employee-roster/employee-roster.component';
import { UpdateRosterComponent } from './_dashboard/update-roster/update-roster.component';
import { ButtonsComponent } from './_Common/buttons/buttons.component';
import { employeeResolver } from './_Resolver/employee.resolver';
import { AttendancePunchLogComponent } from './attendance-punch-log/attendance-punch-log.component';
import { AppLogComponent } from './app-log/app-log.component';
import { SignupComponent } from './signup/signup.component';
import { FullscreenComponent } from './_Calendar/fullscreen/fullscreen.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'admin', component: AdminComponent },
        { path: 'emplist', component: EmployeeListComponent },
        { path: 'emproster', component: EmployeeRosterComponent, resolve: { 'empList': employeeResolver } },
        { path: 'updateroster', component: UpdateRosterComponent },
        { path: 'button', component: ButtonsComponent },
        { path: 'attpunchlog', component: AttendancePunchLogComponent },
        { path: 'applog', component: AppLogComponent },
        { path: 'signup', component: SignupComponent },
        { path: 'calender', component: FullscreenComponent }
    ] }
];
