import { Component, OnInit } from '@angular/core';
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
  leave: any[] = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  INITIAL_EVENTS: EventInput[] = [
    {
      id: this.createEventId(),
      title: 'All-day event',
      start: this.TODAY_STR
    },
    {
      id: this.createEventId(),
      title: 'Timed event',
      start: this.TODAY_STR + 'T00:00:00',
      end: this.TODAY_STR + 'T03:00:00'
    },
    {
      id: this.createEventId(),
      title: 'Timed event',
      start: this.TODAY_STR + 'T12:00:00',
      end: this.TODAY_STR + 'T15:00:00'
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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  heightWidth = { height: 'auto', width: 'auto' };

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('leave')) {
      const leaveData = localStorage.getItem('leave');

      if (leaveData) {
        this.leave = JSON.parse(leaveData);
        
        if (this.calendarApi) {
          this.calendarApi.addEvent({
            id: this.createEventId(),
            title: this.leave[0].value,
          });
        }
      }
    }
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

  handleDateSelect(selectInfo: DateSelectArg) {
    this.openPopup();
  }
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Please enter a new title for your event');
  //   this.calendarApi = selectInfo.view.calendar;

  //   this.calendarApi.unselect(); // clear date selection

  //   if (title) {
      // this.calendarApi.addEvent({
      //   id: this.createEventId(),
      //   title,
      //   start: selectInfo.startStr,
      //   end: selectInfo.endStr,
      //   allDay: selectInfo.allDay,
      //   mydate: null
      // });
  //   }
  // }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    } else {
      const selectedEventId = clickInfo.event.id;

      if (this.calendarApi) {
        const event = this.calendarApi.getEventById(selectedEventId);
        
        if (event) {
          event.setProp('title', 'Updated Title');
        }
      }
    }
  }

  handleEvents(events: EventApi[]) {
    console.log(events);
  }

  openPopup() {
    const dialogRef = this.dialog.open(CalendarComponent, {
      height: this.heightWidth.height,
      width: this.heightWidth.width
    });
  }
}
