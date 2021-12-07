import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth, } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';

import * as moment from 'moment-timezone';
import { findIana } from 'windows-iana';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { AuthService } from '../../../login/services/auth.service';
import { GraphService } from '../../services/graph.service'
import { ProgressIndicatorService } from '../../services/progress-indicator.service'


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#23DA31',
    secondary: '#179120',
  },
  gray: {
    primary: '#AAAAAA',
    secondary: '#717171',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('calendarMonth', { static: true }) calendarMonth: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setAllEvents() {
    this.events = [];
    
    if ( this.graphEvents ) {
      this.graphEvents.forEach( (graphEvent: MicrosoftGraph.Event) => {
        const event: CalendarEvent = {
          start: new Date(graphEvent.start.dateTime),
          end: new Date(graphEvent.end.dateTime),
          title: `${graphEvent.subject}, ⏰ ${moment(graphEvent.start.dateTime).format("HH:mm")} - ${moment(graphEvent.end.dateTime).format("HH:mm")} 
                  ${new Date() >= new Date(graphEvent.start.dateTime) && new Date() <= new Date(graphEvent.end.dateTime) && !graphEvent.isCancelled? "- [ reunión en curso ]": "" }`,
          color: graphEvent.isCancelled? 
                    colors.gray:
                    new Date() >= new Date(graphEvent.start.dateTime) && new Date() <= new Date(graphEvent.end.dateTime)?
                        colors.red:
                        new Date(graphEvent.end.dateTime) < new Date()?
                            colors.yellow:
                            colors.green,
          cssClass: graphEvent.isCancelled? 'cancelled': '',
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
        };
  
        this.events.push(event);
      });
    }
  }

  async getGraphEvents(): Promise<void> {
    // Convert the user's timezone to IANA format
    this.progressIndicatorService.show();
    const ianaName = findIana( this.authService.user?.azure_time_zone ?? 'UTC');
    const timeZone = ianaName![0].valueOf() || this.authService.user?.azure_time_zone || 'UTC';

    // Get midnight on the start of the current week in the user's timezone,
    // but in UTC. For example, for Pacific Standard Time, the time value would be
    // 07:00:00Z
    //let startOfWeek = moment.tz(timeZone).startOf('week').utc();
    //let endOfWeek = moment(startOfWeek).add(7, 'day');
    let startOfMonth = moment(this.viewDate).tz(timeZone).startOf('month').utc();
    let endOfMonth =  moment(this.viewDate).tz(timeZone).endOf('month').utc();

    await this.graphService.getCalendarView (
      startOfMonth.format(),
      endOfMonth.format(),
      this.authService.user?.azure_time_zone ?? 'UTC' ).then((events) => {
        this.graphEvents = events;
        // Temporary to display raw results
        console.log('Events from Graph', JSON.stringify(events, null, 2));
      });
    
    this.setAllEvents();
    this.progressIndicatorService.hide();
  }

  /**
   *  GRAPH CODE
   */

  public graphEvents?: MicrosoftGraph.Event[];

  constructor( private authService: AuthService, 
               private graphService: GraphService,
               private progressIndicatorService: ProgressIndicatorService ) { }

  async ngOnInit(): Promise<void> {
    await this.getGraphEvents();
  }

  formatDateTimeTimeZone(dateTime: MicrosoftGraph.DateTimeTimeZone | undefined | null): string {
    if (dateTime == undefined || dateTime == null) {
      return '';
    }
  
    try {
      // Pass UTC for the time zone because the value
      // is already adjusted to the user's time zone
      return moment.tz(dateTime.dateTime, 'UTC').format();

    } catch(error) {
      console.log('DateTimeTimeZone conversion error', JSON.stringify(error));
      return '';
    }
  }
}
