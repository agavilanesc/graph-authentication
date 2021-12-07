import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { UserComponent } from './components/user/user.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { CalendarModule } from 'angular-calendar';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { ProgressIndicatorComponent } from './components/progress-indicator/progress-indicator.component';
import { ProgressIndicatorInterceptorService } from './services/progress-indicator-interceptor.service';

@NgModule({
  declarations: [
    MainHeaderComponent,
    UserComponent, 
    NotificationsComponent, 
    CalendarComponent, 
    CalendarHeaderComponent, 
    ProgressIndicatorComponent, 
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CalendarModule
  ],
  exports: [
    MaterialModule,
    MainHeaderComponent,
    UserComponent, 
    NotificationsComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    ProgressIndicatorComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressIndicatorInterceptorService,
      multi: true
    }
  ],
})
export class SharedModule { }
