import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../login/services/auth.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @ViewChild("panel_opened", { read: ViewContainerRef }) panel_opened: ViewContainerRef;

  openned: boolean = false;
  tabLoadContent: string[] = [];
  notification: Notification;
  notifications: Notification[] = [];

  get graphAuthenticated(): boolean { return this.authService.graphAuthenticated; }
  get authenticated(): boolean { return this.authService.graphAuthenticated; }

  constructor( private authService: AuthService ) {
  }

  ngOnInit(): void {
  }

  openItem(notification: Notification) {
    this.notification = notification;
    this.panel_opened.element.nativeElement.classList.remove("notification__panel-opened");
  }
  goBack() {
    this.panel_opened.element.nativeElement.classList.add("notification__panel-opened");
  }

  async signIn(): Promise<void> { 
    await this.authService.signIn();
  }

  getContentLoaded(index: number) {
    if ( !this.tabLoadContent[index] ) {
      this.tabLoadContent[index] = '';
    }

    return this.tabLoadContent[index];
  }
}
