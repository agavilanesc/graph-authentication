import { Component, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Notification } from './shared/models/notification';
import { IconApiService } from './shared/services/icon-api.service';
import { LoginLoaderIndicatorService } from './login/services/login-loader-indicator.service';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graph-authentication';
  icons: any;
  notifications: Notification[] = [];
  message: string;
  loading: Subject<boolean> = this.loginLoaderIndicatorService.loading$;
  
  constructor( private iconService: IconApiService, 
               private iconRegistry: MatIconRegistry, 
               private sanitizer: DomSanitizer,
               private loginLoaderIndicatorService: LoginLoaderIndicatorService,
               private cdRef: ChangeDetectorRef ) {
  }

  ngAfterViewChecked() { this.cdRef.detectChanges(); }

  ngOnInit() {
    this.iconService.getIcons().subscribe(data => {
      this.icons = data;
      this.icons.forEach(icon => {
        this.iconRegistry.addSvgIcon(icon.name, this.sanitizer.bypassSecurityTrustResourceUrl(icon.url));
      });
    });
  }
}
