import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../_Material/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpModule } from '../../_Http/http/http.module';
import { CommonService } from '../../_Resolver/common.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    HttpModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {

  selectedDesignation: string = '';
  selectedTeam: string = '';

  desig = [
    { SrNo: 1, Designation: "Executive Director" },
    { SrNo: 2, Designation: "CFO" },
    { SrNo: 3, Designation: "Director" },
    { SrNo: 4, Designation: "Operations Manager" },
    { SrNo: 5, Designation: "Sales Manager" },
    { SrNo: 6, Designation: "HR Manager" },
    { SrNo: 7, Designation: "Backend Manager" },
    { SrNo: 8, Designation: "CS Manager" },
    { SrNo: 9, Designation: "Product Manager" },
    { SrNo: 10, Designation: "Quality Manager" },
    { SrNo: 11, Designation: "BDM" },
    { SrNo: 12, Designation: "ABDM" },
    { SrNo: 13, Designation: "Admin Manager" },
    { SrNo: 14, Designation: "Assistant Manager" },
    { SrNo: 15, Designation: "Accountant" },
    { SrNo: 16, Designation: "Assistant Accountant" },
    { SrNo: 17, Designation: "Team Leader" },
    { SrNo: 18, Designation: "HR Executive" },
    { SrNo: 19, Designation: "Finance Executive" },
    { SrNo: 20, Designation: "WFM Executive" },
    { SrNo: 21, Designation: "Quality Executive" },
    { SrNo: 22, Designation: "Auto Part Backend Executive" },
    { SrNo: 23, Designation: "Auto Part Sales Executive" },
    { SrNo: 24, Designation: "Ticketing Executive" },
    { SrNo: 25, Designation: "Spanish Travel Sales Executive" },
    { SrNo: 26, Designation: "Travel Sales Executive" },
    { SrNo: 27, Designation: "IT Executive" },
    { SrNo: 28, Designation: "CS Executive" },
    { SrNo: 29, Designation: "Content Writer" },
    { SrNo: 30, Designation: "Full Stack Developer" },
    { SrNo: 31, Designation: "Data Analyst" },
    { SrNo: 32, Designation: "Creative" },
    { SrNo: 33, Designation: "DevOps" },
    { SrNo: 34, Designation: "Solution Architect" },
    { SrNo: 35, Designation: "UI Designer" },
    { SrNo: 36, Designation: "Frontend Developer" },
    { SrNo: 37, Designation: "DevOps" },
    { SrNo: 38, Designation: "UI Designer" },
    { SrNo: 39, Designation: "Tester" },
    { SrNo: 40, Designation: "Frontend Developer" },
    { SrNo: 41, Designation: "Backend Developer" },
    { SrNo: 42, Designation: "SEO" },
    { SrNo: 43, Designation: "Support Staff" }
  ];

  teamMaster = [
    { id: 1, team: "Airline Sales" },
    { id: 2, team: "Travoport Sales" },
    { id: 3, team: "SCF Sales" },
    { id: 4, team: "BTF Sales" },
    { id: 5, team: "Fareporto Sales" },
    { id: 6, team: "BMAT Sales" },
    { id: 7, team: "Farebuddies Sales" },
    { id: 8, team: "Business Development" },
    { id: 9, team: "Quality Team" },
    { id: 10, team: "Backend/Ticketing" },
    { id: 11, team: "Work Force Management" },
    { id: 12, team: "Customer Service Team" },
    { id: 13, team: "Human Resources Department" },
    { id: 14, team: "Technology Team" },
    { id: 15, team: "Support Staff" },
    { id: 16, team: "Administration" }
  ];

  get_designation = '';
  get_team = '';

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService) {
    // this.selectedValue = '13'
    this.selectedDesignation = String(this.getSrNoByDesignation(data.Emp_Designation))
    this.selectedTeam = String(this.getIdByTeam(data.Emp_Team_Name))
    this.get_designation = data.Emp_Designation
    this.get_team = data.Emp_Team_Name
  }

  getSrNoByDesignation(designation: any) {
    const result = this.desig.find(d => d.Designation === designation);
    return result ? result.SrNo : null; // Returns SrNo if found, else null
  };
  getIdByTeam(team: any) {
    const result = this.teamMaster.find(d => d.team === team);
    return result ? result.id : null; // Returns SrNo if found, else null
  };

  Designation(val: any) {
    this.get_designation = val.triggerValue;
    this.selectedDesignation = val.value
  }

  Team(val: any) {
    this.get_team = val.triggerValue;
    this.selectedTeam = val.value
  }

  onClose() {
    this.commonService.showPopup = false;
    this.commonService.buttonText = '';
    this.dialogRef.close();
  }

  onSave() {
    console.log(this.data);
    
    this.data.Emp_Designation = this.get_designation;
    this.data.Emp_Team_Name = this.get_team
    this.dialogRef.close(this.data);
  }
}
