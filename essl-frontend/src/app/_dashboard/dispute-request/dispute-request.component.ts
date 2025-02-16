import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi, CalendarApi, DatesSetArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisputeReqComponent } from '../../_Popup/dispute-req/dispute-req.component';
import { CommonService } from '../../_Resolver/common.service';
import { EmployeeService } from '../../_Services/employee.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Day } from '../../enum/dayEnum';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from '../../_Material/material/material.module';
import { DisputeRequestService } from '../../_Services/dispute-request.service';
@Component({
  selector: 'app-dispute-request',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    MaterialModule,
    MatSnackBarModule,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './dispute-request.component.html',
  styleUrl: './dispute-request.component.scss'
})
export class DisputeRequestComponent implements OnInit {
  @ViewChild('fullCalendar') calendarComponent!: FullCalendarComponent;
  showCalendar = false;
  working_days: number = 0;
  param = '';
  eventGuid = 0;
  globalEventId = '0';
  leave: any[] = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  INITIAL_EVENTS: EventInput[] = [
  ];
  calendarVisible = true;
  calendarApi?: CalendarApi;
  previousAttendanceType: any;
  previousAttendance: number = 0;
  attendanceCalculation: any = {
    'WO': 1,
    '½Present': 0.5,
    'Present': 1,
    'Absent': 0,
    'SW': -2,
    'NCNS': -4,
    'Casual Leave': -1,
    'Sick Leave': -1,
    'OT': 2
  }
  dialogRef: any;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    datesSet: this.handleDatesSet.bind(this),
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  heightWidth = { height: 'auto', width: 'auto' };

  constructor(public dialog: MatDialog,private snackBar:MatSnackBar, private commonService: CommonService,private disputerequestservice:DisputeRequestService, private employeeService: EmployeeService,
    private datePipe: DatePipe, private route: ActivatedRoute, private router: Router
  ) {

  }
  ngOnInit(): void {
    console.log(this.commonService.isEdit)
  //  if (this.commonService.isEdit != 'true') {
      if (this.commonService.commonData && this.commonService.commonData.Emp_Company_ID){
        
      }
      console.log(this.commonService.commonData)
      //let empId = this.commonService.commonData.Emp_Company_ID;

      let empId = localStorage.getItem('employee_id')
      let attendanceLogs: any = [];
      // Fetch attendance logs by employee ID
      this.employeeService.getAttendanceLogsByEmpId(empId).subscribe((data: any) => {
        attendanceLogs = data[0];
        console.log('attendance logs',attendanceLogs);

        // If attendanceLogs is defined, process the logs
        if (attendanceLogs != undefined) {
          for (const row of attendanceLogs) {
            this.INITIAL_EVENTS.push(this.transformAttendanceLog(row));
            this.working_days += Number(this.attendanceCalculation[row.Status.trim()]);
          }
        }

        // Call getEmpDetailsById only after processing attendance logs
        this.employeeService.getEmpDetailsById(empId).subscribe((empData: any) => {
          console.log(empData)
          const weekOff1 = empData[0].Weekly_Off1;
          const weekOff2 = empData[0].Weekly_Off2;
          console.log('emp data',empData);

          const year = this.TODAY_STR.substring(0, 4);
          const month = this.TODAY_STR.substring(5, 7);

          // Calculate weekly offs for the given month and year
          const weeklyOffs = this.getWeekOff(year, month, weekOff1, weekOff2);

          // Iterate through each calculated weekly off
          weeklyOffs.forEach((day) => {
            const existingLog = attendanceLogs.find(
              (log: any) => log.AttendanceDate.split('T')[0] === day
            );

            if (!existingLog) {
              this.working_days += 1;
              this.INITIAL_EVENTS.push(this.transformAttendanceLog({
                Status: 'WO',
                AttendanceDate: day
              }));
            }
          });

          // Update calendar options to include initial events
          this.calendarOptions = {
            ...this.calendarOptions,
            initialEvents: [...this.INITIAL_EVENTS]
          };

          this.showCalendar = true;
        });

      }, (error) => {
        // Handle error if getAttendanceLogsByEmpId fails
        console.error('Error fetching attendance logs:', error);
      });
   // }
  }

