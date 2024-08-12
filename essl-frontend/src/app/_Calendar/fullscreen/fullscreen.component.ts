import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, CalendarApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../../_Popup/calendar/calendar.component';

@Component({
  selector: 'fullscreen',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './fullscreen.component.html',
  styleUrl: './fullscreen.component.scss'
})
export class FullscreenComponent implements OnInit {
  param = '';
  eventGuid = 0;
  globalEventId = '0';
  leave: any[] = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  INITIAL_EVENTS: EventInput[] = [
    {
      id: this.createEventId(),
      title: 'All-day event',
      start: this.TODAY_STR
    }
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
    initialEvents: this.INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
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

  constructor(public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
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
    this.openPopup();
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

  openPopup() {
    const dialogRef = this.dialog.open(CalendarComponent, {
      height: this.heightWidth.height,
      width: this.heightWidth.width
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      console.log(this.calendarApi);
      if (this.calendarApi) {
        let event = this.calendarApi.getEventById(this.globalEventId);

        if (event) {
          event.setProp('title', data[0].title);
        }
      }
    });
  }
}
