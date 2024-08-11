import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './_dashboard/admin/admin.component';
import { EmployeeListComponent } from './_dashboard/employee-list/employee-list.component';
import { EmployeeRosterComponent } from './_dashboard/employee-roster/employee-roster.component';
import { UpdateRosterComponent } from './_dashboard/update-roster/update-roster.component';
import { ButtonsComponent } from './_Common/buttons/buttons.component';
import { employeeResolver } from './_Resolver/employee.resolver';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'admin', component: AdminComponent },
        { path: 'emplist', component: EmployeeListComponent },
        { path: 'emproster', component: EmployeeRosterComponent, resolve: [
            { 'empList': employeeResolver }
        ] },
        { path: 'updateroster', component: UpdateRosterComponent },
        { path: 'button', component: ButtonsComponent }
    ] }
];
