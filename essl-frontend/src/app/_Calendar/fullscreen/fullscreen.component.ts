import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventApi, CalendarApi, DatesSetArg } from '@fullcalendar/core';
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
import { Day } from '../../enum/dayEnum';


@Component({
  selector: 'fullscreen',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
  ],
  templateUrl: './fullscreen.component.html',
  styleUrl: './fullscreen.component.scss'
})
export class FullscreenComponent implements OnInit {
  @ViewChild('fullCalendar') calendarComponent!: FullCalendarComponent;
  showCalendar = false;
  working_days: any
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
    datesSet: this.handleDatesSet.bind(this),
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

      for (const row of data[0]) {
        console.log('row', row.Status);
        this.INITIAL_EVENTS.push(this.transformAttendanceLog(row));
      }

      this.employeeSerive.getEmpDetailsById(empId).subscribe((data: any) => {
        console.log(data);
        let weekOff1 = data[0].Weekly_Off1
        let weekOff2 = data[0].Weekly_Off2

        let year = this.TODAY_STR.substring(0, 4)
        let month = this.TODAY_STR.substring(5, 7)

        let weeklyOffs = this.getWeekOff(year, month, weekOff1, weekOff2)
        weeklyOffs.forEach((day, index) => {
          this.INITIAL_EVENTS.push(this.transformAttendanceLog({
            Status: 'WO',
            AttendanceDate: day
          }));
        });
        this.calendarOptions = {
          ...this.calendarOptions, // Spread the existing options
          initialEvents: [...this.INITIAL_EVENTS] // Update initialEvents
        };

        this.showCalendar = true
      })


    });

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
    console.log(year, month, startDate, endDate, weekoffDay1, weekoffDay2);

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

    console.log(dates);
    return dates;
  }


  transformAttendanceLog(attendanceLog: any) {
    return {
      id: this.createEventId(),
      title: attendanceLog.Status,
      backgroundColor: this.backgroundColorChange(attendanceLog.Status),
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
          event.setProp('backgroundColor', this.backgroundColorChange(data[0].title));

          let body = {
            Status: data[0].title,
            AttendanceDate: startDate
          }
          console.log(this.commonService.commonData.Emp_ID);

          this.employeeSerive.updateLeaveInAttendanceLog(this.commonService.commonData.Emp_ID, body).subscribe((data) => {
            console.log(data);

          });
        }
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
}
