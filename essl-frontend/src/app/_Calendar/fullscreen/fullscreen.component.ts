import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi, CalendarApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../../_Popup/calendar/calendar.component';
import { CommonService } from '../../_Resolver/common.service';
import { EmployeeService } from '../../_Services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fullscreen',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule
  ],
  templateUrl: './fullscreen.component.html',
  styleUrl: './fullscreen.component.scss'
})
export class FullscreenComponent implements OnInit {
  @ViewChild('fullCalendar') calendarComponent!: FullCalendarComponent;
  showCalendar = false;
  param = '';
  eventGuid = 0;
  globalEventId = '0';
  leave: any[] = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  INITIAL_EVENTS: EventInput[] = [
  ];
  calendarVisible = true;
  calendarApi?: CalendarApi;
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
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  heightWidth = { height: 'auto', width: 'auto' };

  constructor(public dialog: MatDialog, private commonService: CommonService, private employeeSerive: EmployeeService
  ) {

  }
  ngOnInit(): void {
    let empId = this.commonService.commonData.Emp_ID;
    this.employeeSerive.getAttendanceLogsByEmpId(empId).subscribe((data: any) => {

      for (const data1 of data[0]) {
        this.INITIAL_EVENTS.push(this.transformAttendanceLog(data1));
      }

      this.calendarOptions = {
        ...this.calendarOptions, // Spread the existing options
        initialEvents: [...this.INITIAL_EVENTS] // Update initialEvents
      };

      this.showCalendar = true

    });

  }

  transformAttendanceLog(attendanceLog: any) {
    return {
      id: this.createEventId(),
      title: attendanceLog.Status === "Present" ? "Present" : "Absent",
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

    this.openPopup(clickInfo.event.start);
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

  openPopup(startDate: any) {
    const dialogRef = this.dialog.open(CalendarComponent, {
      height: this.heightWidth.height,
      width: this.heightWidth.width
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (this.calendarApi) {
        let event = this.calendarApi.getEventById(this.globalEventId);

        if (event) {
          event.setProp('title', data[0].title);
          event.setStart(startDate);
          let body = {
            Status: data[0].title,
            AttendanceDate : startDate
          }
          console.log(this.commonService.commonData.Emp_ID);

          this.employeeSerive.updateLeaveInAttendanceLog(this.commonService.commonData.Emp_ID, body).subscribe((data) => {
            console.log(data);
            
          });


        }
      }
    });
  }
}