  // Method to handle date range changes
  handleDatesSet(dateInfo: DatesSetArg) {
    console.log('Visible dates changed:');
    console.log('Start:', dateInfo.view.currentStart.toISOString());
    console.log('End:', dateInfo.view.currentEnd.toISOString());
  }

  getWeekOff(
    year: any,
    month: any,
    weekoff1: keyof typeof Day,
    weekoff2: keyof typeof Day
  ) {
    // Convert day names to numeric values using the enum
    const weekoffDay1 = Day[weekoff1];
    const weekoffDay2 = Day[weekoff2];

    const dates: string[] = [];

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    // Iterate through each day of the month
    for (let date = startDate; date <= endDate; date = new Date(date.getTime() + 24 * 60 * 60 * 1000)) {
      const day = date.getUTCDay(); // Use UTC day to avoid time zone issues
      // console.log(`Checking date: ${date.toISOString().split('T')[0]}, Day: ${day}`); // Debugging output
      if (day === weekoffDay1 || day === weekoffDay2) {
        // Format the date as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        dates.push(formattedDate);
      }
    }

    return dates;
  }


  transformAttendanceLog(attendanceLog: any) {
    return {
      id: this.createEventId(),
      title: attendanceLog.Status,
      backgroundColor: this.backgroundColorChange(attendanceLog.Status.trim()),
      start: attendanceLog.AttendanceDate.split('T')[0] // Extracting the date part
    };
  }

  createEventId() {
    return String(this.eventGuid++);
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  // handleDateSelect(selectInfo: DateSelectArg) {
  //   this.openPopup();
  // }
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Please enter a new title for your event');
  //   this.calendarApi = selectInfo.view.calendar;
  //   console.log(this.calendarApi);
  //   this.calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     this.calendarApi.addEvent({
  //       id: this.createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //       mydate: null
  //     });
  //   }
  // }

  handleEventClick(clickInfo: EventClickArg) {

    const selectedEventId = clickInfo.event.id;
    this.calendarApi = clickInfo.view.calendar;
    this.globalEventId = selectedEventId;
    this.previousAttendanceType = clickInfo.event.title.trim();
    this.previousAttendance = Number(this.attendanceCalculation[clickInfo.event.title.trim()])

   // if (Number(localStorage.getItem('userType')) !== 3) {
      this.openPopup(clickInfo.event.start);
    //}

    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // } else {
    //   const selectedEventId = clickInfo.event.id;
    //   this.globalEventId = selectedEventId;
    //   this.openPopup();

    //   if (this.calendarApi) {
    //     const event = this.calendarApi.getEventById(selectedEventId);

    //     if (event) {
    //       if (localStorage.getItem('leave')) {
    //         const leaveData = localStorage.getItem('leave');

    //         if (leaveData) {
    //           if (this.leave.length <= 0) {
    //             this.leave = JSON.parse(leaveData);
    //             event.setProp('title', this.leave[0].title);
    //           }
    //           this.openPopup();
    //         }
    //       }
    //     }
    //   }
    // }
  }

  handleEvents(events: EventApi[]) {
  }

  openPopup(startDate: Date | null):void {
    
    let empId = localStorage.getItem('employee_id')
    const event = this.calendarApi?.getEventById(this.globalEventId)
    const currentStatus = event ? event.title : "Absent";
    const formattedAttendanceDate = this.datePipe.transform(startDate, 'yyyy-MM-ddTHH:mm:ss.SSS');
    this.dialogRef = this.dialog.open(DisputeReqComponent, {
      height: this.heightWidth.height,
      width: this.heightWidth.width,
      data:{
        EmployeeId: empId,
        AttendanceDate: formattedAttendanceDate,
        Current_status: event ? event.title : "",
        Requested_status: '',
        Reason: '',
      }
    });

    
  }

  backgroundColorChange(Status: any): string {
    if (Status == 'WO') {
      return 'grey';
    } else if (Status == 'Present') {
      return 'green';
    } else if (Status == 'Absent') {
      return 'red';
    } else {
      return 'blue';
    }
  }

  Back() {
    this.route.queryParams.subscribe((params: any) => {
      this.router.navigate(['/', 'dashboard', 'emplist'], { queryParams: { type: params.type, unique: params.unique } });
    });
  }
}

