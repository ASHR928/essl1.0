import { Component, OnInit } from '@angular/core';
import { ShiftMasterService } from '../../_Services/shift-master.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonGridComponent } from "../../_Common/common-grid/common-grid.component";
import { MessagesService } from '../../_Toastr/messages.service';
import { MaterialModule } from '../../_Material/material/material.module';
import { ServicesModule } from '../../_Modules/services/services.module';


@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CommonGridComponent,MaterialModule,ServicesModule],
  templateUrl: './shift-list.component.html',
  styleUrl: './shift-list.component.scss'
})
export class ShiftListComponent implements OnInit {
  shiftForm!:FormGroup;
  rowData: any[] = [];
  flag:boolean=false;

  allrows = {
    Shift_ID: "",
    Shift_StartTime: "",
    Shift_EndTime: "",
    Is_Approved: true,
    Approved_By: "",
    Is_Active: true

  };
  colDefs:any[]=[
    {field:'Shift_ID',headerName:'Shift ID', filter:'text', width:120},
    {field:'Shift_StartTime',headerName:'Shift Start Time', filter:'text', width:200 },
    {field:'Shift_EndTime',headerName:'Shift End Time', filter:'text', width:200},
    {field:'Is_Approved',headerName:'IS Approved', filter:'text', width:160},
    {field:'Approved_By',headerName:'Approved By', filter:'text', width:180},
    {field:'Is_Active',headerName:'Is Active', filter:'text', width:160},

  ];

  constructor(private shiftService: ShiftMasterService, private fb:FormBuilder, private messageService: MessagesService) {
    this.shiftForm=this.fb.group({
      Shift_ID:[''],
      Shift_StartTime:['',Validators.required],
      Shift_EndTime:['',Validators.required],
      Is_Approved:[true,Validators.required],
      Approved_By:[''],
      Is_Active:[true,Validators.required]
    });
   }
  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts():void{
    this.shiftService.getAllShifts().subscribe((data: any)=>{
      
      this.rowData=data.map((shift:any)=>({
        ...shift,
        Shift_StartTime:this.formatTime(shift.Shift_StartTime),
        Shift_EndTime:this.formatTime(shift.Shift_EndTime),
      }));
      this.flag=false;
    })
  }
  formatTime(time:string): string{
    if(!time) return'';
    const date=new Date(time);
    let hours=date.getUTCHours();
    const minutes=date.getUTCMinutes().toString().padStart(2,'0');
    const ampm=hours>=12?'PM':'AM';
    hours=hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  saveShift():void{
    this.shiftService.createShift(this.shiftForm.value).subscribe(()=>{
      this.loadShifts();
      this.resetForm();
    });
  }

  resetForm():void{
    this.shiftForm.reset({
      Shift_ID: "",
      Shift_StartTime: "",
      Shift_EndTime: "",
      Is_Approved: true,
      Approved_By: "",
      Is_Active: true
    });
  }
 
}
